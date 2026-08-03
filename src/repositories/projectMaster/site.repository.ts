import { eq, like, desc } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { sites, Site, NewSite } from '../../models/projectMaster/site.model.js';

export class SiteRepository {
  async findAll(): Promise<Site[]> {
    return await db.select().from(sites);
  }

  async findById(id: number): Promise<Site | undefined> {
    const result = await db.select().from(sites).where(eq(sites.id, id));
    return result[0];
  }

  async findBySiteCode(siteCode: string): Promise<Site | undefined> {
    const result = await db.select().from(sites).where(eq(sites.siteCode, siteCode));
    return result[0];
  }

  async findLatestSiteCode(): Promise<string | undefined> {
    const result = await db
      .select({ siteCode: sites.siteCode })
      .from(sites)
      .orderBy(desc(sites.siteCode))
      .limit(1);
    
    return result[0]?.siteCode;
  }

  async create(site: NewSite): Promise<Site> {
    const result = await db.insert(sites).values(site).returning();
    return result[0];
  }

  async update(id: number, site: Partial<NewSite>): Promise<Site | undefined> {
    const result = await db
      .update(sites)
      .set({ ...site, updatedAt: new Date() })
      .where(eq(sites.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<Site | undefined> {
    const result = await db.delete(sites).where(eq(sites.id, id)).returning();
    return result[0];
  }
}
