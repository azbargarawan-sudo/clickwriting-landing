import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', '..', 'data');
mkdirSync(dataDir, { recursive: true });

const sdb = new DatabaseSync(join(dataDir, 'clickwriting.db'));
sdb.exec('PRAGMA journal_mode = WAL;');
sdb.exec('PRAGMA foreign_keys = ON;');

/**
 * מימוש שכבת הגישה מעל SQLite (node:sqlite המובנה).
 * כל המתודות אסינכרוניות כדי לשמור על ממשק זהה למימוש Postgres.
 */
export default {
  name: 'sqlite',

  async init() {
    sdb.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        username   TEXT NOT NULL UNIQUE,
        password   TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS orders (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT NOT NULL,
        phone       TEXT NOT NULL,
        email       TEXT,
        work_type   TEXT NOT NULL,
        subject     TEXT,
        pages       INTEGER,
        deadline    TEXT,
        details     TEXT,
        status      TEXT NOT NULL DEFAULT 'new',
        created_at  TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_orders_status  ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
    `);
  },

  async getAdminCount() {
    return sdb.prepare('SELECT COUNT(*) AS c FROM admins').get().c;
  },
  async insertAdmin(username, passwordHash) {
    sdb.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run(username, passwordHash);
  },
  async getAdmin(username) {
    return sdb.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  },

  async insertOrder(o) {
    const info = sdb.prepare(`
      INSERT INTO orders (name, phone, email, work_type, subject, pages, deadline, details)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(o.name, o.phone, o.email, o.work_type, o.subject, o.pages, o.deadline, o.details);
    return Number(info.lastInsertRowid);
  },
  async getOrder(id) {
    return sdb.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  },
  async listOrders(status) {
    return status
      ? sdb.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC').all(status)
      : sdb.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  },
  async updateStatus(id, status) {
    return sdb.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id).changes > 0;
  },
  async deleteOrder(id) {
    return sdb.prepare('DELETE FROM orders WHERE id = ?').run(id).changes > 0;
  },

  async statusCounts() {
    const out = { new: 0, in_progress: 0, done: 0, cancelled: 0 };
    for (const r of sdb.prepare('SELECT status, COUNT(*) AS c FROM orders GROUP BY status').all()) {
      out[r.status] = r.c;
    }
    return out;
  },
  async totalCount() {
    return sdb.prepare('SELECT COUNT(*) AS c FROM orders').get().c;
  },
  async workTypeCounts() {
    return sdb.prepare('SELECT work_type, COUNT(*) AS c FROM orders GROUP BY work_type ORDER BY c DESC').all();
  },
  async dayCounts(days) {
    return sdb.prepare(`
      SELECT date(created_at) AS d, COUNT(*) AS c
      FROM orders
      WHERE date(created_at) >= date('now', ? || ' days')
      GROUP BY date(created_at)
    `).all(String(-(days - 1)));
  },
};
