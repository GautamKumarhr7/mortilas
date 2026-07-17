import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { rolePermissions } from '../models/authority/role_permission.model.js';
import { permissions } from '../models/authority/permission.model.js';
import { submodules } from '../models/authority/submodule.model.js';
import { and, eq } from 'drizzle-orm';

export const authorize = (submoduleCode: string, permissionCode: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized: User not authenticated' });
      return;
    }

    if (!req.user.roleId && !req.user.designationId) {
      res.status(403).json({ success: false, message: 'Forbidden: User has no assigned role' });
      return;
    }
    const roleId = req.user.roleId || req.user.designationId;
    console.log(roleId);
    try {
      const result = await db
        .select({
          id: rolePermissions.id,
        })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .innerJoin(submodules, eq(rolePermissions.subModuleId, submodules.id))
        .where(
          and(
            eq(rolePermissions.roleId, roleId),
            eq(submodules.code, submoduleCode),
            eq(permissions.code, permissionCode),
          ),
        );
      console.log(result);
      if (result.length === 0) {
        res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
