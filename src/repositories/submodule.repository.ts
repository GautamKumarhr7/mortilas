import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { submodules, SubModule, NewSubModule } from '../models/index.js';

export class SubModuleRepository {
  async findAll(): Promise<SubModule[]> {
    return await db.select().from(submodules);
  }

  async findById(id: number): Promise<SubModule | undefined> {
    const result = await db.select().from(submodules).where(eq(submodules.id, id));
    return result[0];
  }

  async findByModuleId(moduleId: number): Promise<SubModule[]> {
    return await db.select().from(submodules).where(eq(submodules.moduleId, moduleId));
  }

  async create(data: NewSubModule): Promise<SubModule> {
    const result = await db.insert(submodules).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<NewSubModule>): Promise<SubModule | undefined> {
    const result = await db
      .update(submodules)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(submodules.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<SubModule | undefined> {
    const result = await db.delete(submodules).where(eq(submodules.id, id)).returning();
    return result[0];
  }
}
