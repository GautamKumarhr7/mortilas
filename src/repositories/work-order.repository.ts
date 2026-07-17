import { eq, like } from 'drizzle-orm';
import { db } from '../db/index.js';
import { workOrders, WorkOrder, NewWorkOrder } from '../models/projectMaster/work-order.model.js';

export class WorkOrderRepository {
  async findAll(): Promise<WorkOrder[]> {
    return await db.select().from(workOrders);
  }

  async findById(id: number): Promise<WorkOrder | undefined> {
    const result = await db.select().from(workOrders).where(eq(workOrders.id, id));
    return result[0];
  }

  async findByWorkOrderNo(workOrderNo: string): Promise<WorkOrder | undefined> {
    const result = await db
      .select()
      .from(workOrders)
      .where(eq(workOrders.workOrderNo, workOrderNo));
    return result[0];
  }

  async findWorkOrderNosByPrefix(prefix: string): Promise<string[]> {
    const result = await db
      .select({ workOrderNo: workOrders.workOrderNo })
      .from(workOrders)
      .where(like(workOrders.workOrderNo, `${prefix}%`));

    return result.map((row) => row.workOrderNo);
  }

  async create(workOrder: NewWorkOrder): Promise<WorkOrder> {
    const result = await db.insert(workOrders).values(workOrder).returning();
    return result[0];
  }

  async update(id: number, workOrder: Partial<NewWorkOrder>): Promise<WorkOrder | undefined> {
    const result = await db
      .update(workOrders)
      .set({ ...workOrder, updatedAt: new Date() })
      .where(eq(workOrders.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<WorkOrder | undefined> {
    const result = await db.delete(workOrders).where(eq(workOrders.id, id)).returning();
    return result[0];
  }
}
