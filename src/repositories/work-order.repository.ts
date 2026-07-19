import { eq, like } from 'drizzle-orm';
import { db } from '../db/index.js';
import { workOrders, WorkOrder, NewWorkOrder } from '../models/projectMaster/work-order.model.js';
import { projects } from '../models/projectMaster/project.model.js';
import { subcontractors } from '../models/operation/subcontractor.model.js';

export class WorkOrderRepository {
  async findAll(): Promise<any[]> {
    const result = await db
      .select({
        workOrder: workOrders,
        projectCode: projects.projectCode,
        subcontractorName: subcontractors.companyName,
      })
      .from(workOrders)
      .leftJoin(projects, eq(workOrders.projectId, projects.id))
      .leftJoin(subcontractors, eq(workOrders.subcontractorId, subcontractors.id));

    return result.map(row => ({
      ...row.workOrder,
      projectCode: row.projectCode,
      subcontractorName: row.subcontractorName,
    }));
  }

  async findById(id: number): Promise<any | undefined> {
    const result = await db
      .select({
        workOrder: workOrders,
        projectCode: projects.projectCode,
        subcontractorName: subcontractors.companyName,
      })
      .from(workOrders)
      .leftJoin(projects, eq(workOrders.projectId, projects.id))
      .leftJoin(subcontractors, eq(workOrders.subcontractorId, subcontractors.id))
      .where(eq(workOrders.id, id));

    if (!result.length) return undefined;

    return {
      ...result[0].workOrder,
      projectCode: result[0].projectCode,
      subcontractorName: result[0].subcontractorName,
    };
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
