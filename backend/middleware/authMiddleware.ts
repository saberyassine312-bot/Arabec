import { Response, NextFunction } from 'express';
import { authenticateJWT, requireRole, AuthenticatedRequest } from './auth';

export { authenticateJWT, requireRole };
export type { AuthenticatedRequest };

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  authenticateJWT(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'منطقة محظورة: يرجى تسجيل الدخول بحساب مسؤول النظام.' });
    }
  });
}
