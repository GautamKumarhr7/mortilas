import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { rolePermissions } from '../models/role_permission.model.js';
import { permissions } from '../models/permission.model.js';
import { submodules } from '../models/submodule.model.js';
import { and, eq } from 'drizzle-orm';

export const authorize = (submoduleCode: string, permissionCode: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized: User not authenticated' });
      return;
    }

    if (!req.user.roleId) {
      res.status(403).json({ success: false, message: 'Forbidden: User has no assigned role' });
      return;
    }

    try {
      const result = await db.select({
        id: rolePermissions.id
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .innerJoin(submodules, eq(rolePermissions.subModuleId, submodules.id))
      .where(
        and(
          eq(rolePermissions.roleId, req.user.roleId),
          eq(submodules.code, submoduleCode),
          eq(permissions.code, permissionCode)
        )
      );

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
