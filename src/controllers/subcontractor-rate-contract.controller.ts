import { Request, Response, NextFunction } from "express";
import { SubcontractorRateContractService } from "../services/subcontractor-rate-contract.service.js";

export class SubcontractorRateContractController {
  private subcontractorRateContractService: SubcontractorRateContractService;

  constructor() {
    this.subcontractorRateContractService =
      new SubcontractorRateContractService();
  }

  getAllSubcontractorRateContracts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const subcontractorRateContracts =
      await this.subcontractorRateContractService.getAllSubcontractorRateContracts();
    res.status(200).json({ success: true, data: subcontractorRateContracts });
  };

  getSubcontractorRateContractById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const id = parseInt(req.params.id as string, 10);
    const subcontractorRateContract =
      await this.subcontractorRateContractService.getSubcontractorRateContractById(
        id,
      );
    if (!subcontractorRateContract) {
      res
        .status(404)
        .json({
          success: false,
          message: "Subcontractor rate contract not found",
        });
      return;
    }
    res.status(200).json({ success: true, data: subcontractorRateContract });
  };

  createSubcontractorRateContract = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const subcontractorRateContract =
      await this.subcontractorRateContractService.createSubcontractorRateContract(
        req.body,
      );
    res.status(201).json({ success: true, data: subcontractorRateContract });
  };

  updateSubcontractorRateContract = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const id = parseInt(req.params.id as string, 10);
    const subcontractorRateContract =
      await this.subcontractorRateContractService.updateSubcontractorRateContract(
        id,
        req.body,
      );
    if (!subcontractorRateContract) {
      res
        .status(404)
        .json({
          success: false,
          message: "Subcontractor rate contract not found",
        });
      return;
    }
    res.status(200).json({ success: true, data: subcontractorRateContract });
  };

  deleteSubcontractorRateContract = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const id = parseInt(req.params.id as string, 10);
    const subcontractorRateContract =
      await this.subcontractorRateContractService.deleteSubcontractorRateContract(
        id,
      );
    if (!subcontractorRateContract) {
      res
        .status(404)
        .json({
          success: false,
          message: "Subcontractor rate contract not found",
        });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "Subcontractor rate contract deleted" });
  };
}
