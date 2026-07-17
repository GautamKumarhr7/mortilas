import { eq, like } from 'drizzle-orm';
import { db } from '../db/index.js';
import { projects, Project, NewProject } from '../models/projectMaster/project.model.js';

export class ProjectRepository {
  async findAll(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async findById(id: number): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }

  async findByProjectCode(projectCode: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.projectCode, projectCode));
    return result[0];
  }

  async findProjectCodesByPrefix(prefix: string): Promise<string[]> {
    const result = await db
      .select({ projectCode: projects.projectCode })
      .from(projects)
      .where(like(projects.projectCode, `${prefix}%`));

    return result.map((row) => row.projectCode);
  }

  async create(project: NewProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async update(id: number, project: Partial<NewProject>): Promise<Project | undefined> {
    const result = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<Project | undefined> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result[0];
  }
}
