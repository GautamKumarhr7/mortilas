import { WorkOrderRepository } from '../../repositories/work-order.repository.js';
import { WorkOrder, NewWorkOrder } from '../../models/projectMaster/work-order.model.js';
import { generateWorkOrderNo, normalizeWorkOrderNo } from '../../helpers/work-order.helper.js';

export class WorkOrderService {
  private workOrderRepository: WorkOrderRepository;

  constructor() {
    this.workOrderRepository = new WorkOrderRepository();
  }

  async getAllWorkOrders(): Promise<WorkOrder[]> {
    return await this.workOrderRepository.findAll();
  }

  async getWorkOrderById(id: number): Promise<WorkOrder | undefined> {
    return await this.workOrderRepository.findById(id);
  }

  async createWorkOrder(workOrderData: Partial<NewWorkOrder>): Promise<WorkOrder> {
    if (!workOrderData.projectId) {
      throw new Error('Project is required');
    }

    const workOrderNo = workOrderData.workOrderNo
      ? normalizeWorkOrderNo(workOrderData.workOrderNo)
      : generateWorkOrderNo(await this.workOrderRepository.findWorkOrderNosByPrefix('WO-'));

    const existingWorkOrder = await this.workOrderRepository.findByWorkOrderNo(workOrderNo);
    if (existingWorkOrder) {
      throw new Error('Work order with this number already exists');
    }

    const workOrderToCreate = {
      ...workOrderData,
      workOrderNo,
      status: workOrderData.status ?? 'pending',
    } as NewWorkOrder;

    return await this.workOrderRepository.create(workOrderToCreate);
  }

  async updateWorkOrder(
    id: number,
    workOrderData: Partial<NewWorkOrder>,
  ): Promise<WorkOrder | undefined> {
    if (workOrderData.workOrderNo) {
      const normalizedWorkOrderNo = normalizeWorkOrderNo(workOrderData.workOrderNo);
      const existingWorkOrder =
        await this.workOrderRepository.findByWorkOrderNo(normalizedWorkOrderNo);
      if (existingWorkOrder && existingWorkOrder.id !== id) {
        throw new Error('Work order with this number already exists');
      }

      return await this.workOrderRepository.update(id, {
        ...workOrderData,
        workOrderNo: normalizedWorkOrderNo,
      });
    }

    return await this.workOrderRepository.update(id, workOrderData);
  }

  async deleteWorkOrder(id: number): Promise<WorkOrder | undefined> {
    return await this.workOrderRepository.delete(id);
  }
}
