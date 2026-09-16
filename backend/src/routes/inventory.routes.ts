import { Router } from 'express';
import { getInventory, updateInventory } from '../controllers/inventory.controller';
import { authenticateJwt } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

router.use(authenticateJwt);

// Both Admin and Sales can view inventory
router.get('/', getInventory);

// Only Admin can update stock levels
router.patch('/:productId', authorizeRoles('ADMIN'), updateInventory);

export default router;
