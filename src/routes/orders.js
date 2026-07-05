import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../auth.js';
import { notifyNewOrder } from '../notify.js';

const router = Router();

const VALID_STATUSES = ['new', 'in_progress', 'done', 'cancelled'];

/* ── ציבורי: יצירת הזמנה חדשה ── */
// POST /api/orders
router.post('/', async (req, res, next) => {
  try {
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

    const id = await db.insertOrder({
      name,
      phone,
      email,
      work_type: workType,
      subject: String(b.subject || '').trim() || null,
      pages,
      deadline: String(b.deadline || '').trim() || null,
      details: String(b.details || '').trim() || null,
    });

    // התראה על הזמנה חדשה — fire-and-forget, לא מעכב ולא מפיל את התגובה
    const order = await db.getOrder(id);
    notifyNewOrder(order).catch((e) => console.error('notify error:', e));

    res.status(201).json({ ok: true, id });
  } catch (e) {
    next(e);
  }
});

/* ── מוגן: רשימת הזמנות (עם סינון סטטוס אופציונלי) ── */
// GET /api/orders?status=new
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status && VALID_STATUSES.includes(status) ? status : undefined;
    const orders = await db.listOrders(filter);
    const counts = await db.statusCounts();
    counts.total = await db.totalCount();
    res.json({ orders, counts });
  } catch (e) {
    next(e);
  }
});

/* ── מוגן: ייצוא כל ההזמנות ל-CSV (נפתח ב-Excel) ── */
// GET /api/orders/export.csv
router.get('/export.csv', requireAuth, async (req, res, next) => {
  try {
    const rows = await db.listOrders();
    const headers = ['מזהה', 'תאריך', 'שם', 'טלפון', 'אימייל', 'סוג עבודה',
      'נושא', 'עמודים', 'דדליין', 'פרטים', 'סטטוס'];
    const statusHe = { new: 'חדש', in_progress: 'בטיפול', done: 'הושלם', cancelled: 'בוטל' };

    const esc = (v) => {
      const s = v == null ? '' : String(v);
      return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };

    const lines = [headers.join(',')];
    for (const o of rows) {
      lines.push([
        o.id, o.created_at, o.name, o.phone, o.email, o.work_type,
        o.subject, o.pages, o.deadline, o.details, statusHe[o.status] || o.status,
      ].map(esc).join(','));
    }

    // BOM כדי ש-Excel יזהה UTF-8 ויציג עברית כראוי
    const csv = '﻿' + lines.join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
    res.send(csv);
  } catch (e) {
    next(e);
  }
});

/* ── מוגן: נתוני סטטיסטיקה לדשבורד ── */
// GET /api/orders/stats
router.get('/stats', requireAuth, async (req, res, next) => {
  try {
    const byStatus = await db.statusCounts();
    const byWorkType = await db.workTypeCounts();
    const total = await db.totalCount();

    // 14 הימים האחרונים (כולל ימים ללא הזמנות), מפתחות תאריך ב-UTC
    const dayRows = await db.dayCounts(14);
    const dayMap = Object.fromEntries(dayRows.map((r) => [r.d, Number(r.c)]));
    const byDay = [];
    const now = Date.now();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * 86400000).toISOString().slice(0, 10);
      byDay.push({ day: d, count: dayMap[d] || 0 });
    }

    res.json({ total, byStatus, byWorkType, byDay });
  } catch (e) {
    next(e);
  }
});

/* ── מוגן: עדכון סטטוס הזמנה ── */
// PATCH /api/orders/:id
router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body || {};
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'סטטוס לא חוקי.' });
    }
    const changed = await db.updateStatus(id, status);
    if (!changed) {
      return res.status(404).json({ error: 'הזמנה לא נמצאה.' });
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

/* ── מוגן: מחיקת הזמנה ── */
// DELETE /api/orders/:id
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const changed = await db.deleteOrder(id);
    if (!changed) {
      return res.status(404).json({ error: 'הזמנה לא נמצאה.' });
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
