import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parseCookies, ensureAdminSeed } from './src/auth.js';
import db, { initDb } from './src/db.js';
import authRoutes from './src/routes/auth.js';
import orderRoutes from './src/routes/orders.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── תמיכה בעוגיות (מינימלי, ללא תלות חיצונית) ── */
app.use((req, res, next) => {
  req.cookies = parseCookies(req);
  res.cookie = (name, value, opts = {}) => {
    const parts = [`${name}=${encodeURIComponent(value)}`];
    if (opts.maxAge) parts.push(`Max-Age=${Math.floor(opts.maxAge / 1000)}`);
    parts.push(`Path=${opts.path || '/'}`);
    if (opts.httpOnly) parts.push('HttpOnly');
    if (opts.secure) parts.push('Secure');
    parts.push(`SameSite=${opts.sameSite || 'Lax'}`);
    res.append('Set-Cookie', parts.join('; '));
    return res;
  };
  res.clearCookie = (name, opts = {}) => {
    res.append('Set-Cookie', `${name}=; Max-Age=0; Path=${opts.path || '/'}`);
    return res;
  };
  next();
});

/* ── API ── */
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

/* ── הגנה על עמוד הניהול: הפניה למסך התחברות אם אין טוקן ── */
// (המסך עצמו מטפל בהתחברות; זו רק שכבת נוחות)

/* ── קבצים סטטיים ── */
app.use(express.static(join(__dirname, 'public')));

/* ── 404 ל-API ── */
app.use('/api', (req, res) => res.status(404).json({ error: 'לא נמצא.' }));

/* ── מטפל שגיאות מרכזי ── */
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('❌ שגיאת שרת:', err);
  res.status(500).json({ error: 'שגיאת שרת פנימית.' });
});

/* ── אתחול מסד הנתונים ואז הרצת השרת ── */
await initDb();
await ensureAdminSeed();

app.listen(PORT, () => {
  console.log(`\n🚀 כתיבה בקליק פועל על  http://localhost:${PORT}  (DB: ${db.name})`);
  console.log(`   • אתר:      http://localhost:${PORT}/`);
  console.log(`   • ניהול:    http://localhost:${PORT}/admin.html\n`);
});
