import { Router } from 'express';
import { ApplicantController } from '../../controllers/hr/applicant.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads/job'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'));
    }
  }
});

const router = Router();
const ctrl = new ApplicantController();

// CRUD
router.get('/', authenticate, asyncWrapper(ctrl.getAll));
router.get('/job-post/:jobPostId', authenticate, asyncWrapper(ctrl.getByJobPost)); // all applicants for a job
router.get('/:id', authenticate, asyncWrapper(ctrl.getById));
router.post('/', upload.single('resume'), asyncWrapper(ctrl.apply)); // public — applicant submits application
router.put('/:id', authenticate, asyncWrapper(ctrl.update));
router.delete('/:id', authenticate, asyncWrapper(ctrl.delete));

// Recruitment workflow
router.patch('/:id/shortlist', authenticate, asyncWrapper(ctrl.shortlist));
router.patch('/:id/schedule-interview', authenticate, asyncWrapper(ctrl.scheduleInterview));
router.patch('/:id/select', authenticate, asyncWrapper(ctrl.select));
router.patch('/:id/reject', authenticate, asyncWrapper(ctrl.reject));
router.patch('/:id/onboard', authenticate, asyncWrapper(ctrl.onboard)); // creates employee record

export { router as applicantRouter };
