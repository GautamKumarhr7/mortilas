import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import {
  subcontractorRateContracts,
  SubcontractorRateContract,
  NewSubcontractorRateContract,
} from '../models/operation/subcontractor-rate-contract.model.js';

export class SubcontractorRateContractRepository {
  async findAll(): Promise<SubcontractorRateContract[]> {
    return await db.select().from(subcontractorRateContracts);
  }

  async findById(id: number): Promise<SubcontractorRateContract | undefined> {
    const result = await db
      .select()
      .from(subcontractorRateContracts)
      .where(eq(subcontractorRateContracts.id, id));
    return result[0];
  }

  async create(data: NewSubcontractorRateContract): Promise<SubcontractorRateContract> {
    const result = await db.insert(subcontractorRateContracts).values(data).returning();
    return result[0];
  }

  async update(
    id: number,
    data: Partial<NewSubcontractorRateContract>,
  ): Promise<SubcontractorRateContract | undefined> {
    const result = await db
      .update(subcontractorRateContracts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(subcontractorRateContracts.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<SubcontractorRateContract | undefined> {
    const result = await db
      .delete(subcontractorRateContracts)
      .where(eq(subcontractorRateContracts.id, id))
      .returning();
    return result[0];
  }
}
