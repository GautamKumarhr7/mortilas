import { SiteRepository } from '../../repositories/projectMaster/site.repository.js';
import { Site, NewSite } from '../../models/projectMaster/site.model.js';

export class SiteService {
  private siteRepository: SiteRepository;

  constructor() {
    this.siteRepository = new SiteRepository();
  }

  async getAllSites(): Promise<Site[]> {
    return await this.siteRepository.findAll();
  }

  async getSiteById(id: number): Promise<Site | undefined> {
    return await this.siteRepository.findById(id);
  }

  async createSite(siteData: Partial<NewSite>): Promise<Site> {
    if (!siteData.name) {
      throw new Error('Site name is required');
    }

    let siteCode = siteData.siteCode;
    if (!siteCode) {
      const latestCode = await this.siteRepository.findLatestSiteCode();
      if (latestCode) {
        // e.g., SITE-0001
        const numPart = parseInt(latestCode.replace('SITE-', ''), 10);
        siteCode = `SITE-${(numPart + 1).toString().padStart(4, '0')}`;
      } else {
        siteCode = 'SITE-0001';
      }
    }

    const existingSite = await this.siteRepository.findBySiteCode(siteCode);
    if (existingSite) {
      throw new Error('Site with this code already exists');
    }

    const siteToCreate = {
      ...siteData,
      siteCode,
      status: siteData.status ?? 'planning',
    } as NewSite;

    return await this.siteRepository.create(siteToCreate);
  }

  async updateSite(id: number, siteData: Partial<NewSite>): Promise<Site | undefined> {
    if (siteData.siteCode) {
      const existingSite = await this.siteRepository.findBySiteCode(siteData.siteCode);
      if (existingSite && existingSite.id !== id) {
        throw new Error('Site with this code already exists');
      }
    }

    return await this.siteRepository.update(id, siteData);
  }

  async deleteSite(id: number): Promise<Site | undefined> {
    return await this.siteRepository.delete(id);
  }
}
