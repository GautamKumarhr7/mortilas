import { Request, Response, NextFunction } from 'express';
import { RolePermissionService } from '../services/role_permission.service.js';

export class RolePermissionController {
  private rolePermissionService: RolePermissionService;

  constructor() {
    this.rolePermissionService = new RolePermissionService();
  }

  getAllRolePermissions = async (req: Request, res: Response, next: NextFunction) => {
    const rolePermissions = await this.rolePermissionService.getAllRolePermissions();
    res.status(200).json({ success: true, data: rolePermissions });
  };

  getRolePermissionById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const rolePermission = await this.rolePermissionService.getRolePermissionById(id);
    if (!rolePermission) {
      res.status(404).json({ success: false, message: 'RolePermission not found' });
      return;
    }
    res.status(200).json({ success: true, data: rolePermission });
  };

  createRolePermission = async (req: Request, res: Response, next: NextFunction) => {
    if (Array.isArray(req.body)) {
      const rolePermissions = await this.rolePermissionService.createMultipleRolePermissions(req.body);
      res.status(201).json({ success: true, data: rolePermissions });
    } else {
      const rolePermission = await this.rolePermissionService.createRolePermission(req.body);
      res.status(201).json({ success: true, data: rolePermission });
    }
  };

  updateRolePermission = async (req: Request, res: Response, next: NextFunction) => {
    const roleId = parseInt(req.params.roleId as string, 10);
    const rolePermissions = await this.rolePermissionService.updateRolePermissionsByRoleId(roleId, req.body);
    res.status(200).json({ success: true, data: rolePermissions });
  };

  deleteRolePermission = async (req: Request, res: Response, next: NextFunction) => {
    const roleId = parseInt(req.params.roleId as string, 10);
    await this.rolePermissionService.deleteRolePermissionsByRoleId(roleId);
    res.status(200).json({ success: true, message: 'RolePermissions deleted' });
  };

  getModulesAndSubmodulesByRoleId = async (req: Request, res: Response, next: NextFunction) => {
    const roleId = parseInt(req.params.roleId as string, 10);
    if (isNaN(roleId)) {
      res.status(400).json({ success: false, message: 'Invalid roleId' });
      return;
    }
    const modules = await this.rolePermissionService.getModulesAndSubmodulesByRoleId(roleId);
    res.status(200).json({ success: true, data: modules });
  };
}
