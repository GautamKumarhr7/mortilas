import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { module, Module, NewModule } from '../models/index.js';

export class ModuleRepository {
  async findAll(): Promise<Module[]> {
    return await db.select().from(module);
  }

  async findById(id: number): Promise<Module | undefined> {
    const result = await db.select().from(module).where(eq(module.id, id));
    return result[0];
  }

  async create(data: NewModule): Promise<Module> {
    const result = await db.insert(module).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<NewModule>): Promise<Module | undefined> {
    const result = await db.update(module).set({ ...data, updatedAt: new Date() }).where(eq(module.id, id)).returning();
    return result[0];
  }

  async delete(id: number): Promise<Module | undefined> {
    const result = await db.delete(module).where(eq(module.id, id)).returning();
    return result[0];
  }
}
