import { Request, Response, NextFunction } from "express";
import { WorkOrderService } from "../services/work-order.service.js";

export class WorkOrderController {
  private workOrderService: WorkOrderService;

  constructor() {
    this.workOrderService = new WorkOrderService();
  }

  getAllWorkOrders = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const workOrders = await this.workOrderService.getAllWorkOrders();
    res.status(200).json({ success: true, data: workOrders });
  };

  getWorkOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const id = parseInt(req.params.id as string, 10);
    const workOrder = await this.workOrderService.getWorkOrderById(id);
    if (!workOrder) {
      res.status(404).json({ success: false, message: "Work order not found" });
      return;
    }
    res.status(200).json({ success: true, data: workOrder });
  };

  createWorkOrder = async (req: Request, res: Response, next: NextFunction) => {
    const workOrder = await this.workOrderService.createWorkOrder(req.body);
    res.status(201).json({ success: true, data: workOrder });
  };

  updateWorkOrder = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const workOrder = await this.workOrderService.updateWorkOrder(id, req.body);
    if (!workOrder) {
      res.status(404).json({ success: false, message: "Work order not found" });
      return;
    }
    res.status(200).json({ success: true, data: workOrder });
  };

  deleteWorkOrder = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const workOrder = await this.workOrderService.deleteWorkOrder(id);
    if (!workOrder) {
      res.status(404).json({ success: false, message: "Work order not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Work order deleted" });
  };
}
