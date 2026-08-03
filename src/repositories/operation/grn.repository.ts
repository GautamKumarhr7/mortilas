import { asc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { grns, grnItems, NewGRN, NewGRNItem, GRN, poBids, inventories } from '../../models/index.js';
import { PurchaseOrderRepository } from './purchase-order.repository.js';

type HttpError = Error & { statusCode?: number };

function createHttpError(message: string, statusCode: number): HttpError {
  const error = new Error(message) as HttpError;
  error.statusCode = statusCode;
  return error;
}

type GRNItemInput = {
  poItemId: number;
  itemId: number;
  receivedQty?: number | string;
  acceptedQty?: number | string;
  rejectedQty?: number | string;
  averagePrice?: number | string;
  qualityStatus?: string;
  employeeRating?: number;
};

type CreateGRNFromPOInput = {
  poId: number;
  receivedDate: string | Date;
  storeManagerId?: number;
  items?: GRNItemInput[];
};

export class GRNRepository {
  private poRepository = new PurchaseOrderRepository();

  async findAll(): Promise<GRN[]> {
    return await db.select().from(grns);
  }

  async createFromPO(input: CreateGRNFromPOInput): Promise<GRN> {
    return await db.transaction(async (tx) => {
      const poData = await this.poRepository.findWithItems(input.poId);
      if (!poData) throw createHttpError('Purchase Order not found', 404);

      const poItemsById = new Map(poData.items.map((item) => [item.id, item]));
      for (const incomingItem of input.items ?? []) {
        const matchedPoItem = poItemsById.get(incomingItem.poItemId);
        if (!matchedPoItem) {
          throw createHttpError(
            `Purchase order item ${incomingItem.poItemId} was not found for PO ${input.poId}`,
            400,
          );
        }

        if (matchedPoItem.itemId !== incomingItem.itemId) {
          throw createHttpError(
            `Item ${incomingItem.itemId} does not belong to purchase order item ${incomingItem.poItemId}`,
            400,
          );
        }
      }

      const bids = await tx
        .select()
        .from(poBids)
        .where(eq(poBids.indentId, poData.po.indentId!))
        .orderBy(asc(poBids.amount));
      const winningBid = bids.find((bid) => bid.status === 'Won') || bids[0] || null;
      const selectedVendorId = winningBid?.vendorId || poData.po.vendorId;

      const totalBidAmount = bids.reduce((sum, bid) => sum + parseFloat(bid.amount), 0);
      const averageBidPrice = bids.length > 0 ? totalBidAmount / bids.length : 0;
      const winningBidMaterialPrices = Array.isArray(
        (
          winningBid as {
            materialAveragePrices?: Array<{
              poItemId?: number;
              itemId?: number;
              averagePrice?: number | string;
            }>;
          } | null
        )?.materialAveragePrices,
      )
        ? (
            winningBid as {
              materialAveragePrices?: Array<{
                poItemId?: number;
                itemId?: number;
                averagePrice?: number | string;
              }>;
            } | null
          )?.materialAveragePrices || []
        : [];

      const grnNo = `GRN-${Date.now()}`;
      const itemInputMap = new Map((input.items ?? []).map((item) => [item.poItemId, item]));
      const grnItemRows: Array<Omit<NewGRNItem, 'grnId'>> = poData.items.map((poItem) => {
        const incomingItem = itemInputMap.get(poItem.id);
        const receivedQty = incomingItem?.receivedQty ?? poItem.quantity;
        const acceptedQty = incomingItem?.acceptedQty ?? receivedQty;
        const rejectedQty = incomingItem?.rejectedQty ?? 0;
        const matchedBidItem = winningBidMaterialPrices.find(
          (priceItem) => priceItem.poItemId === poItem.id || priceItem.itemId === poItem.itemId,
        );
        const averagePrice =
          incomingItem?.averagePrice ?? matchedBidItem?.averagePrice ?? poItem.rate ?? 0;
        return {
          poItemId: poItem.id,
          itemId: poItem.itemId,
          receivedQty: receivedQty.toString(),
          acceptedQty: acceptedQty.toString(),
          rejectedQty: rejectedQty.toString(),
          averagePrice: averagePrice.toString(),
          qualityStatus: incomingItem?.qualityStatus ?? 'Accepted',
          employeeRating: incomingItem?.employeeRating ?? 1,
        };
      });

      const totalPrice = grnItemRows.reduce(
        (sum, item) => sum + Number(item.acceptedQty || 0) * Number(item.averagePrice || 0),
        0,
      );

      const grnPayload: NewGRN = {
        grnNo,
        poId: input.poId,
        vendorId: selectedVendorId,
        bidId: winningBid?.id,
        averageBidPrice: averageBidPrice.toString(),
        totalPrice: totalPrice.toString(),
        receivedDate: new Date(input.receivedDate),
        storeManagerId: input.storeManagerId,
        status: 'Draft',
      };

      const grnResult = await tx.insert(grns).values(grnPayload).returning();
      const grn = grnResult[0];

      const grnItemRowsWithGrnId: NewGRNItem[] = grnItemRows.map((row) => ({
        ...row,
        grnId: grn.id,
      }));

      if (grnItemRowsWithGrnId.length > 0) {
        await tx.insert(grnItems).values(grnItemRowsWithGrnId);
        
        // Update inventory quantities for accepted items
        for (const row of grnItemRowsWithGrnId) {
          const acceptedQty = parseFloat(row.acceptedQty || '0');
          if (acceptedQty > 0) {
            const inventory = await tx
              .select()
              .from(inventories)
              .where(eq(inventories.id, row.itemId))
              .then(res => res[0]);
              
            if (inventory) {
              const currentQty = parseFloat(inventory.quantity || '0');
              const newQty = (currentQty + acceptedQty).toString();
              await tx
                .update(inventories)
                .set({ quantity: newQty })
                .where(eq(inventories.id, row.itemId));
            }
          }
        }
      }

      return grn;
    });
  }

  async initiatePayment(id: number, financeUserId?: number): Promise<GRN | undefined> {
    const result = await db
      .update(grns)
      .set({
        paymentStatus: 'Payment Initiated',
        paymentInitiatedAt: new Date(),
        paymentInitiatedBy: financeUserId,
      })
      .where(eq(grns.id, id))
      .returning();

    return result[0];
  }
}
