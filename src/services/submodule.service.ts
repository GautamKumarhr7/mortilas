import { SubModuleRepository } from '../repositories/submodule.repository.js';
import { SubModule, NewSubModule } from '../models/index.js';

export class SubModuleService {
  private submoduleRepository: SubModuleRepository;

  constructor() {
    this.submoduleRepository = new SubModuleRepository();
  }

  async getAllSubModules(): Promise<SubModule[]> {
    return await this.submoduleRepository.findAll();
  }

  async getSubModuleById(id: number): Promise<SubModule | undefined> {
    return await this.submoduleRepository.findById(id);
  }

  async createSubModule(data: NewSubModule): Promise<SubModule> {
    return await this.submoduleRepository.create(data);
  }

  async updateSubModule(id: number, data: Partial<NewSubModule>): Promise<SubModule | undefined> {
    return await this.submoduleRepository.update(id, data);
  }

  async deleteSubModule(id: number): Promise<SubModule | undefined> {
    return await this.submoduleRepository.delete(id);
  }
}
