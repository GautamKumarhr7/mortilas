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

  async createMultipleRolePermissions(data: NewRolePermission[]): Promise<RolePermission[]> {
    return await this.rolePermissionRepository.createMultiple(data);
  }

  async updateRolePermissionsByRoleId(roleId: number, data: NewRolePermission[]): Promise<RolePermission[]> {
    return await this.rolePermissionRepository.updateByRoleId(roleId, data);
  }

  async deleteRolePermissionsByRoleId(roleId: number): Promise<void> {
    return await this.rolePermissionRepository.deleteByRoleId(roleId);
  }

  async getModulesAndSubmodulesByRoleId(roleId: number) {
    return await this.rolePermissionRepository.findModulesAndSubmodulesByRoleId(roleId);
  }
}
