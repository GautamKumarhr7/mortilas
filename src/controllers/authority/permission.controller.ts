import { Request, Response, NextFunction } from 'express';
import { PermissionService } from '../../services/authority/permission.service.js';

export class PermissionController {
  private permissionService: PermissionService;

  constructor() {
    this.permissionService = new PermissionService();
  }

  getAllPermissions = async (req: Request, res: Response, next: NextFunction) => {
    const permissions = await this.permissionService.getAllPermissions();
    res.status(200).json({ success: true, data: permissions });
  };

  getPermissionById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const permission = await this.permissionService.getPermissionById(id);
    if (!permission) {
      res.status(404).json({ success: false, message: 'Permission not found' });
      return;
    }
    res.status(200).json({ success: true, data: permission });
  };

  createPermission = async (req: Request, res: Response, next: NextFunction) => {
    const permission = await this.permissionService.createPermission(req.body);
    res.status(201).json({ success: true, data: permission });
  };

  updatePermission = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const permission = await this.permissionService.updatePermission(id, req.body);
    if (!permission) {
      res.status(404).json({ success: false, message: 'Permission not found' });
      return;
    }
    res.status(200).json({ success: true, data: permission });
  };

  deletePermission = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const permission = await this.permissionService.deletePermission(id);
    if (!permission) {
      res.status(404).json({ success: false, message: 'Permission not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Permission deleted' });
  };
}
