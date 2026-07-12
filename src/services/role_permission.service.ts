import { RolePermissionRepository } from '../repositories/role_permission.repository.js';
import { RolePermission, NewRolePermission } from '../models/index.js';

export class RolePermissionService {
  private rolePermissionRepository: RolePermissionRepository;

  constructor() {
    this.rolePermissionRepository = new RolePermissionRepository();
  }

  async getAllRolePermissions(): Promise<RolePermission[]> {
    return await this.rolePermissionRepository.findAll();
  }

  async getRolePermissionById(id: number): Promise<RolePermission | undefined> {
    return await this.rolePermissionRepository.findById(id);
  }

  async createRolePermission(data: NewRolePermission): Promise<RolePermission> {
    return await this.rolePermissionRepository.create(data);
  }

  async updateRolePermission(id: number, data: Partial<NewRolePermission>): Promise<RolePermission | undefined> {
    return await this.rolePermissionRepository.update(id, data);
  }

  async deleteRolePermission(id: number): Promise<RolePermission | undefined> {
    return await this.rolePermissionRepository.delete(id);
  }

  async getModulesAndSubmodulesByRoleId(roleId: number) {
    return await this.rolePermissionRepository.findModulesAndSubmodulesByRoleId(roleId);
  }
}
