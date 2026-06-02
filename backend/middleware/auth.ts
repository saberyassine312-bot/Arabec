import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'lms-maghribi-intelligence-secret-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
    class?: string;
  };
}

export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({ error: 'صلاحية الجلسة منتهية، يرجى تسجيل الدخول مرة أخرى.' });
        return;
      }
      req.user = decoded as any;
      next();
    });
  } else {
    res.status(401).json({ error: 'غير مصرح بالدخول، يرجى توفير المصادقة اللازمة.' });
  }
}

export function requireRole(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'ليس لديك الصلاحيات اللازمة للقيام بهذا الإجراء.' });
      return;
    }
    next();
  };
}
