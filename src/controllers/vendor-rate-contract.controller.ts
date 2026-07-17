import { Request, Response, NextFunction } from 'express';
import { VendorRateContractService } from '../services/vendor-rate-contract.service.js';

export class VendorRateContractController {
  private vendorRateContractService: VendorRateContractService;

  constructor() {
    this.vendorRateContractService = new VendorRateContractService();
  }

  getAllVendorRateContracts = async (req: Request, res: Response, next: NextFunction) => {
    const vendorRateContracts = await this.vendorRateContractService.getAllVendorRateContracts();
    res.status(200).json({ success: true, data: vendorRateContracts });
  };

  getVendorRateContractById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const vendorRateContract = await this.vendorRateContractService.getVendorRateContractById(id);
    if (!vendorRateContract) {
      res.status(404).json({ success: false, message: 'Vendor rate contract not found' });
      return;
    }
    res.status(200).json({ success: true, data: vendorRateContract });
  };

  createVendorRateContract = async (req: Request, res: Response, next: NextFunction) => {
    const vendorRateContract = await this.vendorRateContractService.createVendorRateContract(
      req.body,
    );
    res.status(201).json({ success: true, data: vendorRateContract });
  };

  updateVendorRateContract = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const vendorRateContract = await this.vendorRateContractService.updateVendorRateContract(
      id,
      req.body,
    );
    if (!vendorRateContract) {
      res.status(404).json({ success: false, message: 'Vendor rate contract not found' });
      return;
    }
    res.status(200).json({ success: true, data: vendorRateContract });
  };

  deleteVendorRateContract = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const vendorRateContract = await this.vendorRateContractService.deleteVendorRateContract(id);
    if (!vendorRateContract) {
      res.status(404).json({ success: false, message: 'Vendor rate contract not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Vendor rate contract deleted' });
  };
}
