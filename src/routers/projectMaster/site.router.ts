import { Router } from 'express';
import { SiteController } from '../../controllers/projectMaster/site.controller.js';

const router = Router();
const siteController = new SiteController();

router.get('/', siteController.getAllSites);
router.get('/:id', siteController.getSiteById);
router.post('/', siteController.createSite);
router.put('/:id', siteController.updateSite);
router.delete('/:id', siteController.deleteSite);

export { router as siteRouter };
