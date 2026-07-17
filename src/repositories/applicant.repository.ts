import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { applicants, Applicant, NewApplicant } from '../models/hr/applicant.model.js';

export class ApplicantRepository {
  async findAll(): Promise<Applicant[]> {
    return await db.select().from(applicants);
  }

  async findById(id: number): Promise<Applicant | undefined> {
    const result = await db.select().from(applicants).where(eq(applicants.id, id));
    return result[0];
  }

  async findByJobPost(jobPostId: number): Promise<Applicant[]> {
    return await db.select().from(applicants).where(eq(applicants.jobPostId, jobPostId));
  }

  async create(data: NewApplicant): Promise<Applicant> {
    const result = await db.insert(applicants).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<NewApplicant>): Promise<Applicant | undefined> {
    const result = await db
      .update(applicants)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(applicants.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<Applicant | undefined> {
    const result = await db.delete(applicants).where(eq(applicants.id, id)).returning();
    return result[0];
  }
}
