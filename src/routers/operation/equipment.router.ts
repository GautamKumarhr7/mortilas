import { Router } from 'express';
import { EquipmentService } from '../../services/operation/equipment.service.js';

const router = Router();
const service = new EquipmentService();

router.get('/', async (req, res) => {
  try {
    const data = await service.getAllEquipments();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await service.createEquipment(req.body);
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await service.getEquipmentDetails(req.params.id);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await service.updateEquipment(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await service.deleteEquipment(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Deployment
router.post('/:id/deploy', async (req, res) => {
  try {
    const data = await service.deployEquipment(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id/deploy/:deploymentId/return', async (req, res) => {
  try {
    const data = await service.returnEquipment(req.params.deploymentId, req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Maintenance
router.post('/:id/maintenance', async (req, res) => {
  try {
    const data = await service.logMaintenance(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Logs
router.post('/:id/logs', async (req, res) => {
  try {
    const data = await service.logFuelOrUtilization(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
