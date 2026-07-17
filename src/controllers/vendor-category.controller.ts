import { Request, Response, NextFunction } from 'express';
import { VendorCategoryService } from '../services/vendor-category.service.js';

export class VendorCategoryController {
  private vendorCategoryService: VendorCategoryService;

  constructor() {
    this.vendorCategoryService = new VendorCategoryService();
  }

  getAllVendorCategories = async (req: Request, res: Response, next: NextFunction) => {
    const vendorCategories = await this.vendorCategoryService.getAllVendorCategories();
    res.status(200).json({ success: true, data: vendorCategories });
  };

  getVendorCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const vendorCategory = await this.vendorCategoryService.getVendorCategoryById(id);
    if (!vendorCategory) {
      res.status(404).json({ success: false, message: 'Vendor category not found' });
      return;
    }
    res.status(200).json({ success: true, data: vendorCategory });
  };

  createVendorCategory = async (req: Request, res: Response, next: NextFunction) => {
    const vendorCategory = await this.vendorCategoryService.createVendorCategory(req.body);
    res.status(201).json({ success: true, data: vendorCategory });
  };

  updateVendorCategory = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const vendorCategory = await this.vendorCategoryService.updateVendorCategory(id, req.body);
    if (!vendorCategory) {
      res.status(404).json({ success: false, message: 'Vendor category not found' });
      return;
    }
    res.status(200).json({ success: true, data: vendorCategory });
  };

  deleteVendorCategory = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const vendorCategory = await this.vendorCategoryService.deleteVendorCategory(id);
    if (!vendorCategory) {
      res.status(404).json({ success: false, message: 'Vendor category not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Vendor category deleted' });
  };
}
