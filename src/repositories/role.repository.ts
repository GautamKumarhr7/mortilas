import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { roles, Role, NewRole } from '../models/index.js';

export class RoleRepository {
  async findAll(): Promise<Role[]> {
    return await db.select().from(roles);
  }

  async findById(id: number): Promise<Role | undefined> {
    const result = await db.select().from(roles).where(eq(roles.id, id));
    return result[0];
  }

  async create(data: NewRole): Promise<Role> {
    const result = await db.insert(roles).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<NewRole>): Promise<Role | undefined> {
    const result = await db.update(roles).set({ ...data, updatedAt: new Date() }).where(eq(roles.id, id)).returning();
    return result[0];
  }

  async delete(id: number): Promise<Role | undefined> {
    const result = await db.delete(roles).where(eq(roles.id, id)).returning();
    return result[0];
  }
}
