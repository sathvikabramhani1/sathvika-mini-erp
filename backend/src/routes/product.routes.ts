import { Router } from 'express';
import { getProducts, getProductById, createProduct } from '../controllers/product.controller';
import { authenticateJwt } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

router.use(authenticateJwt);

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authorizeRoles('ADMIN'), createProduct);

export default router;
