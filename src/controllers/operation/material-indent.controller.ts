import { Request, Response, NextFunction } from 'express';
import { MaterialIndentRepository } from '../../repositories/operation/material-indent.repository.js';
import { NewMaterialIndent } from '../../models/index.js';

export class MaterialIndentController {
  private materialIndentRepository: MaterialIndentRepository;

  constructor() {
    this.materialIndentRepository = new MaterialIndentRepository();
  }

  getAllMaterialIndents = async (req: Request, res: Response, next: NextFunction) => {
    const data = await this.materialIndentRepository.findAll();
    res.status(200).json({ success: true, data });
  };

  createMaterialIndent = async (req: Request, res: Response, next: NextFunction) => {
    const { workOrderId, requestedBy, items } = req.body;
    
    // Generate indent no (simple for now)
    const indentNo = `IND-${Date.now()}`;
    
    const indentData: NewMaterialIndent = {
      indentNo,
      workOrderId: parseInt(workOrderId, 10),
      requestedBy: parseInt(requestedBy, 10),
    };

    const indent = await this.materialIndentRepository.createWithItems(indentData, items);
    res.status(201).json({ success: true, data: indent });
  };
  updateMaterialIndent = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { workOrderId, requestedBy, items, status } = req.body;
    
    const indentData: Partial<NewMaterialIndent> = {
      workOrderId: workOrderId ? parseInt(workOrderId, 10) : undefined,
      requestedBy: requestedBy ? parseInt(requestedBy, 10) : undefined,
      status,
      updatedAt: new Date()
    };

    const indent = await this.materialIndentRepository.updateWithItems(parseInt(id, 10), indentData, items);
    if (!indent) {
        res.status(404).json({ success: false, message: 'Material Indent not found' });
        return;
    }
    res.status(200).json({ success: true, data: indent });
  };

  deleteMaterialIndent = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const indent = await this.materialIndentRepository.delete(parseInt(id, 10));
    if (!indent) {
        res.status(404).json({ success: false, message: 'Material Indent not found' });
        return;
    }
    res.status(200).json({ success: true, data: indent });
  };
}
