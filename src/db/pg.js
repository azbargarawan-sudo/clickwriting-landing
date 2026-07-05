import pg from 'pg';

const { Pool } = pg;

// שירותי ענן (Render וכו') דורשים SSL; מקומית בדרך כלל לא.
const useSsl = /sslmode=require/.test(process.env.DATABASE_URL || '') ||
  /\.(render\.com|neon\.tech|supabase\.co)/.test(process.env.DATABASE_URL || '');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});

const q = (text, params) => pool.query(text, params);

// עמודות ההזמנה — created_at מוחזר כמחרוזת UTC בפורמט זהה ל-SQLite,
// כדי שהצד-לקוח יעבוד ללא שינוי.
const ORDER_COLS =
  `id, name, phone, email, work_type, subject, pages, deadline, details, status, ` +
  `to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') AS created_at`;

/**
 * מימוש שכבת הגישה מעל PostgreSQL. ממשק זהה למימוש SQLite.
 */
export default {
  name: 'postgres',

  async init() {
    await q(`
      CREATE TABLE IF NOT EXISTS admins (
        id         SERIAL PRIMARY KEY,
        username   TEXT NOT NULL UNIQUE,
        password   TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`);
    await q(`
      CREATE TABLE IF NOT EXISTS orders (
        id          SERIAL PRIMARY KEY,
        name        TEXT NOT NULL,
        phone       TEXT NOT NULL,
        email       TEXT,
        work_type   TEXT NOT NULL,
        subject     TEXT,
        pages       INTEGER,
        deadline    TEXT,
        details     TEXT,
        status      TEXT NOT NULL DEFAULT 'new',
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )`);
    await q('CREATE INDEX IF NOT EXISTS idx_orders_status  ON orders(status)');
    await q('CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at)');
  },

  async getAdminCount() {
    const r = await q('SELECT COUNT(*)::int AS c FROM admins');
    return r.rows[0].c;
  },
  async insertAdmin(username, passwordHash) {
    await q('INSERT INTO admins (username, password) VALUES ($1, $2)', [username, passwordHash]);
  },
  async getAdmin(username) {
    const r = await q('SELECT * FROM admins WHERE username = $1', [username]);
    return r.rows[0];
  },

  async insertOrder(o) {
    const r = await q(`
      INSERT INTO orders (name, phone, email, work_type, subject, pages, deadline, details)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
    `, [o.name, o.phone, o.email, o.work_type, o.subject, o.pages, o.deadline, o.details]);
    return r.rows[0].id;
  },
  async getOrder(id) {
    const r = await q(`SELECT ${ORDER_COLS} FROM orders WHERE id = $1`, [id]);
    return r.rows[0];
  },
  async listOrders(status) {
    if (status) {
      const r = await q(`SELECT ${ORDER_COLS} FROM orders WHERE status = $1 ORDER BY created_at DESC`, [status]);
      return r.rows;
    }
    const r = await q(`SELECT ${ORDER_COLS} FROM orders ORDER BY created_at DESC`);
    return r.rows;
  },
  async updateStatus(id, status) {
    const r = await q('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
    return r.rowCount > 0;
  },
  async deleteOrder(id) {
    const r = await q('DELETE FROM orders WHERE id = $1', [id]);
    return r.rowCount > 0;
  },

  async statusCounts() {
    const out = { new: 0, in_progress: 0, done: 0, cancelled: 0 };
    const r = await q('SELECT status, COUNT(*)::int AS c FROM orders GROUP BY status');
    for (const row of r.rows) out[row.status] = row.c;
    return out;
  },
  async totalCount() {
    const r = await q('SELECT COUNT(*)::int AS c FROM orders');
    return r.rows[0].c;
  },
  async workTypeCounts() {
    const r = await q('SELECT work_type, COUNT(*)::int AS c FROM orders GROUP BY work_type ORDER BY c DESC');
    return r.rows;
  },
  async dayCounts(days) {
    const r = await q(`
      SELECT to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS d, COUNT(*)::int AS c
      FROM orders
      WHERE created_at >= (now() - (($1::int - 1) * interval '1 day'))
      GROUP BY d
    `, [days]);
    return r.rows;
  },
};
