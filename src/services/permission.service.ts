import { PermissionRepository } from '../repositories/permission.repository.js';
import { Permission, NewPermission } from '../models/index.js';

export class PermissionService {
  private permissionRepository: PermissionRepository;

  constructor() {
    this.permissionRepository = new PermissionRepository();
  }

  async getAllPermissions(): Promise<Permission[]> {
    return await this.permissionRepository.findAll();
  }

  async getPermissionById(id: number): Promise<Permission | undefined> {
    return await this.permissionRepository.findById(id);
  }

  async createPermission(data: NewPermission): Promise<Permission> {
    return await this.permissionRepository.create(data);
  }

  async updatePermission(id: number, data: Partial<NewPermission>): Promise<Permission | undefined> {
    return await this.permissionRepository.update(id, data);
  }

  async deletePermission(id: number): Promise<Permission | undefined> {
    return await this.permissionRepository.delete(id);
  }
}
