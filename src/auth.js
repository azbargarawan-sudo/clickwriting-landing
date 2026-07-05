import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'node:crypto';
import db from './db.js';

const SECRET = process.env.SESSION_SECRET || 'dev-insecure-secret-change-me';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 שעות
export const COOKIE_NAME = 'cw_session';

/* ── הצפנת סיסמאות (scrypt) ── */

export function hashPassword(plain) {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(plain, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(plain, stored) {
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;
  const derived = scryptSync(plain, salt, 64);
  const keyBuf = Buffer.from(key, 'hex');
  return keyBuf.length === derived.length && timingSafeEqual(keyBuf, derived);
}

/* ── טוקן התחברות חתום (HMAC, בסגנון JWT מינימלי) ── */

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

export function signToken(payload) {
  const body = { ...payload, exp: Date.now() + TOKEN_TTL_MS };
  const data = base64url(JSON.stringify(body));
  const sig = createHmac('sha256', SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const [data, sig] = token.split('.');
  if (!data || !sig) return null;
  const expected = createHmac('sha256', SECRET).update(data).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/* ── ניתוח עוגיות ומידלוור הגנה ── */

export function parseCookies(req) {
  const header = req.headers.cookie;
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

export function requireAuth(req, res, next) {
  const token = parseCookies(req)[COOKIE_NAME];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'לא מורשה. יש להתחבר.' });
  }
  req.admin = payload;
  next();
}

/* ── יצירת אדמין ראשוני אם אין ── */

export function ensureAdminSeed() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM admins').get().c;
  if (count > 0) return;
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)')
    .run(username, hashPassword(password));
  console.log(`\n👤 נוצר משתמש אדמין ראשוני:  שם=${username}  סיסמה=${password}`);
  console.log('   מומלץ לשנות אותם בקובץ .env בפרודקשן.\n');
}
