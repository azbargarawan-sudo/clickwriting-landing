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

## 🗄️ מסד נתונים — שמירת נתונים לצמיתות

לאפליקציה **שתי שכבות מסד נתונים** שנבחרות אוטומטית לפי משתנה הסביבה `DATABASE_URL`:

| מצב | מתי | שמירת נתונים |
|-----|-----|---------------|
| **PostgreSQL** | כאשר `DATABASE_URL` מוגדר | ✅ קבועה — נשמרת בין פריסות |
| **SQLite** | כאשר `DATABASE_URL` ריק (פיתוח מקומי) | ⚠️ מקומית בלבד |

ה-`render.yaml` שבפרויקט **כבר מגדיר Postgres חינמי אוטומטית** ומחבר אליו את
`DATABASE_URL` — כך שבפריסה עם Blueprint (דרך א') ההזמנות **נשמרות לצמיתות** ללא
צעד נוסף. 🎉

> אם אתה פורס ידנית (דרך ב'/ג'), צור מסד Postgres (למשל **New + → PostgreSQL**
> ב-Render, או Neon/Supabase) והעתק את ה-Connection String למשתנה `DATABASE_URL`.

> הערה: Postgres חינמי ב-Render פעיל 30 יום; לאחר מכן ניתן לשדרג לתוכנית בתשלום
> נמוך כדי לשמור על הנתונים.

---

## אחרי הפריסה

- 🔐 היכנס ל-`/admin.html` עם `admin` והסיסמה שהגדרת.
- 🔔 להפעלת התראות (WhatsApp/מייל/Webhook) — הוסף את משתני הסביבה
  המתאימים בדשבורד של Render (ראה `.env.example`).
- ✏️ החלף את מספרי הטלפון והוואטסאפ ב-`public/index.html` לפרטים האמיתיים שלך.
