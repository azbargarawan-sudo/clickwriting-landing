/**
 * בורר מסד נתונים:
 *   • אם מוגדר DATABASE_URL  → PostgreSQL (מומלץ לפרודקשן, נתונים נשמרים לצמיתות)
 *   • אחרת                   → SQLite מקומי (אפס-הגדרות, לפיתוח)
 *
 * שני המימושים חושפים ממשק אסינכרוני זהה, כך ששאר האפליקציה אדישה לבחירה.
 */
const usePostgres = Boolean(process.env.DATABASE_URL);

const db = usePostgres
  ? (await import('./db/pg.js')).default
  : (await import('./db/sqlite.js')).default;

export const initDb = () => db.init();
export default db;
