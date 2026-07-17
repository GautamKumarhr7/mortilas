import { ModuleRepository } from '../../repositories/module.repository.js';
import { Module, NewModule } from '../../models/index.js';

export class ModuleService {
  private moduleRepository: ModuleRepository;

  constructor() {
    this.moduleRepository = new ModuleRepository();
  }

  async getAllModules(): Promise<Module[]> {
    return await this.moduleRepository.findAll();
  }

  async getModuleById(id: number): Promise<Module | undefined> {
    return await this.moduleRepository.findById(id);
  }

  async createModule(data: NewModule): Promise<Module> {
    return await this.moduleRepository.create(data);
  }

  async updateModule(id: number, data: Partial<NewModule>): Promise<Module | undefined> {
    return await this.moduleRepository.update(id, data);
  }

  async deleteModule(id: number): Promise<Module | undefined> {
    return await this.moduleRepository.delete(id);
  }
}
