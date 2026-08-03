import { WorkOrderRepository } from '../../repositories/operation/work-order.repository.js';
import { ProjectRepository } from '../../repositories/projectMaster/project.repository.js';
import { WorkOrder, NewWorkOrder } from '../../models/projectMaster/work-order.model.js';
import { generateWorkOrderNo } from '../../helpers/work-order.helper.js';

export class WorkOrderService {
  private workOrderRepository: WorkOrderRepository;
  private projectRepository: ProjectRepository;

  constructor() {
    this.workOrderRepository = new WorkOrderRepository();
    this.projectRepository = new ProjectRepository();
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

    const project = await this.projectRepository.findById(workOrderData.projectId);
    if (!project) {
      throw new Error('Invalid project ID');
    }

    const baseWorkOrderNo = `WO-${project.projectCode}`;
    const workOrderNo = generateWorkOrderNo(
      baseWorkOrderNo,
      await this.workOrderRepository.findWorkOrderNosByPrefix(baseWorkOrderNo)
    );

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
    // We intentionally ignore workOrderNo updates as it's a fixed generated ID
    const { workOrderNo, ...dataToUpdate } = workOrderData as any;
    return await this.workOrderRepository.update(id, dataToUpdate);
  }

  async deleteWorkOrder(id: number): Promise<WorkOrder | undefined> {
    return await this.workOrderRepository.delete(id);
  }
}
