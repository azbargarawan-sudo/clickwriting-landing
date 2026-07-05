(function () {
  const loginView = document.getElementById('loginView');
  const dashView = document.getElementById('dashView');
  const loginForm = document.getElementById('loginForm');
  const loginErr = document.getElementById('loginErr');
  const loginBtn = document.getElementById('loginBtn');
  const userLabel = document.getElementById('userLabel');
  const logoutBtn = document.getElementById('logoutBtn');
  const statsRow = document.getElementById('statsRow');
  const ordersBody = document.getElementById('ordersBody');
  const emptyState = document.getElementById('emptyState');

  let currentFilter = 'all';

  const STATUS_LABELS = {
    new: 'חדש', in_progress: 'בטיפול', done: 'הושלם', cancelled: 'בוטל',
  };
  const STAT_CARDS = [
    { key: 'all', label: 'סה״כ' },
    { key: 'new', label: 'חדשות' },
    { key: 'in_progress', label: 'בטיפול' },
    { key: 'done', label: 'הושלמו' },
    { key: 'cancelled', label: 'בוטלו' },
  ];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtDate(s) {
    if (!s) return '';
    // s בפורמט 'YYYY-MM-DD HH:MM:SS' מ-SQLite (UTC)
    const d = new Date(s.replace(' ', 'T') + 'Z');
    if (isNaN(d)) return esc(s);
    return d.toLocaleDateString('he-IL') + ' ' +
      d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
  }

  /* ── ניהול תצוגה ── */

  function showDashboard(username) {
    userLabel.textContent = '👤 ' + username;
    loginView.style.display = 'none';
    dashView.classList.add('active');
    loadOrders();
  }

  function showLogin() {
    dashView.classList.remove('active');
    loginView.style.display = 'flex';
  }

  /* ── התחברות ── */

  async function checkSession() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const { username } = await res.json();
        showDashboard(username);
        return;
      }
    } catch (_) { /* מתעלמים */ }
    showLogin();
  }

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    loginErr.textContent = '';
    loginBtn.disabled = true;
    loginBtn.textContent = 'מתחבר…';
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        loginErr.textContent = body.error || 'שגיאת התחברות.';
      } else {
        showDashboard(body.username);
      }
    } catch (_) {
      loginErr.textContent = 'בעיית תקשורת עם השרת.';
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = 'התחברות';
    }
  });

  logoutBtn.addEventListener('click', async function () {
    await fetch('/api/auth/logout', { method: 'POST' });
    showLogin();
    loginForm.reset();
  });

  /* ── טעינת הזמנות ── */

  async function loadOrders() {
    const q = currentFilter === 'all' ? '' : '?status=' + currentFilter;
    let data;
    try {
      const res = await fetch('/api/orders' + q);
      if (res.status === 401) { showLogin(); return; }
      data = await res.json();
    } catch (_) {
      ordersBody.innerHTML = '';
      emptyState.style.display = 'block';
      emptyState.textContent = 'שגיאה בטעינת הנתונים.';
      return;
    }
    renderStats(data.counts);
    renderOrders(data.orders);
  }

  function renderStats(counts) {
    statsRow.innerHTML = STAT_CARDS.map(function (c) {
      const val = c.key === 'all' ? counts.total : (counts[c.key] || 0);
      const active = currentFilter === c.key ? ' active' : '';
      return '<div class="stat-card' + active + '" data-filter="' + c.key + '">' +
        '<div class="num">' + val + '</div>' +
        '<div class="lbl">' + c.label + '</div></div>';
    }).join('');
    statsRow.querySelectorAll('.stat-card').forEach(function (card) {
      card.addEventListener('click', function () {
        currentFilter = card.dataset.filter;
        loadOrders();
      });
    });
  }

  function renderOrders(orders) {
    if (!orders.length) {
      ordersBody.innerHTML = '';
      emptyState.style.display = 'block';
      emptyState.textContent = 'אין הזמנות להצגה בסינון הנוכחי.';
      return;
    }
    emptyState.style.display = 'none';
    ordersBody.innerHTML = orders.map(function (o) {
      const options = Object.keys(STATUS_LABELS).map(function (s) {
        return '<option value="' + s + '"' + (s === o.status ? ' selected' : '') + '>' +
          STATUS_LABELS[s] + '</option>';
      }).join('');
      const email = o.email ? '<div class="muted">' + esc(o.email) + '</div>' : '';
      return '<tr data-id="' + o.id + '">' +
        '<td>' + o.id + '</td>' +
        '<td class="muted">' + fmtDate(o.created_at) + '</td>' +
        '<td><strong>' + esc(o.name) + '</strong></td>' +
        '<td><a class="phone-link" href="tel:' + esc(o.phone) + '">' + esc(o.phone) + '</a>' + email + '</td>' +
        '<td>' + esc(o.work_type) + '</td>' +
        '<td>' + esc(o.subject) + '</td>' +
        '<td>' + (o.pages || '') + '</td>' +
        '<td>' + esc(o.deadline) + '</td>' +
        '<td class="details-cell">' + esc(o.details) + '</td>' +
        '<td><span class="badge ' + o.status + '">' + STATUS_LABELS[o.status] + '</span><br>' +
        '<select class="status-select" data-id="' + o.id + '" style="margin-top:6px;">' + options + '</select></td>' +
        '<td><button class="del-btn" data-id="' + o.id + '" title="מחיקה">🗑️</button></td>' +
        '</tr>';
    }).join('');

    ordersBody.querySelectorAll('.status-select').forEach(function (sel) {
      sel.addEventListener('change', function () {
        updateStatus(sel.dataset.id, sel.value);
      });
    });
    ordersBody.querySelectorAll('.del-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        deleteOrder(b.dataset.id);
      });
    });
  }

  async function updateStatus(id, status) {
    try {
      const res = await fetch('/api/orders/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.status === 401) { showLogin(); return; }
      loadOrders();
    } catch (_) { alert('שגיאה בעדכון הסטטוס.'); }
  }

  async function deleteOrder(id) {
    if (!confirm('למחוק את הזמנה #' + id + '? פעולה זו אינה הפיכה.')) return;
    try {
      const res = await fetch('/api/orders/' + id, { method: 'DELETE' });
      if (res.status === 401) { showLogin(); return; }
      loadOrders();
    } catch (_) { alert('שגיאה במחיקה.'); }
  }

  checkSession();
})();
