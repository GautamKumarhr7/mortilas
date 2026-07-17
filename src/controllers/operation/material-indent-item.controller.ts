import { Request, Response, NextFunction } from 'express';
import { MaterialIndentItemService } from '../../services/operation/material-indent-item.service.js';

export class MaterialIndentItemController {
  private materialIndentItemService: MaterialIndentItemService;

  constructor() {
    this.materialIndentItemService = new MaterialIndentItemService();
  }

  getAllMaterialIndentItems = async (req: Request, res: Response, next: NextFunction) => {
    const materialIndentItems = await this.materialIndentItemService.getAllMaterialIndentItems();
    res.status(200).json({ success: true, data: materialIndentItems });
  };

  getMaterialIndentItemById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const materialIndentItem = await this.materialIndentItemService.getMaterialIndentItemById(id);
    if (!materialIndentItem) {
      res.status(404).json({ success: false, message: 'Material indent item not found' });
      return;
    }
    res.status(200).json({ success: true, data: materialIndentItem });
  };

  createMaterialIndentItem = async (req: Request, res: Response, next: NextFunction) => {
    const materialIndentItem = await this.materialIndentItemService.createMaterialIndentItem(
      req.body,
    );
    res.status(201).json({ success: true, data: materialIndentItem });
  };

  updateMaterialIndentItem = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const materialIndentItem = await this.materialIndentItemService.updateMaterialIndentItem(
      id,
      req.body,
    );
    if (!materialIndentItem) {
      res.status(404).json({ success: false, message: 'Material indent item not found' });
      return;
    }
    res.status(200).json({ success: true, data: materialIndentItem });
  };

  deleteMaterialIndentItem = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const materialIndentItem = await this.materialIndentItemService.deleteMaterialIndentItem(id);
    if (!materialIndentItem) {
      res.status(404).json({ success: false, message: 'Material indent item not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Material indent item deleted' });
  };
}
