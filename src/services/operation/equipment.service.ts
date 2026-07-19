import { EquipmentRepository } from '../../repositories/equipment.repository.js';

export class EquipmentService {
  private repository: EquipmentRepository;

  constructor() {
    this.repository = new EquipmentRepository();
  }

  async getAllEquipments() {
    return await this.repository.findAll();
  }

  async getEquipmentById(id: string) {
    const equipment = await this.repository.findById(id);
    if (!equipment) throw new Error('Equipment not found');
    return equipment;
  }

  async createEquipment(data: any) {
    return await this.repository.create(data);
  }

  async updateEquipment(id: string, data: any) {
    return await this.repository.update(id, data);
  }

  async deleteEquipment(id: string) {
    return await this.repository.delete(id);
  }

  // Details
  async getEquipmentDetails(id: string) {
    const equipment = await this.getEquipmentById(id);
    const deployments = await this.repository.findDeploymentsByEquipmentId(id);
    const maintenance = await this.repository.findMaintenanceByEquipmentId(id);
    const logs = await this.repository.findLogsByEquipmentId(id);

    return {
      ...equipment,
      deployments,
      maintenance,
      logs
    };
  }

  // Deployments
  async deployEquipment(equipmentId: string, data: any) {
    // Check if available
    const equipment = await this.getEquipmentById(equipmentId);
    if (equipment.equipment.status === 'deployed') {
        throw new Error('Equipment is already deployed');
    }
    
    const deployment = await this.repository.createDeployment({
      ...data,
      equipmentId,
      status: 'active'
    });

    // Update equipment status
    await this.repository.update(equipmentId, { 
      status: 'deployed',
      currentProjectId: data.projectId 
    });

    return deployment;
  }

  async returnEquipment(deploymentId: string, equipmentId: string, data: any) {
    const deployment = await this.repository.updateDeployment(deploymentId, {
      ...data,
      status: 'returned',
      actualReturnDate: new Date()
    });

    await this.repository.update(equipmentId, { 
      status: 'available',
      currentProjectId: null 
    });

    return deployment;
  }

  // Maintenance
  async logMaintenance(equipmentId: string, data: any) {
    const maintenance = await this.repository.createMaintenance({
      ...data,
      equipmentId
    });

    if (data.status === 'in_progress') {
      await this.repository.update(equipmentId, { status: 'maintenance' });
    } else if (data.status === 'completed') {
      await this.repository.update(equipmentId, { status: 'available' }); // Assumption: goes back to available, might need better logic if deployed
    }

    return maintenance;
  }

  // Logs
  async logFuelOrUtilization(equipmentId: string, data: any) {
    return await this.repository.createLog({
      ...data,
      equipmentId
    });
  }
}
