import { Router } from 'express';
import { getCustomers, getCustomerById, createCustomer } from '../controllers/customer.controller';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);

export default router;
