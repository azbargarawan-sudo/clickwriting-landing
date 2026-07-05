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
  const searchBox = document.getElementById('searchBox');
  const resultCount = document.getElementById('resultCount');

  let currentFilter = 'all';   // סינון סטטוס מכרטיסי הסטטיסטיקה
  let allOrders = [];          // ההזמנות שנטענו עבור הסינון הנוכחי
  let searchTerm = '';
  let sortKey = 'created_at';
  let sortDir = 'desc';        // 'asc' | 'desc'

  const STATUS_LABELS = { new: 'חדש', in_progress: 'בטיפול', done: 'הושלם', cancelled: 'בוטל' };
  const STATUS_COLORS = { new: '#1565C0', in_progress: '#E65100', done: '#2E7D32', cancelled: '#C62828' };
  const STAT_CARDS = [
    { key: 'all', label: 'סה״כ' },
    { key: 'new', label: 'חדשות' },
    { key: 'in_progress', label: 'בטיפול' },
    { key: 'done', label: 'הושלמו' },
    { key: 'cancelled', label: 'בוטלו' },
  ];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function fmtDate(s) {
    if (!s) return '';
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

  /* ── טאבים ── */

  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
      tab.classList.add('active');
      const view = tab.dataset.view;
      document.getElementById(view + 'View').classList.add('active');
      if (view === 'stats') loadStats();
    });
  });

  /* ── התחברות ── */

  async function checkSession() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) { const { username } = await res.json(); showDashboard(username); return; }
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) loginErr.textContent = body.error || 'שגיאת התחברות.';
      else showDashboard(body.username);
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
    allOrders = data.orders;
    renderStats(data.counts);
    applyAndRender();
  }

  function renderStats(counts) {
    statsRow.innerHTML = STAT_CARDS.map(function (c) {
      const val = c.key === 'all' ? counts.total : (counts[c.key] || 0);
      const active = currentFilter === c.key ? ' active' : '';
      return '<div class="stat-card' + active + '" data-filter="' + c.key + '">' +
        '<div class="num">' + val + '</div><div class="lbl">' + c.label + '</div></div>';
    }).join('');
    statsRow.querySelectorAll('.stat-card').forEach(function (card) {
      card.addEventListener('click', function () {
        currentFilter = card.dataset.filter;
        loadOrders();
      });
    });
  }

  /* ── חיפוש ומיון ── */

  searchBox.addEventListener('input', function () {
    searchTerm = searchBox.value.trim().toLowerCase();
    applyAndRender();
  });

  document.querySelectorAll('th.sortable').forEach(function (th) {
    th.addEventListener('click', function () {
      const key = th.dataset.sort;
      if (sortKey === key) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      else { sortKey = key; sortDir = 'asc'; }
      applyAndRender();
    });
  });

  function applyAndRender() {
    let rows = allOrders;
    if (searchTerm) {
      rows = rows.filter(function (o) {
        return [o.name, o.phone, o.subject, o.work_type, o.email]
          .some((v) => v && String(v).toLowerCase().includes(searchTerm));
      });
    }
    const numeric = { id: 1, pages: 1 };
    rows = rows.slice().sort(function (a, b) {
      let va = a[sortKey], vb = b[sortKey];
      if (numeric[sortKey]) { va = Number(va) || 0; vb = Number(vb) || 0; return va - vb; }
      va = String(va || ''); vb = String(vb || '');
      return va.localeCompare(vb, 'he');
    });
    if (sortDir === 'desc') rows.reverse();

    updateSortIndicators();
    renderOrders(rows);
    resultCount.textContent = 'מציג ' + rows.length + ' מתוך ' + allOrders.length;
  }

  function updateSortIndicators() {
    document.querySelectorAll('th.sortable').forEach(function (th) {
      const arrow = th.querySelector('.arrow');
      if (th.dataset.sort === sortKey) {
        th.classList.add('sorted');
        arrow.textContent = sortDir === 'asc' ? ' ▲' : ' ▼';
      } else {
        th.classList.remove('sorted');
        arrow.textContent = '';
      }
    });
  }

  function renderOrders(orders) {
    if (!orders.length) {
      ordersBody.innerHTML = '';
      emptyState.style.display = 'block';
      emptyState.textContent = searchTerm ? 'לא נמצאו הזמנות התואמות לחיפוש.' : 'אין הזמנות להצגה.';
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
      sel.addEventListener('change', function () { updateStatus(sel.dataset.id, sel.value); });
    });
    ordersBody.querySelectorAll('.del-btn').forEach(function (b) {
      b.addEventListener('click', function () { deleteOrder(b.dataset.id); });
    });
  }

  async function updateStatus(id, status) {
    try {
      const res = await fetch('/api/orders/' + id, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
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

  /* ── סטטיסטיקות ── */

  async function loadStats() {
    let s;
    try {
      const res = await fetch('/api/orders/stats');
      if (res.status === 401) { showLogin(); return; }
      s = await res.json();
    } catch (_) {
      document.getElementById('chartDays').innerHTML = '<div class="chart-empty">שגיאה בטעינת הנתונים.</div>';
      return;
    }
    renderDaysChart(s.byDay);
    renderTypesChart(s.byWorkType, s.total);
    renderStatusChart(s.byStatus, s.total);
  }

  function renderDaysChart(byDay) {
    const el = document.getElementById('chartDays');
    const max = Math.max(1, ...byDay.map((d) => d.count));
    if (byDay.every((d) => d.count === 0)) {
      el.innerHTML = '<div class="chart-empty">אין הזמנות בטווח זה עדיין.</div>';
      return;
    }
    el.innerHTML = '<div class="vbars">' + byDay.map(function (d) {
      const h = Math.round((d.count / max) * 100);
      const parts = d.day.split('-'); // YYYY-MM-DD
      const label = parts[2] + '/' + parts[1];
      return '<div class="vbar-col">' +
        '<div class="vbar" data-v="' + d.count + '" style="height:' + h + '%"></div>' +
        '<div class="vbar-x">' + label + '</div></div>';
    }).join('') + '</div>';
  }

  function renderTypesChart(byWorkType, total) {
    const el = document.getElementById('chartTypes');
    if (!byWorkType.length) { el.innerHTML = '<div class="chart-empty">אין נתונים עדיין.</div>'; return; }
    const max = Math.max(1, ...byWorkType.map((t) => t.c));
    el.innerHTML = byWorkType.map(function (t) {
      const w = Math.round((t.c / max) * 100);
      return '<div class="hbar-row">' +
        '<div class="hbar-label" title="' + esc(t.work_type) + '">' + esc(t.work_type) + '</div>' +
        '<div class="hbar-track"><div class="hbar-fill" style="width:' + w + '%"></div></div>' +
        '<div class="hbar-val">' + t.c + '</div></div>';
    }).join('');
  }

  function renderStatusChart(byStatus, total) {
    const el = document.getElementById('chartStatus');
    if (!total) { el.innerHTML = '<div class="chart-empty">אין נתונים עדיין.</div>'; return; }
    const keys = ['new', 'in_progress', 'done', 'cancelled'];
    const max = Math.max(1, ...keys.map((k) => byStatus[k] || 0));
    el.innerHTML = keys.map(function (k) {
      const c = byStatus[k] || 0;
      const w = Math.round((c / max) * 100);
      return '<div class="hbar-row">' +
        '<div class="hbar-label">' + STATUS_LABELS[k] + '</div>' +
        '<div class="hbar-track"><div class="hbar-fill" style="width:' + w + '%;' +
        'background:' + STATUS_COLORS[k] + '"></div></div>' +
        '<div class="hbar-val">' + c + '</div></div>';
    }).join('');
  }

  checkSession();
})();
