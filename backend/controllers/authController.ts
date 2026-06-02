import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { dbCollections } from '../db/localDb';
import { generateToken } from '../middleware/auth';

export class AuthController {
  /**
   * Safe Admin Authentication handler
   */
  static adminLogin(req: Request, res: Response): void {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'الرجاء كتابة البريد الإلكتروني وكلمة المرور للدخول.' });
      return;
    }

    const usersDb = dbCollections.getCollection<any>('users');
    const user = usersDb.findOne(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      res.status(401).json({ error: 'البريد الإلكتروني المدخل غير مسجل كمسؤول نظام.' });
      return;
    }

    // Verify Admin rights
    if (user.role !== 'admin') {
      res.status(403).json({ error: 'عذراً، هذا الحساب لا يملك صلاحيات مسؤول النظام (Admin).' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'كلمة المرور المدخلة غير صحيحة.' });
      return;
    }

    // Generate authenticated JWT Token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      class: user.class
    });

    const { password: _, ...adminSafe } = user;

    res.json({
      token,
      user: adminSafe
    });
  }
}
