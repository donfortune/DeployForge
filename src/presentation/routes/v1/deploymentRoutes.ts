import deploymentController from '../../controllers/deploymentController';
import { Router } from 'express';

const router = Router();

router.get('/', deploymentController.getAllDeployments);
router.post('/', deploymentController.createDeployment);
router.patch('/:id/status', deploymentController.updateStatus);

export default router;