import { Router } from 'express';
import { JobPostController } from '../../controllers/hr/job-post.controller.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();
const ctrl = new JobPostController();

router.get('/', asyncWrapper(ctrl.getAll)); // public — applicants can browse
router.get('/:id', asyncWrapper(ctrl.getById)); // public
router.post('/', authenticate, asyncWrapper(ctrl.create));
router.put('/:id', authenticate, asyncWrapper(ctrl.update));
router.patch('/:id/close', authenticate, asyncWrapper(ctrl.close));
router.delete('/:id', authenticate, asyncWrapper(ctrl.delete));

export { router as jobPostRouter };
