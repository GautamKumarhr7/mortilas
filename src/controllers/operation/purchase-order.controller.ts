import { Request, Response, NextFunction } from 'express';
import { PurchaseOrderRepository } from '../../repositories/purchase-order.repository.js';
import { NewPurchaseOrder } from '../../models/index.js';

export class PurchaseOrderController {
  private poRepository: PurchaseOrderRepository;

  constructor() {
    this.poRepository = new PurchaseOrderRepository();
  }

  getAllPurchaseOrders = async (req: Request, res: Response, next: NextFunction) => {
    const data = await this.poRepository.findAll();
    res.status(200).json({ success: true, data });
  };

  createPurchaseOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { vendorId, indentId, projectId, items } = req.body;
    
    // Generate PO no
    const poNo = `PO-${Date.now()}`;
    
    const poData: NewPurchaseOrder = {
      poNo,
      vendorId,
      indentId: indentId ? parseInt(indentId, 10) : undefined,
      projectId: projectId ? parseInt(projectId, 10) : undefined,
      createdBy: req.user?.id,
    };

    const po = await this.poRepository.createWithItems(poData, items);
    res.status(201).json({ success: true, data: po });
  };
}
