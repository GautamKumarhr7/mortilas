import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { purchaseOrders, PurchaseOrder, NewPurchaseOrder, purchaseOrderItems, NewPurchaseOrderItem } from '../models/index.js';

export class PurchaseOrderRepository {
  async findAll(): Promise<PurchaseOrder[]> {
    return await db.select().from(purchaseOrders);
  }

  async findById(id: number): Promise<PurchaseOrder | undefined> {
    const result = await db.select().from(purchaseOrders).where(eq(purchaseOrders.id, id));
    return result[0];
  }

  async createWithItems(data: NewPurchaseOrder, items: Omit<NewPurchaseOrderItem, 'poId' | 'amount'>[]): Promise<PurchaseOrder> {
    return await db.transaction(async (tx) => {
      // Calculate total value
      let totalValue = 0;
      const processedItems = items.map(item => {
        const qty = parseFloat(item.quantity as string);
        const rate = parseFloat(item.rate as string);
        const amount = qty * rate;
        totalValue += amount;
        return {
          ...item,
          amount: amount.toString()
        };
      });

      const poData = { ...data, totalValue: totalValue.toString() };
      const poResult = await tx.insert(purchaseOrders).values(poData).returning();
      const po = poResult[0];

      if (processedItems.length > 0) {
        const itemsToInsert = processedItems.map(item => ({
          ...item,
          poId: po.id
        }));
        await tx.insert(purchaseOrderItems).values(itemsToInsert as any);
      }
      return po;
    });
  }
}
