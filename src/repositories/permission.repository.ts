import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { permissions, Permission, NewPermission } from '../models/index.js';

export class PermissionRepository {
  async findAll(): Promise<Permission[]> {
    return await db.select().from(permissions);
  }

  async findById(id: number): Promise<Permission | undefined> {
    const result = await db.select().from(permissions).where(eq(permissions.id, id));
    return result[0];
  }

  async create(data: NewPermission): Promise<Permission> {
    const result = await db.insert(permissions).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<NewPermission>): Promise<Permission | undefined> {
    const result = await db
      .update(permissions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(permissions.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<Permission | undefined> {
    const result = await db.delete(permissions).where(eq(permissions.id, id)).returning();
    return result[0];
  }
}
