import { Request, Response, NextFunction } from 'express';
import { SiteService } from '../../services/projectMaster/site.service.js';

export class SiteController {
  private siteService: SiteService;

  constructor() {
    this.siteService = new SiteService();
  }

  getAllSites = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sites = await this.siteService.getAllSites();
      res.status(200).json({ success: true, data: sites });
    } catch (error) {
      next(error);
    }
  };

  getSiteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const site = await this.siteService.getSiteById(id);
      if (!site) {
        res.status(404).json({ success: false, message: 'Site not found' });
        return;
      }
      res.status(200).json({ success: true, data: site });
    } catch (error) {
      next(error);
    }
  };

  createSite = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const site = await this.siteService.createSite(req.body);
      res.status(201).json({ success: true, data: site });
    } catch (error) {
      next(error);
    }
  };

  updateSite = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const site = await this.siteService.updateSite(id, req.body);
      if (!site) {
        res.status(404).json({ success: false, message: 'Site not found' });
        return;
      }
      res.status(200).json({ success: true, data: site });
    } catch (error) {
      next(error);
    }
  };

  deleteSite = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const site = await this.siteService.deleteSite(id);
      if (!site) {
        res.status(404).json({ success: false, message: 'Site not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Site deleted' });
    } catch (error) {
      next(error);
    }
  };
}
