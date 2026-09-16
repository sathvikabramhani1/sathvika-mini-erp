import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/dashboard.controller';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);

router.get('/metrics', getDashboardMetrics);
router.get('/', getDashboardMetrics);

export default router;
