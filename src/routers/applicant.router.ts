import { Router } from 'express';
import { ApplicantController } from '../controllers/applicant.controller.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
const ctrl = new ApplicantController();

// CRUD
router.get('/', authenticate, asyncWrapper(ctrl.getAll));
router.get('/job-post/:jobPostId', authenticate, asyncWrapper(ctrl.getByJobPost)); // all applicants for a job
router.get('/:id', authenticate, asyncWrapper(ctrl.getById));
router.post('/', asyncWrapper(ctrl.apply));           // public — applicant submits application
router.put('/:id', authenticate, asyncWrapper(ctrl.update));
router.delete('/:id', authenticate, asyncWrapper(ctrl.delete));

// Recruitment workflow
router.patch('/:id/shortlist', authenticate, asyncWrapper(ctrl.shortlist));
router.patch('/:id/schedule-interview', authenticate, asyncWrapper(ctrl.scheduleInterview));
router.patch('/:id/select', authenticate, asyncWrapper(ctrl.select));
router.patch('/:id/reject', authenticate, asyncWrapper(ctrl.reject));
router.patch('/:id/onboard', authenticate, asyncWrapper(ctrl.onboard)); // creates employee record

export { router as applicantRouter };
