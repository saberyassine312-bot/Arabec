import express from 'express';
import { AuthController } from '../controllers/authController';

const router = express.Router();

router.post('/admin/login', AuthController.adminLogin);

export default router;
