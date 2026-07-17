import { Request, Response, NextFunction } from 'express';
import { JobPostService } from '../services/job-post.service.js';

export class JobPostController {
  private service: JobPostService;
  constructor() { this.service = new JobPostService(); }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ success: true, data: await this.service.getAll() });
    } catch (e) { next(e); }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.getById(parseInt(req.params.id as string, 10));
      if (!item) { res.status(404).json({ success: false, message: 'Job post not found' }); return; }
      res.json({ success: true, data: item });
    } catch (e) { next(e); }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json({ success: true, data: await this.service.create(req.body) });
    } catch (e) { next(e); }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.update(parseInt(req.params.id as string, 10), req.body);
      if (!item) { res.status(404).json({ success: false, message: 'Job post not found' }); return; }
      res.json({ success: true, data: item });
    } catch (e) { next(e); }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.delete(parseInt(req.params.id as string, 10));
      if (!item) { res.status(404).json({ success: false, message: 'Job post not found' }); return; }
      res.json({ success: true, message: 'Deleted' });
    } catch (e) { next(e); }
  };

  close = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.close(parseInt(req.params.id as string, 10));
      res.json({ success: true, data: item });
    } catch (e) { next(e); }
  };
}
