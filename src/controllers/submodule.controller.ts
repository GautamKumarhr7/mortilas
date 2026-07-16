import { Request, Response, NextFunction } from "express";
import { SubModuleService } from "../services/submodule.service.js";

export class SubModuleController {
  private submoduleService: SubModuleService;

  constructor() {
    this.submoduleService = new SubModuleService();
  }

  getAllSubModules = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const submodules = await this.submoduleService.getAllSubModules();
    res.status(200).json({ success: true, data: submodules });
  };

  getSubModuleById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const id = parseInt(req.params.id as string, 10);
    const submodule = await this.submoduleService.getSubModuleById(id);
    if (!submodule) {
      res.status(404).json({ success: false, message: "SubModule not found" });
      return;
    }
    res.status(200).json({ success: true, data: submodule });
  };

  // getSubModulesByModuleId = async (req: Request, res: Response, next: NextFunction) => {
  //   const moduleId = parseInt(req.params.moduleId as string, 10);
  //   const submodules = await this.submoduleService.getSubModulesByModuleId(moduleId);
  //   res.status(200).json({ success: true, data: submodules });
  // };
  async getSubModulesByModuleId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const moduleId = parseInt(req.params.moduleId as string, 10);
    const submodules =
      await this.submoduleService.getSubModulesByModuleId(moduleId);
    res.status(200).json({ success: true, data: submodules });
  }

  createSubModule = async (req: Request, res: Response, next: NextFunction) => {
    const submodule = await this.submoduleService.createSubModule(req.body);
    res.status(201).json({ success: true, data: submodule });
  };

  updateSubModule = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const submodule = await this.submoduleService.updateSubModule(id, req.body);
    if (!submodule) {
      res.status(404).json({ success: false, message: "SubModule not found" });
      return;
    }
    res.status(200).json({ success: true, data: submodule });
  };

  deleteSubModule = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const submodule = await this.submoduleService.deleteSubModule(id);
    if (!submodule) {
      res.status(404).json({ success: false, message: "SubModule not found" });
      return;
    }
    res.status(200).json({ success: true, message: "SubModule deleted" });
  };
}
