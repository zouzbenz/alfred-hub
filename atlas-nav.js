/**
 * Atlas Pose — Navigation partagée v3.0
 * Design : Moderne & Minimaliste
 * Sidebar fixe sur desktop, bottom nav sur mobile
 * Usage: <script src="./atlas-nav.js"></script>
 */

(function () {
  const NAV_ITEMS = [
    { href: './atlas-projects.html',  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`, label: 'Projets',      id: 'projects'   },
    { href: './atlas-clients.html',   icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`, label: 'Clients',      id: 'clients'    },
    { href: './atlas-commandes.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 3l-4 4-4-4"/></svg>`, label: 'Commandes',    id: 'commandes'  },
    { href: './atlas-factures.html',  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>`, label: 'Factures',     id: 'factures'   },
    { href: './atlas-tasks.html',     icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`, label: 'Tâches',       id: 'tasks'      },
    { href: './atlas-ouvriers.html',  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`, label: 'Équipe',       id: 'ouvriers'   },
    { href: './atlas-suppliers.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`, label: 'Fournisseurs', id: 'suppliers'  },
    { href: './atlas-backoffice.html',icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`, label: 'Admin',        id: 'backoffice' },
  ];

  function getActivePage() {
    const file = window.location.pathname.split('/').pop().replace('.html', '');
    for (const item of NAV_ITEMS) {
      if (item.href.includes(file)) return item.id;
    }
    return '';
  }
  const activePage = getActivePage();

  /* ── INJECT CSS ─────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    /* ══════════════════════════════════════════════
       ATLAS DESIGN SYSTEM v3 — Global tokens
    ══════════════════════════════════════════════ */
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

    :root {
      /* Colors */
      --bg:        #080c14;
      --bg2:       #0d1220;
      --card:      #111827;
      --card2:     #161f30;
      --border:    #1e2d42;
      --border2:   #263548;
      --text:      #eef2f7;
      --text2:     #94a3b8;
      --dim:       #4b6080;

      /* Accents */
      --accent:    #3b82f6;
      --accent-lo: rgba(59,130,246,.08);
      --accent-md: rgba(59,130,246,.18);
      --accent2:   #10b981;
      --accent2-lo:rgba(16,185,129,.08);
      --warn:      #f59e0b;
      --warn-lo:   rgba(245,158,11,.08);
      --danger:    #ef4444;
      --danger-lo: rgba(239,68,68,.08);
      --info:      #8b5cf6;

      /* Nav */
      --nav-w: 232px;
      --nav-bg: #080c14;
      --mobile-nav-h: 62px;

      /* Spacing scale */
      --r-sm: 8px;
      --r-md: 12px;
      --r-lg: 16px;
      --r-xl: 20px;

      /* Shadows */
      --shadow-sm: 0 1px 4px rgba(0,0,0,.4);
      --shadow-md: 0 4px 20px rgba(0,0,0,.5);
      --shadow-lg: 0 10px 40px rgba(0,0,0,.6);
      --glow: 0 0 24px rgba(59,130,246,.15);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Outfit', sans-serif;
      min-height: 100vh;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      padding-left: var(--nav-w);
    }
    @media(max-width:768px) {
      body { padding-left: 0 !important; padding-bottom: var(--mobile-nav-h) !important; }
    }

    /* ── Scrollbar ─────────────────────────────── */
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }

    /* ── Typography ────────────────────────────── */
    h1, h2, h3, h4 { font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; }
    code, pre, .mono { font-family: 'JetBrains Mono', monospace; }

    /* ── Layout helpers ────────────────────────── */
    .container { max-width: 1240px; margin: 0 auto; padding: 24px 20px; }

    /* ── Page header ───────────────────────────── */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }
    .page-title { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em; }
    .page-subtitle { color: var(--text2); font-size: .875rem; margin-top: 4px; font-weight: 400; }
    .header-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

    /* Legacy .header support */
    .header { padding: 0 0 28px; }
    .header h1 { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em; }
    .header p { color: var(--text2); font-size: .875rem; margin-top: 4px; }

    /* ── Top bar ───────────────────────────────── */
    .top-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--text2);
      text-decoration: none;
      font-size: .8rem;
      font-weight: 500;
      padding: 6px 12px;
      border: 1px solid var(--border);
      border-radius: var(--r-md);
      background: var(--card);
      transition: all .15s ease;
    }
    .back-link:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-lo); }

    /* ── Cards ─────────────────────────────────── */
    .card, .section {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--r-xl);
      padding: 20px;
      margin-bottom: 16px;
    }
    .card:hover { border-color: var(--border2); }

    /* ── Stat cards ────────────────────────────── */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    @media(min-width:600px) { .stats-row { grid-template-columns: repeat(4, 1fr); } }

    .stat-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      padding: 18px 16px;
      text-align: center;
      transition: all .2s;
    }
    .stat-card:hover { border-color: var(--border2); transform: translateY(-1px); }
    .stat-value { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
    .stat-value.blue  { color: var(--accent); }
    .stat-value.green { color: var(--accent2); }
    .stat-value.orange{ color: var(--warn); }
    .stat-value.red   { color: var(--danger); }
    .stat-label { font-size: .72rem; color: var(--dim); margin-top: 6px; font-weight: 500; text-transform: uppercase; letter-spacing: .05em; }

    /* ── Buttons ───────────────────────────────── */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 9px 18px;
      border: none;
      border-radius: var(--r-md);
      font-family: 'Outfit', sans-serif;
      font-size: .875rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all .15s ease;
      white-space: nowrap;
    }
    .btn:hover { transform: translateY(-1px); }
    .btn:active { transform: scale(.98); }
    .btn-primary   { background: var(--accent); color: #fff; box-shadow: 0 0 20px rgba(59,130,246,.25); }
    .btn-primary:hover { background: #2563eb; box-shadow: 0 0 28px rgba(59,130,246,.4); }
    .btn-success   { background: var(--accent2); color: #fff; }
    .btn-success:hover { background: #059669; }
    .btn-danger    { background: var(--danger); color: #fff; }
    .btn-outline   { background: transparent; border: 1px solid var(--border); color: var(--text); }
    .btn-outline:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-lo); }
    .btn-ghost     { background: transparent; color: var(--text2); }
    .btn-ghost:hover { background: var(--card); color: var(--text); }
    .btn-small     { padding: 6px 12px; font-size: .78rem; }
    .btn-icon      { padding: 8px; min-width: 36px; justify-content: center; border-radius: var(--r-md); }

    /* ── Badges / Status ───────────────────────── */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 99px;
      font-size: .7rem;
      font-weight: 600;
      letter-spacing: .03em;
      text-transform: uppercase;
    }
    .status-badge::before {
      content: '';
      width: 5px; height: 5px;
      border-radius: 50%;
      background: currentColor;
      flex-shrink: 0;
    }
    .status-a_venir  { background: var(--warn-lo);    color: var(--warn);   }
    .status-en_cours { background: var(--accent-md);  color: var(--accent); }
    .status-termine  { background: var(--accent2-lo); color: var(--accent2);}
    .status-recu     { background: var(--accent2-lo); color: var(--accent2);}
    .status-partiel  { background: var(--warn-lo);    color: var(--warn);   }
    .status-annule   { background: var(--danger-lo);  color: var(--danger); }
    .status-pending  { background: var(--warn-lo);    color: var(--warn);   }
    .status-payee    { background: var(--accent2-lo); color: var(--accent2);}
    .status-impayee  { background: var(--danger-lo);  color: var(--danger); }

    /* ── Inputs & Forms ────────────────────────── */
    input, select, textarea {
      font-family: 'Outfit', sans-serif;
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: var(--r-md);
      color: var(--text);
      font-size: .875rem;
      padding: 10px 14px;
      transition: border-color .15s, box-shadow .15s;
      outline: none;
      width: 100%;
    }
    input:focus, select:focus, textarea:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(59,130,246,.12);
    }
    select option { background: var(--card); }
    label { font-size: .78rem; font-weight: 600; color: var(--text2); margin-bottom: 6px; display: block; text-transform: uppercase; letter-spacing: .04em; }

    /* ── Tables ────────────────────────────────── */
    .table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: var(--r-lg); }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: .85rem;
    }
    thead th {
      padding: 10px 14px;
      text-align: left;
      color: var(--dim);
      font-size: .7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .07em;
      border-bottom: 1px solid var(--border);
      white-space: nowrap;
    }
    tbody td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border);
      color: var(--text);
      vertical-align: middle;
    }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover td { background: rgba(255,255,255,.02); }

    /* ── Progress bars ─────────────────────────── */
    .progress-bar {
      height: 6px;
      background: var(--border);
      border-radius: 99px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 99px;
      transition: width .4s ease;
    }
    .progress-fill.safe    { background: linear-gradient(90deg, var(--accent2), #34d399); }
    .progress-fill.warning { background: linear-gradient(90deg, var(--warn), #fbbf24); }
    .progress-fill.danger  { background: linear-gradient(90deg, var(--danger), #f87171); }

    /* ── Section headers ───────────────────────── */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .section-title { font-size: 1rem; font-weight: 700; letter-spacing: -0.01em; }

    /* ── Filter pills ──────────────────────────── */
    .filters { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
    .filter-btn {
      padding: 7px 16px;
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 99px;
      color: var(--text2);
      cursor: pointer;
      font-family: 'Outfit', sans-serif;
      font-size: .8rem;
      font-weight: 500;
      transition: all .15s;
    }
    .filter-btn:hover { border-color: var(--border2); color: var(--text); }
    .filter-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }

    /* ── Search input ──────────────────────────── */
    .search-input {
      position: relative;
      max-width: 320px;
    }
    .search-input input { padding-left: 38px; }
    .search-input::before {
      content: '⌕';
      position: absolute;
      left: 12px; top: 50%;
      transform: translateY(-50%);
      color: var(--dim);
      font-size: 1.1rem;
      pointer-events: none;
    }

    /* ── Modals ────────────────────────────────── */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,.7);
      backdrop-filter: blur(6px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .modal {
      background: var(--card);
      border: 1px solid var(--border2);
      border-radius: var(--r-xl);
      padding: 28px;
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
    }
    .modal-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; }

    /* ── Toast ─────────────────────────────────── */
    .toast {
      position: fixed;
      bottom: 90px; right: 20px;
      padding: 12px 18px;
      border-radius: var(--r-lg);
      font-size: .875rem;
      font-weight: 500;
      z-index: 2000;
      animation: toastIn .2s ease;
      box-shadow: var(--shadow-md);
    }
    @keyframes toastIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
    .toast-success { background: var(--accent2); color: #fff; }
    .toast-error   { background: var(--danger);  color: #fff; }

    /* ── Empty state ───────────────────────────── */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--dim);
    }
    .empty-state-icon { font-size: 2.5rem; margin-bottom: 12px; opacity: .4; }
    .empty-state p { font-size: .9rem; }

    /* ── Footer ────────────────────────────────── */
    .footer { text-align: center; padding: 30px; color: var(--dim); font-size: .78rem; }
    .footer a { color: var(--accent); text-decoration: none; }

    /* ── Dividers ──────────────────────────────── */
    hr { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
  `;
  document.head.appendChild(style);

  /* ── SIDEBAR CSS ──────────────────────────────── */
  const navStyle = document.createElement('style');
  navStyle.textContent = `
    /* === SIDEBAR === */
    #atlas-sidebar {
      position: fixed;
      top: 0; left: 0;
      width: var(--nav-w);
      height: 100vh;
      background: var(--nav-bg);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      z-index: 900;
      overflow: hidden;
    }

    .nav-brand {
      padding: 22px 18px 20px;
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }
    .nav-brand-logo {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text);
      letter-spacing: -0.04em;
      display: flex;
      align-items: center;
      gap: 9px;
      text-decoration: none;
    }
    .nav-brand-icon {
      width: 30px; height: 30px;
      background: var(--accent);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .nav-brand-icon svg { width: 16px; height: 16px; color: #fff; }
    .nav-brand-name span { color: var(--accent); }
    .nav-brand-sub {
      font-size: .67rem;
      color: var(--dim);
      margin-top: 4px;
      letter-spacing: .08em;
      text-transform: uppercase;
      padding-left: 39px;
    }

    .nav-links {
      flex: 1;
      padding: 14px 10px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .nav-section-label {
      font-size: .62rem;
      font-weight: 600;
      color: var(--dim);
      text-transform: uppercase;
      letter-spacing: .1em;
      padding: 10px 10px 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 11px;
      border-radius: 10px;
      text-decoration: none;
      color: var(--text2);
      font-size: .845rem;
      font-weight: 500;
      transition: all .15s ease;
      border: 1px solid transparent;
      position: relative;
    }
    .nav-item svg { width: 17px; height: 17px; flex-shrink: 0; opacity: .7; transition: opacity .15s; }
    .nav-item:hover { background: rgba(255,255,255,.04); color: var(--text); }
    .nav-item:hover svg { opacity: 1; }
    .nav-item.active {
      background: var(--accent-md);
      color: var(--text);
      border-color: rgba(59,130,246,.25);
      font-weight: 600;
    }
    .nav-item.active svg { color: var(--accent); opacity: 1; }
    .nav-item.active::before {
      content: '';
      position: absolute;
      left: -1px; top: 20%; bottom: 20%;
      width: 2px;
      background: var(--accent);
      border-radius: 0 2px 2px 0;
    }
    .nav-divider { height: 1px; background: var(--border); margin: 8px 8px; }

    .nav-footer {
      padding: 14px 18px;
      border-top: 1px solid var(--border);
      flex-shrink: 0;
    }
    .nav-footer-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: .67rem;
      color: var(--dim);
      background: var(--bg2);
      border: 1px solid var(--border);
      padding: 4px 10px;
      border-radius: 99px;
    }
    .nav-footer-dot {
      width: 5px; height: 5px;
      background: var(--accent2);
      border-radius: 50%;
    }

    /* === BOTTOM NAV (mobile) === */
    #atlas-bottom-nav {
      display: none;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      height: var(--mobile-nav-h);
      background: rgba(8,12,20,.95);
      border-top: 1px solid var(--border);
      backdrop-filter: blur(12px);
      z-index: 900;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    #atlas-bottom-nav::-webkit-scrollbar { display: none; }
    .mobile-nav-inner {
      display: flex;
      align-items: stretch;
      height: 100%;
      min-width: max-content;
      padding: 0 6px;
    }
    .mobile-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4px 14px;
      text-decoration: none;
      color: var(--dim);
      font-size: .6rem;
      font-weight: 500;
      gap: 3px;
      min-width: 58px;
      border-top: 2px solid transparent;
      transition: all .15s ease;
    }
    .mobile-nav-item svg { width: 20px; height: 20px; }
    .mobile-nav-item.active { color: var(--accent); border-top-color: var(--accent); }
    .mobile-nav-item.active svg { color: var(--accent); }

    @media(max-width:768px) {
      #atlas-sidebar { display: none; }
      #atlas-bottom-nav { display: block; }
    }
  `;
  document.head.appendChild(navStyle);

  /* ── BUILD SIDEBAR ──────────────────────────── */
  function buildSidebar() {
    const mainItems = NAV_ITEMS.slice(0, 7);
    const adminItems = NAV_ITEMS.slice(7);

    const renderItems = (items) => items.map(item => `
      <a href="${item.href}" class="nav-item ${activePage === item.id ? 'active' : ''}" data-id="${item.id}">
        ${item.icon}
        <span>${item.label}</span>
      </a>
    `).join('');

    const sidebar = document.createElement('nav');
    sidebar.id = 'atlas-sidebar';
    sidebar.innerHTML = `
      <div class="nav-brand">
        <a href="./atlas-projects.html" class="nav-brand-logo">
          <div class="nav-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M2 20h20M4 20V10l8-6 8 6v10M9 20v-5h6v5"/>
            </svg>
          </div>
          <div class="nav-brand-name">Atlas<span>Pose</span></div>
        </a>
        <div class="nav-brand-sub">Gestion chantiers</div>
      </div>
      <div class="nav-links">
        <div class="nav-section-label">Principal</div>
        ${renderItems(mainItems)}
        <div class="nav-divider"></div>
        <div class="nav-section-label">Système</div>
        ${renderItems(adminItems)}
      </div>
      <div class="nav-footer">
        <div class="nav-footer-badge">
          <div class="nav-footer-dot"></div>
          v3.0 · Atlas Pose
        </div>
      </div>
    `;
    document.body.insertBefore(sidebar, document.body.firstChild);
  }

  /* ── BUILD BOTTOM NAV ───────────────────────── */
  function buildBottomNav() {
    const items = NAV_ITEMS.map(item => `
      <a href="${item.href}" class="mobile-nav-item ${activePage === item.id ? 'active' : ''}">
        ${item.icon}
        <span>${item.label}</span>
      </a>
    `).join('');

    const bottomNav = document.createElement('nav');
    bottomNav.id = 'atlas-bottom-nav';
    bottomNav.innerHTML = `<div class="mobile-nav-inner">${items}</div>`;
    document.body.appendChild(bottomNav);
  }

  /* ── REMOVE OLD NAV LINKS ───────────────────── */
  function removeOldLinks() {
    document.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const text = a.textContent || '';
      if (
        href === './' || href === '../' || href === '/index.html' ||
        href.includes('alfred-hub') || href.includes('index.html') ||
        text.includes('Alfred Hub') || text.includes('🏠 Alfred Hub')
      ) { a.remove(); }
    });
  }

  /* ── INIT ───────────────────────────────────── */
  function init() {
    buildSidebar();
    buildBottomNav();
    setTimeout(removeOldLinks, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
