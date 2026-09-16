import { Router } from 'express';
import {
  getEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiryStatus,
} from '../controllers/enquiry.controller';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);

router.get('/', getEnquiries);
router.get('/:id', getEnquiryById);
router.post('/', createEnquiry);
router.patch('/:id/status', updateEnquiryStatus);

export default router;
