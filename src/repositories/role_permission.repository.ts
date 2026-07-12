import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { rolePermissions, RolePermission, NewRolePermission } from '../models/index.js';

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

  async update(id: number, data: Partial<NewRolePermission>): Promise<RolePermission | undefined> {
    const result = await db.update(rolePermissions).set({ ...data, updatedAt: new Date() }).where(eq(rolePermissions.id, id)).returning();
    return result[0];
  }

  async delete(id: number): Promise<RolePermission | undefined> {
    const result = await db.delete(rolePermissions).where(eq(rolePermissions.id, id)).returning();
    return result[0];
  }
}
