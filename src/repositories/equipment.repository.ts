import { db } from '../db/index.js';
import { equipments, equipmentDeployments, equipmentMaintenance, equipmentLogs } from '../models/operation/equipment.model.js';
import { eq, desc, and } from 'drizzle-orm';
import { projects } from '../models/projectMaster/project.model.js';
import { vendors } from '../models/vendor.model.js';

export class EquipmentRepository {
  async findAll() {
    return await db
      .select({
        equipment: equipments,
        projectCode: projects.projectCode,
        vendorName: vendors.companyName,
      })
      .from(equipments)
      .leftJoin(projects, eq(equipments.currentProjectId, projects.id))
      .leftJoin(vendors, eq(equipments.vendorId, vendors.id))
      .orderBy(desc(equipments.createdAt));
  }

  async findById(id: string) {
    const result = await db
      .select({
        equipment: equipments,
        projectCode: projects.projectCode,
        vendorName: vendors.companyName,
      })
      .from(equipments)
      .leftJoin(projects, eq(equipments.currentProjectId, projects.id))
      .leftJoin(vendors, eq(equipments.vendorId, vendors.id))
      .where(eq(equipments.id, id));
    
    return result[0];
  }

  async create(data: any) {
    const [result] = await db.insert(equipments).values(data).returning();
    return result;
  }

  async update(id: string, data: any) {
    const [result] = await db
      .update(equipments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(equipments.id, id))
      .returning();
    return result;
  }

  async delete(id: string) {
    const [result] = await db.delete(equipments).where(eq(equipments.id, id)).returning();
    return result;
  }

  // Deployments
  async findDeploymentsByEquipmentId(equipmentId: string) {
    return await db
      .select({
        deployment: equipmentDeployments,
        projectCode: projects.projectCode,
        projectName: projects.name,
      })
      .from(equipmentDeployments)
      .leftJoin(projects, eq(equipmentDeployments.projectId, projects.id))
      .where(eq(equipmentDeployments.equipmentId, equipmentId))
      .orderBy(desc(equipmentDeployments.dispatchDate));
  }

  async createDeployment(data: any) {
    const [result] = await db.insert(equipmentDeployments).values(data).returning();
    return result;
  }

  async updateDeployment(id: string, data: any) {
    const [result] = await db
      .update(equipmentDeployments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(equipmentDeployments.id, id))
      .returning();
    return result;
  }

  // Maintenance
  async findMaintenanceByEquipmentId(equipmentId: string) {
    return await db
      .select()
      .from(equipmentMaintenance)
      .where(eq(equipmentMaintenance.equipmentId, equipmentId))
      .orderBy(desc(equipmentMaintenance.maintenanceDate));
  }

  async createMaintenance(data: any) {
    const [result] = await db.insert(equipmentMaintenance).values(data).returning();
    return result;
  }

  // Logs (Fuel/Utilization)
  async findLogsByEquipmentId(equipmentId: string) {
    return await db
      .select({
        log: equipmentLogs,
        projectCode: projects.projectCode,
      })
      .from(equipmentLogs)
      .leftJoin(projects, eq(equipmentLogs.projectId, projects.id))
      .where(eq(equipmentLogs.equipmentId, equipmentId))
      .orderBy(desc(equipmentLogs.logDate));
  }

  async createLog(data: any) {
    const [result] = await db.insert(equipmentLogs).values(data).returning();
    return result;
  }
}
