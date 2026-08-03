import { Request, Response, NextFunction } from 'express';
import { PurchaseOrderRepository } from '../../repositories/operation/purchase-order.repository.js';
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

  approvePurchaseOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const updatedPo = await this.poRepository.approve(parseInt(id as string, 10));
    
    if (!updatedPo) {
      return res.status(404).json({ success: false, message: 'Purchase Order not found' });
    }

    res.status(200).json({ success: true, data: updatedPo });
  };

  rejectPurchaseOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const updatedPo = await this.poRepository.reject(parseInt(id as string, 10));
    
    if (!updatedPo) {
      return res.status(404).json({ success: false, message: 'Purchase Order not found' });
    }

    res.status(200).json({ success: true, data: updatedPo });
  };

  updateDeliveryStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { deliveryStatus, dispatchDate, arrivalTime } = req.body;

    const updateData: any = { deliveryStatus };
    if (dispatchDate) updateData.dispatchDate = new Date(dispatchDate);
    if (arrivalTime) updateData.arrivalTime = new Date(arrivalTime);

    const updatedPo = await this.poRepository.updateDeliveryStatus(parseInt(id as string, 10), updateData);
    
    if (!updatedPo) {
      return res.status(404).json({ success: false, message: 'Purchase Order not found' });
    }

    res.status(200).json({ success: true, data: updatedPo });
  };

  getPoWithItems = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await this.poRepository.findWithItems(parseInt(id as string, 10));
    if (!result) {
      return res.status(404).json({ success: false, message: 'Purchase Order not found' });
    }
    res.status(200).json({ success: true, data: result });
  };

  generateInvoice = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { unitPrices, notes } = req.body;

    const result = await this.poRepository.generateInvoice(parseInt(id as string, 10), { unitPrices, notes });
    res.status(200).json({ success: true, data: result });
  };
}
