import express from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Apply requireAdmin middleware to protect all administration metrics
router.get('/dashboard/stats', requireAdmin, DashboardController.getStats);
router.get('/dashboard/analytics', requireAdmin, DashboardController.getAnalytics);
router.get('/students', requireAdmin, DashboardController.getStudentsList);
router.get('/student/:id', requireAdmin, DashboardController.getStudentProfile);
router.get('/ranking', requireAdmin, DashboardController.getRankings);
router.get('/dashboard/activities', requireAdmin, DashboardController.getRecentActivities);

export default router;
