import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { rolePermissions, RolePermission, NewRolePermission, submodules, module, permissions } from '../models/index.js';

export class RolePermissionRepository {
  async findAll(): Promise<RolePermission[]> {
    return await db.select().from(rolePermissions);
  }

  async findById(id: number): Promise<RolePermission | undefined> {
    const result = await db.select().from(rolePermissions).where(eq(rolePermissions.id, id));
    return result[0];
  }

  async create(data: NewRolePermission): Promise<RolePermission> {
    const result = await db.insert(rolePermissions).values(data).returning();
    return result[0];
  }

  async createMultiple(data: NewRolePermission[]): Promise<RolePermission[]> {
    const result = await db.insert(rolePermissions).values(data).returning();
    return result;
  }

  async updateByRoleId(roleId: number, data: NewRolePermission[]): Promise<RolePermission[]> {
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
    if (data && data.length > 0) {
      return await db.insert(rolePermissions).values(data).returning();
    }
    return [];
  }

  async deleteByRoleId(roleId: number): Promise<void> {
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
  }

  async findModulesAndSubmodulesByRoleId(roleId: number) {
    const records = await db.select({
      moduleId: module.id,
      moduleName: module.name,
      moduleCode: module.code,
      submoduleId: submodules.id,
      submoduleName: submodules.name,
      submoduleCode: submodules.code,
      permissionId: permissions.id,
      permissionName: permissions.name,
    })
    .from(rolePermissions)
    .innerJoin(submodules, eq(rolePermissions.subModuleId, submodules.id))
    .innerJoin(module, eq(submodules.moduleId, module.id))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, roleId));

    // Grouping by Module -> Submodule -> Permissions
    const modulesMap = new Map<number, any>();

    for (const record of records) {
      if (!modulesMap.has(record.moduleId)) {
        modulesMap.set(record.moduleId, {
          id: record.moduleId,
          name: record.moduleName,
          code: record.moduleCode,
          submodules: new Map<number, any>()
        });
      }

      const currentModule = modulesMap.get(record.moduleId);

      if (!currentModule.submodules.has(record.submoduleId)) {
        currentModule.submodules.set(record.submoduleId, {
          id: record.submoduleId,
          name: record.submoduleName,
          code: record.submoduleCode,
          permissions: []
        });
      }

      const currentSubmodule = currentModule.submodules.get(record.submoduleId);
      currentSubmodule.permissions.push({
        id: record.permissionId,
        name: record.permissionName
      });
    }

    // Convert Maps back to Arrays
    return Array.from(modulesMap.values()).map(mod => ({
      ...mod,
      submodules: Array.from(mod.submodules.values())
    }));
  }
}
