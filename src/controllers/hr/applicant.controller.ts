import { Request, Response, NextFunction } from 'express';
import { ApplicantService } from '../../services/hr/applicant.service.js';

export class ApplicantController {
  private service: ApplicantService;
  constructor() {
    this.service = new ApplicantService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ success: true, data: await this.service.getAll() });
    } catch (e) {
      next(e);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.getById(parseInt(req.params.id as string, 10));
      if (!item) {
        res.status(404).json({ success: false, message: 'Applicant not found' });
        return;
      }
      res.json({ success: true, data: item });
    } catch (e) {
      next(e);
    }
  };

  getByJobPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        success: true,
        data: await this.service.getByJobPost(parseInt(req.params.jobPostId as string, 10)),
      });
    } catch (e) {
      next(e);
    }
  };

  apply = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json({ success: true, data: await this.service.apply(req.body) });
    } catch (e) {
      next(e);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.update(parseInt(req.params.id as string, 10), req.body);
      if (!item) {
        res.status(404).json({ success: false, message: 'Applicant not found' });
        return;
      }
      res.json({ success: true, data: item });
    } catch (e) {
      next(e);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.delete(parseInt(req.params.id as string, 10));
      if (!item) {
        res.status(404).json({ success: false, message: 'Applicant not found' });
        return;
      }
      res.json({ success: true, message: 'Deleted' });
    } catch (e) {
      next(e);
    }
  };

  // Workflow actions
  shortlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shortlistedBy } = req.body;
      const item = await this.service.shortlist(
        parseInt(req.params.id as string, 10),
        shortlistedBy,
      );
      res.json({ success: true, data: item });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  };

  scheduleInterview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { interviewDate, interviewedBy, remarks } = req.body;
      const item = await this.service.scheduleInterview(
        parseInt(req.params.id as string, 10),
        new Date(interviewDate),
        interviewedBy,
        remarks,
      );
      res.json({ success: true, data: item });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  };

  select = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { selectedBy } = req.body;
      const item = await this.service.select(parseInt(req.params.id as string, 10), selectedBy);
      res.json({ success: true, data: item });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  };

  reject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rejectedBy, reason } = req.body;
      const item = await this.service.reject(
        parseInt(req.params.id as string, 10),
        rejectedBy,
        reason,
      );
      res.json({ success: true, data: item });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  };

  onboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.onboard(parseInt(req.params.id as string, 10), req.body);
      res.json({
        success: true,
        data: item,
        message: 'Candidate onboarded as employee successfully',
      });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  };
}
