import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../../services/authority/role.service.js';

export class RoleController {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
    const roles = await this.roleService.getAllRoles();
    res.status(200).json({ success: true, data: roles });
  };

  getRoleById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const role = await this.roleService.getRoleById(id);
    if (!role) {
      res.status(404).json({ success: false, message: 'Role not found' });
      return;
    }
    res.status(200).json({ success: true, data: role });
  };

  createRole = async (req: Request, res: Response, next: NextFunction) => {
    const role = await this.roleService.createRole(req.body);
    res.status(201).json({ success: true, data: role });
  };

  updateRole = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const role = await this.roleService.updateRole(id, req.body);
    if (!role) {
      res.status(404).json({ success: false, message: 'Role not found' });
      return;
    }
    res.status(200).json({ success: true, data: role });
  };

  deleteRole = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const role = await this.roleService.deleteRole(id);
    if (!role) {
      res.status(404).json({ success: false, message: 'Role not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Role deleted' });
  };
}
