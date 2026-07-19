import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { purchaseOrders, PurchaseOrder, NewPurchaseOrder } from '../models/operation/purchase-order.model.js';
import { purchaseOrderItems, PurchaseOrderItem, NewPurchaseOrderItem } from '../models/operation/purchase-order-item.model.js';

export class PurchaseOrderRepository {
  async findAll(): Promise<PurchaseOrder[]> {
    return await db.select().from(purchaseOrders);
  }

  async findById(id: number): Promise<PurchaseOrder | undefined> {
    const result = await db.select().from(purchaseOrders).where(eq(purchaseOrders.id, id));
    return result[0];
  }

  async create(po: NewPurchaseOrder, items: NewPurchaseOrderItem[]): Promise<PurchaseOrder> {
    return await db.transaction(async (tx) => {
      const createdPO = await tx.insert(purchaseOrders).values(po).returning();
      const poId = createdPO[0].id;
      
      const itemsToInsert = items.map(item => ({ ...item, poId }));
      if (itemsToInsert.length > 0) {
          await tx.insert(purchaseOrderItems).values(itemsToInsert);
      }
      return createdPO[0];
    });
  }

  async update(id: number, po: Partial<NewPurchaseOrder>): Promise<PurchaseOrder | undefined> {
    const result = await db
      .update(purchaseOrders)
      .set({ ...po, updatedAt: new Date() })
      .where(eq(purchaseOrders.id, id))
      .returning();
    return result[0];
  }
}
