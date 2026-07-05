import { Router } from 'express';
import db from '../db.js';
import {
  verifyPassword, signToken, requireAuth, COOKIE_NAME, parseCookies, verifyToken,
} from '../auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'יש להזין שם משתמש וסיסמה.' });
  }
  const admin = await db.getAdmin(username);
  if (!admin || !verifyPassword(password, admin.password)) {
    return res.status(401).json({ error: 'שם משתמש או סיסמה שגויים.' });
  }
  const token = signToken({ id: admin.id, username: admin.username });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: req.secure,
    maxAge: 1000 * 60 * 60 * 12,
    path: '/',
  });
  res.json({ ok: true, username: admin.username });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const payload = verifyToken(parseCookies(req)[COOKIE_NAME]);
  if (!payload) return res.status(401).json({ error: 'לא מחובר.' });
  res.json({ username: payload.username });
});

export default router;
