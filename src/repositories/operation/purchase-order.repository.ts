import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import {
  purchaseOrders,
  PurchaseOrder,
  NewPurchaseOrder,
  purchaseOrderItems,
  NewPurchaseOrderItem,
  inventories,
} from '../../models/index.js';

export class PurchaseOrderRepository {
  async findAll(): Promise<PurchaseOrder[]> {
    return await db.select().from(purchaseOrders);
  }

  async findById(id: number): Promise<PurchaseOrder | undefined> {
    const result = await db.select().from(purchaseOrders).where(eq(purchaseOrders.id, id));
    return result[0];
  }

  async createWithItems(
    data: NewPurchaseOrder,
    items: Omit<NewPurchaseOrderItem, 'poId' | 'amount'>[],
  ): Promise<PurchaseOrder> {
    return await db.transaction(async (tx) => {
      // Calculate total value
      let totalValue = 0;
      const processedItems = items.map((item) => {
        const qty = parseFloat(item.quantity as string);
        const rate = parseFloat(item.rate as string);
        const amount = qty * rate;
        totalValue += amount;
        return {
          ...item,
          amount: amount.toString(),
        };
      });

      const poData = { ...data, totalValue: totalValue.toString() };
      const poResult = await tx.insert(purchaseOrders).values(poData).returning();
      const po = poResult[0];

      if (processedItems.length > 0) {
        const itemsToInsert = processedItems.map((item) => ({
          ...item,
          poId: po.id,
        }));
        await tx.insert(purchaseOrderItems).values(itemsToInsert as any);
      }
      return po;
    });
  }

  async approve(id: number): Promise<PurchaseOrder | undefined> {
    const result = await db
      .update(purchaseOrders)
      .set({ status: 'Approved' })
      .where(eq(purchaseOrders.id, id))
      .returning();
    return result[0];
  }

  async reject(id: number): Promise<PurchaseOrder | undefined> {
    const result = await db
      .update(purchaseOrders)
      .set({ status: 'Rejected' })
      .where(eq(purchaseOrders.id, id))
      .returning();
    return result[0];
  }

  async updateDeliveryStatus(
    id: number,
    data: Partial<PurchaseOrder>,
  ): Promise<PurchaseOrder | undefined> {
    const result = await db
      .update(purchaseOrders)
      .set(data)
      .where(eq(purchaseOrders.id, id))
      .returning();
    return result[0];
  }

  async findWithItems(id: number): Promise<{ po: PurchaseOrder; items: any[] } | undefined> {
    const po = await this.findById(id);
    if (!po) return undefined;

    const items = await db
      .select({
        id: purchaseOrderItems.id,
        itemId: purchaseOrderItems.itemId,
        itemName: inventories.itemName,
        unit: inventories.unit,
        quantity: purchaseOrderItems.quantity,
        rate: purchaseOrderItems.rate,
        amount: purchaseOrderItems.amount,
        approvedMake: purchaseOrderItems.approvedMake,
      })
      .from(purchaseOrderItems)
      .leftJoin(inventories, eq(purchaseOrderItems.itemId, inventories.id))
      .where(eq(purchaseOrderItems.poId, id));

    return { po, items };
  }

  async generateInvoice(
    poId: number,
    invoiceData: {
      unitPrices?: { itemId: number; unitPrice: number }[];
      lineItems?: {
        itemId: number;
        averagePrice?: number;
        unitPrice?: number;
        materialName?: string;
      }[];
      notes?: string;
    },
  ): Promise<{ invoiceId: string; totalAmount: number; items: any[] }> {
    // Generate MEMO-{5 digit hex} id
    const hexPart = Math.floor(Math.random() * 0xfffff)
      .toString(16)
      .toUpperCase()
      .padStart(5, '0');
    const invoiceId = `MEMO-${hexPart}`;

    // Fetch items with names
    const result = await this.findWithItems(poId);
    if (!result) throw new Error('Purchase Order not found');

    const priceMap = new Map<number, number>();
    (invoiceData.unitPrices || []).forEach((p) => priceMap.set(p.itemId, p.unitPrice));
    (invoiceData.lineItems || []).forEach((p) => {
      const price = p.averagePrice ?? p.unitPrice;
      if (price !== undefined && price !== null) {
        priceMap.set(p.itemId, Number(price));
      }
    });

    let totalAmount = 0;
    const items = result.items.map((item) => {
      const avgPrice = priceMap.get(item.itemId) ?? parseFloat(item.rate);
      const qty = parseFloat(item.quantity);
      const lineTotal = avgPrice * qty;
      totalAmount += lineTotal;
      return {
        ...item,
        materialName: item.itemName,
        averagePrice: avgPrice,
        quantity: qty,
        lineTotal,
      };
    });

    return { invoiceId, totalAmount, items };
  }
}
