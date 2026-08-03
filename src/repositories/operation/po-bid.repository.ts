import { asc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { poBids, POBid, NewPOBid, vendors, purchaseOrders, materialIndents, materialIndentItems, purchaseOrderItems, workOrders } from '../../models/index.js';

export class POBidRepository {
  async findAll(): Promise<POBid[]> {
    return await db.select().from(poBids);
  }

  async findByIndentId(indentId: number): Promise<any[]> {
    return await db
      .select({
        id: poBids.id,
        indentId: poBids.indentId,
        vendorId: poBids.vendorId,
        amount: poBids.amount,
        materialAveragePrices: poBids.materialAveragePrices,
        status: poBids.status,
        createdAt: poBids.createdAt,
        vendorCode: vendors.vendorCode,
        companyName: vendors.companyName,
        contactPerson: vendors.contactPerson,
      })
      .from(poBids)
      .leftJoin(vendors, eq(poBids.vendorId, vendors.id))
      .where(eq(poBids.indentId, indentId))
      .orderBy(asc(poBids.amount), asc(poBids.createdAt));
  }

  async findByVendorId(vendorId: string): Promise<any[]> {
    return await db
      .select({
        id: poBids.id,
        indentId: poBids.indentId,
        vendorId: poBids.vendorId,
        amount: poBids.amount,
        materialAveragePrices: poBids.materialAveragePrices,
        status: poBids.status,
        createdAt: poBids.createdAt,
      })
      .from(poBids)
      .where(eq(poBids.vendorId, vendorId));
  }

  async create(data: NewPOBid): Promise<POBid> {
    const result = await db.insert(poBids).values(data).returning();
    return result[0];
  }

  async winBid(id: number): Promise<POBid | undefined> {
    return await db.transaction(async (tx) => {
      const bid = await tx.select().from(poBids).where(eq(poBids.id, id));
      const winningBid = bid[0];

      if (!winningBid) return undefined;

      await tx.update(poBids).set({ status: 'Lost' }).where(eq(poBids.indentId, winningBid.indentId));

      const result = await tx
        .update(poBids)
        .set({ status: 'Won' })
        .where(eq(poBids.id, id))
        .returning();

      // Fetch indent + work order to get projectId
      const indent = await tx.select().from(materialIndents).where(eq(materialIndents.id, winningBid.indentId));
      if (!indent[0]) return result[0];

      const wo = await tx.select().from(workOrders).where(eq(workOrders.id, indent[0].workOrderId));
      const projectId = wo[0]?.projectId ?? null;

      // Update indent status to PO Created
      await tx.update(materialIndents).set({ status: 'PO Created' }).where(eq(materialIndents.id, winningBid.indentId));

      // Create PO with generated PO number
      const poNo = `PO-${Date.now()}`;
      const newPO = await tx.insert(purchaseOrders).values({
        poNo,
        indentId: winningBid.indentId,
        vendorId: winningBid.vendorId,
        projectId,
        totalValue: winningBid.amount,
        status: 'Approved',
        deliveryStatus: 'Not Started',
        createdBy: indent[0].requestedBy,
      }).returning();

      const createdPO = newPO[0];

      // Create PO Items from materialAveragePrices: [{ indentItemId, itemId, averagePrice }]
      const prices = winningBid.materialAveragePrices as any[];
      if (prices && Array.isArray(prices) && prices.length > 0) {
        const mItems = await tx.select().from(materialIndentItems).where(eq(materialIndentItems.indentId, winningBid.indentId));
        
        const poItemsData = prices.map(priceItem => {
          const mItem = mItems.find(i => i.id === priceItem.indentItemId);
          const qty = mItem ? Number(mItem.requiredQty) : 1;
          const rate = Number(priceItem.averagePrice) || 0;
          return {
            poId: createdPO.id,
            itemId: priceItem.itemId,
            quantity: String(qty),
            rate: String(rate),
            amount: String(qty * rate),
          };
        });

        if (poItemsData.length > 0) {
          await tx.insert(purchaseOrderItems).values(poItemsData);
        }
      }

      return result[0];
    });
  }

  async loseBid(id: number): Promise<POBid | undefined> {
    const result = await db
      .update(poBids)
      .set({ status: 'Lost' })
      .where(eq(poBids.id, id))
      .returning();
    return result[0];
  }
}
