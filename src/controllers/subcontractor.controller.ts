import { Request, Response, NextFunction } from "express";
import { SubcontractorService } from "../services/subcontractor.service.js";

export class SubcontractorController {
  private subcontractorService: SubcontractorService;

  constructor() {
    this.subcontractorService = new SubcontractorService();
  }

  getAllSubcontractors = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const subcontractors =
      await this.subcontractorService.getAllSubcontractors();
    res.status(200).json({ success: true, data: subcontractors });
  };

  getSubcontractorById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const id = req.params.id as string;
    const subcontractor =
      await this.subcontractorService.getSubcontractorById(id);
    if (!subcontractor) {
      res
        .status(404)
        .json({ success: false, message: "Subcontractor not found" });
      return;
    }
    res.status(200).json({ success: true, data: subcontractor });
  };

  createSubcontractor = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const subcontractor = await this.subcontractorService.createSubcontractor(
      req.body,
    );
    res.status(201).json({ success: true, data: subcontractor });
  };

  updateSubcontractor = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const id = req.params.id as string;
    const subcontractor = await this.subcontractorService.updateSubcontractor(
      id,
      req.body,
    );
    if (!subcontractor) {
      res
        .status(404)
        .json({ success: false, message: "Subcontractor not found" });
      return;
    }
    res.status(200).json({ success: true, data: subcontractor });
  };

  deleteSubcontractor = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const id = req.params.id as string;
    const subcontractor =
      await this.subcontractorService.deleteSubcontractor(id);
    if (!subcontractor) {
      res
        .status(404)
        .json({ success: false, message: "Subcontractor not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Subcontractor deleted" });
  };
}
