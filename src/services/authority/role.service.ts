import { RoleRepository } from '../../repositories/role.repository.js';
import { Role, NewRole } from '../../models/index.js';

export class RoleService {
  private roleRepository: RoleRepository;

  constructor() {
    this.roleRepository = new RoleRepository();
  }

  async getAllRoles(): Promise<Role[]> {
    return await this.roleRepository.findAll();
  }

  async getRoleById(id: number): Promise<Role | undefined> {
    return await this.roleRepository.findById(id);
  }

  async createRole(data: NewRole): Promise<Role> {
    return await this.roleRepository.create(data);
  }

  async updateRole(id: number, data: Partial<NewRole>): Promise<Role | undefined> {
    return await this.roleRepository.update(id, data);
  }

  async deleteRole(id: number): Promise<Role | undefined> {
    return await this.roleRepository.delete(id);
  }
}
