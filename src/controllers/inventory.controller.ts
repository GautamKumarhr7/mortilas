import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service.js';

export class InventoryController {
  private inventoryService: InventoryService;

  constructor() {
    this.inventoryService = new InventoryService();
  }

  getAllInventories = async (req: Request, res: Response, next: NextFunction) => {
    const inventories = await this.inventoryService.getAllInventories();
    res.status(200).json({ success: true, data: inventories });
  };

  getInventoryById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const inventory = await this.inventoryService.getInventoryById(id);
    if (!inventory) {
      res.status(404).json({ success: false, message: 'Inventory not found' });
      return;
    }
    res.status(200).json({ success: true, data: inventory });
  };

  createInventory = async (req: Request, res: Response, next: NextFunction) => {
    const inventory = await this.inventoryService.createInventory(req.body);
    res.status(201).json({ success: true, data: inventory });
  };

  updateInventory = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const inventory = await this.inventoryService.updateInventory(id, req.body);
    if (!inventory) {
      res.status(404).json({ success: false, message: 'Inventory not found' });
      return;
    }
    res.status(200).json({ success: true, data: inventory });
  };

  deleteInventory = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const inventory = await this.inventoryService.deleteInventory(id);
    if (!inventory) {
      res.status(404).json({ success: false, message: 'Inventory not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Inventory deleted' });
  };
}
