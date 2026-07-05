(function () {
  const form = document.getElementById('orderForm');
  if (!form) return;
  const msg = document.getElementById('orderMsg');
  const btn = document.getElementById('orderSubmit');
  const card = form.closest('.order-card');

  function setMsg(text, type) {
    msg.textContent = text || '';
    msg.className = 'order-msg' + (type ? ' ' + type : '');
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    setMsg('');

    const data = Object.fromEntries(new FormData(form).entries());

    // ולידציה בסיסית בצד לקוח
    if (!data.name || data.name.trim().length < 2) {
      return setMsg('נא להזין שם מלא.', 'err');
    }
    if (!/^[0-9+\-\s()]{7,20}$/.test((data.phone || '').trim())) {
      return setMsg('נא להזין מספר טלפון תקין.', 'err');
    }
    if (!data.work_type) {
      return setMsg('נא לבחור סוג עבודה.', 'err');
    }

    btn.disabled = true;
    btn.textContent = 'שולח…';

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(body.error || 'אירעה שגיאה. נסו שוב.', 'err');
        btn.disabled = false;
        btn.textContent = 'שליחת בקשה להצעת מחיר';
        return;
      }

      // הצלחה – מציגים מסך תודה
      card.innerHTML =
        '<div class="order-success">' +
        '<div class="icon">✅</div>' +
        '<h3>הבקשה נשלחה בהצלחה!</h3>' +
        '<p>קיבלנו את הפרטים שלכם ונחזור אליכם עם הצעת מחיר תוך שעה.<br>' +
        'למענה מהיר יותר ניתן גם לפנות אלינו בוואטסאפ.</p>' +
        '<a href="https://wa.me/ROGIB2YQ33TLO1" target="_blank" rel="noopener" ' +
        'class="order-submit" style="display:inline-block;margin-top:18px;text-decoration:none;">' +
        '💬 פנייה בוואטסאפ</a>' +
        '</div>';
    } catch (err) {
      setMsg('בעיית תקשורת עם השרת. נסו שוב.', 'err');
      btn.disabled = false;
      btn.textContent = 'שליחת בקשה להצעת מחיר';
    }
  });
})();
