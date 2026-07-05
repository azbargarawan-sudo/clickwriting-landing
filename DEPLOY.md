# פריסה לאינטרנט (קבלת קישור פעיל)

מדריך לפריסת "כתיבה בקליק" ל-**Render** — שירות אירוח עם תוכנית חינמית.
בסוף התהליך תקבל כתובת ציבורית כמו `https://clickwriting.onrender.com`.

---

## דרך א' — Blueprint (הכי קל, מומלץ) 🚀

הפרויקט כולל קובץ `render.yaml` שמגדיר הכל אוטומטית.

1. היכנס ל-<https://render.com> והירשם (אפשר עם חשבון GitHub).
2. לחץ **New +** → **Blueprint**.
3. חבר את מאגר ה-GitHub `clickwriting-landing` ובחר את הענף.
4. Render יזהה את `render.yaml` אוטומטית. לחץ **Apply**.
5. במסך משתני הסביבה, הגדר ערך ל-**`ADMIN_PASSWORD`** (סיסמת האדמין שלך).
   את `SESSION_SECRET` — Render מייצר אוטומטית.
6. לחץ **Create** והמתן 1–2 דקות לבנייה.

✅ בסיום תקבל כתובת פעילה. האתר ב-`/` והניהול ב-`/admin.html`.

---

## דרך ב' — שירות ידני (Web Service)

אם אתה מעדיף בלי Blueprint:

1. **New +** → **Web Service** → חבר את הריפו.
2. הגדרות:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
3. תחת **Environment** הוסף:
   | Key | Value |
   |-----|-------|
   | `NODE_VERSION` | `22.22.2` |
   | `SESSION_SECRET` | מחרוזת אקראית ארוכה |
   | `ADMIN_USERNAME` | `admin` |
   | `ADMIN_PASSWORD` | הסיסמה שלך |
4. **Create Web Service**.

---

## דרך ג' — Docker (כל מארח: Railway / Fly.io / VPS)

הפרויקט כולל `Dockerfile`:

```bash
docker build -t clickwriting .
docker run -p 3000:3000 \
  -e SESSION_SECRET="change-me" \
  -e ADMIN_PASSWORD="your-password" \
  clickwriting
```

---

## ⚠️ חשוב — שמירת נתונים (SQLite)

בתוכנית ה**חינמית** של Render מערכת הקבצים **זמנית** — מסד הנתונים
(`data/clickwriting.db`) **מתאפס בכל פריסה מחדש או הפעלה מחדש** של השירות.
זה מצוין להדגמה, אבל לא לשמירת הזמנות אמיתיות לאורך זמן.

**לשמירה קבועה** יש שתי אפשרויות:
1. **Persistent Disk ב-Render** (דורש תוכנית בתשלום): הוסף Disk ומקם עליו את
   `data/` (למשל mount ל-`/app/data`).
2. **מעבר למסד נתונים מנוהל** (למשל Postgres החינמי של Render) — דורש התאמת
   שכבת ה-DB. אשמח לעזור בזה אם תרצה.

---

## אחרי הפריסה

- 🔐 היכנס ל-`/admin.html` עם `admin` והסיסמה שהגדרת.
- 🔔 להפעלת התראות (WhatsApp/מייל/Webhook) — הוסף את משתני הסביבה
  המתאימים בדשבורד של Render (ראה `.env.example`).
- ✏️ החלף את מספרי הטלפון והוואטסאפ ב-`public/index.html` לפרטים האמיתיים שלך.
