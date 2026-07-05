/**
 * מודול התראות על הזמנה חדשה.
 *
 * כל הערוצים אופציונליים ומופעלים לפי משתני סביבה. אם ערוץ לא מוגדר —
 * הוא פשוט מדולג (עם הודעה ל-console), וכשל בערוץ אחד לעולם לא מפיל
 * את יצירת ההזמנה עצמה.
 *
 * ערוצים נתמכים:
 *   1. WhatsApp דרך CallMeBot (חינמי, ללא תלות)   — WHATSAPP_PHONE + CALLMEBOT_APIKEY
 *   2. אימייל דרך SMTP (nodemailer)               — SMTP_HOST/PORT/USER/PASS + NOTIFY_EMAIL_TO
 *   3. Webhook כללי (POST JSON)                    — NOTIFY_WEBHOOK_URL
 */

const STATUS_HE = { new: 'חדש', in_progress: 'בטיפול', done: 'הושלם', cancelled: 'בוטל' };

function buildMessage(o) {
  const lines = [
    `🔔 הזמנה חדשה #${o.id}`,
    `👤 ${o.name}`,
    `📞 ${o.phone}`,
  ];
  if (o.email) lines.push(`✉️ ${o.email}`);
  lines.push(`📝 ${o.work_type}${o.subject ? ' | ' + o.subject : ''}`);
  const meta = [];
  if (o.pages) meta.push(`${o.pages} עמ׳`);
  if (o.deadline) meta.push(`דדליין: ${o.deadline}`);
  if (meta.length) lines.push('📄 ' + meta.join(' | '));
  if (o.details) lines.push(`💬 ${o.details}`);
  return lines.join('\n');
}

/* ── ערוץ 1: WhatsApp (CallMeBot) ── */
async function sendWhatsApp(message) {
  const phone = process.env.WHATSAPP_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) return { channel: 'whatsapp', skipped: true };
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}` +
    `&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apikey)}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`CallMeBot ${res.status}`);
  return { channel: 'whatsapp', ok: true };
}

/* ── ערוץ 2: אימייל (SMTP) ── */
async function sendEmail(order, message) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL_TO } = process.env;
  if (!SMTP_HOST || !NOTIFY_EMAIL_TO) return { channel: 'email', skipped: true };
  // ייבוא עצל — nodemailer נטען רק אם באמת שולחים מייל
  const { default: nodemailer } = await import('nodemailer');
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  await transport.sendMail({
    from: process.env.NOTIFY_EMAIL_FROM || SMTP_USER,
    to: NOTIFY_EMAIL_TO,
    subject: `הזמנה חדשה #${order.id} — ${order.name}`,
    text: message,
  });
  return { channel: 'email', ok: true };
}

/* ── ערוץ 3: Webhook כללי (לחיבור ל-Zapier / Make / n8n וכו') ── */
async function sendWebhook(order) {
  const url = process.env.NOTIFY_WEBHOOK_URL;
  if (!url) return { channel: 'webhook', skipped: true };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: 'order.created', order }),
  });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
  return { channel: 'webhook', ok: true };
}

/* ── אישור אוטומטי ללקוח (אם מולא אימייל ו-SMTP מוגדר) ── */
async function sendCustomerConfirmation(order) {
  const { SMTP_HOST } = process.env;
  if (!SMTP_HOST || !order.email) return { channel: 'customer', skipped: true };
  const { default: nodemailer } = await import('nodemailer');
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  const details = [];
  details.push(`סוג עבודה: ${order.work_type}`);
  if (order.subject) details.push(`נושא: ${order.subject}`);
  if (order.pages) details.push(`היקף משוער: ${order.pages} עמ׳`);
  if (order.deadline) details.push(`דדליין: ${order.deadline}`);
  const text =
    `שלום ${order.name},\n\n` +
    `קיבלנו את הבקשה שלך להצעת מחיר — תודה שפנית ל"כתיבה בקליק"! 🙌\n` +
    `נחזור אליך עם הצעה אישית תוך שעה.\n\n` +
    `סיכום הבקשה שלך:\n${details.join('\n')}\n\n` +
    `לכל שאלה ניתן להשיב למייל זה או לפנות אלינו בוואטסאפ.\n\n` +
    `בהצלחה,\nצוות כתיבה בקליק`;
  await transport.sendMail({
    from: process.env.NOTIFY_EMAIL_FROM || process.env.SMTP_USER,
    to: order.email,
    subject: 'קיבלנו את הבקשה שלך — כתיבה בקליק',
    text,
  });
  return { channel: 'customer', ok: true };
}

/**
 * שולח התראות על הזמנה חדשה בכל הערוצים המוגדרים + אישור ללקוח.
 * לא זורק שגיאה — כשלים נרשמים ל-console בלבד.
 */
export async function notifyNewOrder(order) {
  const message = buildMessage(order);
  const results = await Promise.allSettled([
    sendWhatsApp(message),
    sendEmail(order, message),
    sendWebhook(order),
    sendCustomerConfirmation(order),
  ]);

  const active = [];
  for (const r of results) {
    if (r.status === 'fulfilled') {
      if (r.value.ok) active.push(r.value.channel);
    } else {
      console.error('⚠️  התראה נכשלה:', r.reason?.message || r.reason);
    }
  }
  if (active.length) {
    console.log(`📨 נשלחה התראה על הזמנה #${order.id} בערוצים: ${active.join(', ')}`);
  } else {
    console.log(`ℹ️  הזמנה #${order.id} נוצרה (לא הוגדר ערוץ התראות פעיל).`);
  }
}
