import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();

const VALID_STATUSES = ['new', 'in_progress', 'done', 'cancelled'];

/* ── ציבורי: יצירת הזמנה חדשה ── */
// POST /api/orders
router.post('/', (req, res) => {
  const b = req.body || {};
  const name = String(b.name || '').trim();
  const phone = String(b.phone || '').trim();
  const workType = String(b.work_type || '').trim();

  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'יש להזין שם מלא.' });
  }
  if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) {
    return res.status(400).json({ error: 'יש להזין מספר טלפון תקין.' });
  }
  if (!workType) {
    return res.status(400).json({ error: 'יש לבחור סוג עבודה.' });
  }

  const email = String(b.email || '').trim() || null;
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'כתובת אימייל אינה תקינה.' });
  }

  let pages = parseInt(b.pages, 10);
  if (!Number.isFinite(pages) || pages < 0) pages = null;

  const info = db.prepare(`
    INSERT INTO orders (name, phone, email, work_type, subject, pages, deadline, details)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name,
    phone,
    email,
    workType,
    String(b.subject || '').trim() || null,
    pages,
    String(b.deadline || '').trim() || null,
    String(b.details || '').trim() || null,
  );

  res.status(201).json({ ok: true, id: info.lastInsertRowid });
});

/* ── מוגן: רשימת הזמנות (עם סינון סטטוס אופציונלי) ── */
// GET /api/orders?status=new
router.get('/', requireAuth, (req, res) => {
  const { status } = req.query;
  let rows;
  if (status && VALID_STATUSES.includes(status)) {
    rows = db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC').all(status);
  } else {
    rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  }
  const stats = db.prepare('SELECT status, COUNT(*) AS c FROM orders GROUP BY status').all();
  const counts = { new: 0, in_progress: 0, done: 0, cancelled: 0, total: rows.length };
  for (const s of stats) counts[s.status] = s.c;
  counts.total = db.prepare('SELECT COUNT(*) AS c FROM orders').get().c;
  res.json({ orders: rows, counts });
});

/* ── מוגן: עדכון סטטוס הזמנה ── */
// PATCH /api/orders/:id
router.patch('/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body || {};
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'סטטוס לא חוקי.' });
  }
  const info = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'הזמנה לא נמצאה.' });
  }
  res.json({ ok: true });
});

/* ── מוגן: מחיקת הזמנה ── */
// DELETE /api/orders/:id
router.delete('/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const info = db.prepare('DELETE FROM orders WHERE id = ?').run(id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'הזמנה לא נמצאה.' });
  }
  res.json({ ok: true });
});

export default router;
