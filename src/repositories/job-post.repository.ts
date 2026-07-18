import { eq, not } from 'drizzle-orm';
import { db } from '../db/index.js';
import { jobPosts, JobPost, NewJobPost } from '../models/hr/job-post.model.js';

export class JobPostRepository {
  async findAll(): Promise<JobPost[]> {
    return await db.select().from(jobPosts).where(not(eq(jobPosts.status, 'deleted')));
  }

  async findById(id: number): Promise<JobPost | undefined> {
    const result = await db.select().from(jobPosts).where(eq(jobPosts.id, id));
    return result[0];
  }

  async create(data: NewJobPost): Promise<JobPost> {
    const result = await db.insert(jobPosts).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<NewJobPost>): Promise<JobPost | undefined> {
    const result = await db
      .update(jobPosts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(jobPosts.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<JobPost | undefined> {
    const result = await db.update(jobPosts)
      .set({ status: 'deleted', updatedAt: new Date() })
      .where(eq(jobPosts.id, id))
      .returning();
    return result[0];
  }
}
