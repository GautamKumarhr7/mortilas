import { Request, Response, NextFunction } from 'express';
import { ModuleService } from '../../services/authority/module.service.js';

export class ModuleController {
  private moduleService: ModuleService;

  constructor() {
    this.moduleService = new ModuleService();
  }

  getAllModules = async (req: Request, res: Response, next: NextFunction) => {
    const modules = await this.moduleService.getAllModules();
    res.status(200).json({ success: true, data: modules });
  };

  getModuleById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const module = await this.moduleService.getModuleById(id);
    if (!module) {
      res.status(404).json({ success: false, message: 'Module not found' });
      return;
    }
    res.status(200).json({ success: true, data: module });
  };

  createModule = async (req: Request, res: Response, next: NextFunction) => {
    const module = await this.moduleService.createModule(req.body);
    res.status(201).json({ success: true, data: module });
  };

  updateModule = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const module = await this.moduleService.updateModule(id, req.body);
    if (!module) {
      res.status(404).json({ success: false, message: 'Module not found' });
      return;
    }
    res.status(200).json({ success: true, data: module });
  };

  deleteModule = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const module = await this.moduleService.deleteModule(id);
    if (!module) {
      res.status(404).json({ success: false, message: 'Module not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Module deleted' });
  };
}
