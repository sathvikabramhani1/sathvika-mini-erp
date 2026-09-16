import { Router } from 'express';
import {
  getSalesOrders,
  getSalesOrderById,
  confirmSalesOrder,
  dispatchSalesOrder,
  cancelSalesOrder,
} from '../controllers/salesOrder.controller';
import { authenticateJwt } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

router.use(authenticateJwt);

router.get('/', getSalesOrders);
router.get('/:id', getSalesOrderById);

// Mandatory Test 5: Only ADMIN can confirm sales orders (reserving stock)
router.post('/:id/confirm', authorizeRoles('ADMIN'), confirmSalesOrder);

// Mandatory Test 5: Only ADMIN can process dispatch
router.post('/:id/dispatch', authorizeRoles('ADMIN'), dispatchSalesOrder);

// Order cancellation (releases reserved stock)
router.post('/:id/cancel', cancelSalesOrder);

export default router;
