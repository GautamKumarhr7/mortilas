import { Request, Response, NextFunction } from 'express';
import { VendorService } from '../services/vendor.service.js';

export class VendorController {
  private vendorService: VendorService;

  constructor() {
    this.vendorService = new VendorService();
  }

  getAllVendors = async (req: Request, res: Response, next: NextFunction) => {
    const vendors = await this.vendorService.getAllVendors();
    res.status(200).json({ success: true, data: vendors });
  };

  getVendorById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const vendor = await this.vendorService.getVendorById(id);
    if (!vendor) {
      res.status(404).json({ success: false, message: 'Vendor not found' });
      return;
    }
    res.status(200).json({ success: true, data: vendor });
  };

  createVendor = async (req: Request, res: Response, next: NextFunction) => {
    const vendor = await this.vendorService.createVendor(req.body);
    res.status(201).json({ success: true, data: vendor });
  };

  updateVendor = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const vendor = await this.vendorService.updateVendor(id, req.body);
    if (!vendor) {
      res.status(404).json({ success: false, message: 'Vendor not found' });
      return;
    }
    res.status(200).json({ success: true, data: vendor });
  };

  deleteVendor = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const vendor = await this.vendorService.deleteVendor(id);
    if (!vendor) {
      res.status(404).json({ success: false, message: 'Vendor not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Vendor deleted' });
  };
}
