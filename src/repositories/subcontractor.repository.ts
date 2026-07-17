import { eq, like } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { db } from '../db/index.js';
import { subcontractors, Subcontractor, NewSubcontractor } from '../models/operation/subcontractor.model.js';

export class SubcontractorRepository {
  async findAll(): Promise<Subcontractor[]> {
    return await db.select().from(subcontractors);
  }

  async findById(id: string): Promise<Subcontractor | undefined> {
    const result = await db.select().from(subcontractors).where(eq(subcontractors.id, id));
    return result[0];
  }

  async findBySubcontractorCode(subcontractorCode: string): Promise<Subcontractor | undefined> {
    const result = await db
      .select()
      .from(subcontractors)
      .where(eq(subcontractors.subcontractorCode, subcontractorCode));
    return result[0];
  }

  async findSubcontractorCodesByPrefix(prefix: string): Promise<string[]> {
    const result = await db
      .select({ subcontractorCode: subcontractors.subcontractorCode })
      .from(subcontractors)
      .where(like(subcontractors.subcontractorCode, `${prefix}%`));
    return result.map((row) => row.subcontractorCode);
  }

  async create(subcontractor: NewSubcontractor): Promise<Subcontractor> {
    const result = await db
      .insert(subcontractors)
      .values({ ...subcontractor, id: subcontractor.id ?? randomUUID() })
      .returning();
    return result[0];
  }

  async update(
    id: string,
    subcontractor: Partial<NewSubcontractor>,
  ): Promise<Subcontractor | undefined> {
    const result = await db
      .update(subcontractors)
      .set({ ...subcontractor, updatedAt: new Date() })
      .where(eq(subcontractors.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<Subcontractor | undefined> {
    const result = await db.delete(subcontractors).where(eq(subcontractors.id, id)).returning();
    return result[0];
  }
}
