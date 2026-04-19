/**
 * Atlas Pose — Navigation & Design System v4.0
 * Dark / Light mode avec toggle persistant (localStorage)
 * Archivo (titres) + Outfit (UI) + Instrument Serif (accents)
 * Logo : tile diamond mark en terracotta
 * Usage: <script src="./atlas-nav.js"></script>
 */

(function () {

  /* ── NAV ITEMS ──────────────────────────────────────────────── */
  const NAV_ITEMS = [
    { href: './atlas-projects.html',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="12" rx="2"/><path d="M9 21h6M12 15v6"/></svg>`,
      label: 'Projets', id: 'projects' },
    { href: './atlas-clients.html',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
      label: 'Clients', id: 'clients' },
    { href: './atlas-commandes.html',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14M5 8a2 2 0 01-2-2V5h18v1a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"/><path d="M10 12h4"/></svg>`,
      label: 'Commandes', id: 'commandes' },
    { href: './atlas-factures.html',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="11" y2="17"/></svg>`,
      label: 'Factures', id: 'factures' },
    { href: './atlas-tasks.html',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`,
      label: 'Tâches', id: 'tasks' },
    { href: './atlas-ouvriers.html',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
      label: 'Équipe', id: 'ouvriers' },
    { href: './atlas-suppliers.html',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
      label: 'Fournisseurs', id: 'suppliers' },
    { href: './atlas-backoffice.html',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
      label: 'Admin', id: 'backoffice' },
  ];

  /* ── THEME ──────────────────────────────────────────────────── */
  const THEME_KEY = 'atlas-theme';
  let currentTheme = localStorage.getItem(THEME_KEY) || 'dark';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem(THEME_KEY, theme);
    const btn = document.getElementById('atlas-theme-toggle');
    if (btn) btn.innerHTML = theme === 'dark' ? ICON_SUN : ICON_MOON;
  }

  const ICON_SUN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
  const ICON_MOON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;

  /* ── ACTIVE PAGE ─────────────────────────────────────────────── */
  function getActivePage() {
    const file = window.location.pathname.split('/').pop().replace('.html', '');
    for (const item of NAV_ITEMS) {
      if (item.href.includes(file)) return item.id;
    }
    return '';
  }
  const activePage = getActivePage();

  /* ── FONTS ──────────────────────────────────────────────────── */
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800&family=Outfit:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap';
  document.head.appendChild(fontLink);

  /* ── DESIGN TOKENS ──────────────────────────────────────────── */
  const tokens = document.createElement('style');
  tokens.textContent = `
    :root, [data-theme="dark"] {
      --bg: #080c14; --bg2: #0d1220; --card: #111827; --card2: #161f30;
      --border: #1e2d42; --border2: #263548;
      --text: #eef2f7; --text2: #94a3b8; --dim: #4b6080;
      --accent: #3b82f6; --accent-lo: rgba(59,130,246,.08); --accent-md: rgba(59,130,246,.18);
      --clay: #c2410c; --clay-lo: rgba(194,65,12,.1); --clay-md: rgba(194,65,12,.2);
      --accent2: #10b981; --accent2-lo: rgba(16,185,129,.08); --accent2-md: rgba(16,185,129,.18);
      --warn: #f59e0b; --warn-lo: rgba(245,158,11,.09);
      --danger: #ef4444; --danger-lo: rgba(239,68,68,.09);
      --nav-bg: #060a11; --nav-w: 232px; --mobile-nav-h: 62px;
      --r-sm:8px; --r-md:12px; --r-lg:16px; --r-xl:20px;
      --shadow-sm:0 1px 4px rgba(0,0,0,.5); --shadow-md:0 4px 20px rgba(0,0,0,.6); --shadow-lg:0 12px 40px rgba(0,0,0,.7);
    }
    [data-theme="light"] {
      --bg: #edeae3; --bg2: #f5f3ee; --card: #faf9f6; --card2: #f0ede6;
      --border: #d8d3c8; --border2: #c8c2b6;
      --text: #1a1612; --text2: #5c564f; --dim: #9a9188;
      --accent: #1d4ed8; --accent-lo: rgba(29,78,216,.08); --accent-md: rgba(29,78,216,.16);
      --clay: #c2410c; --clay-lo: rgba(194,65,12,.09); --clay-md: rgba(194,65,12,.18);
      --accent2: #059669; --accent2-lo: rgba(5,150,105,.09); --accent2-md: rgba(5,150,105,.18);
      --warn: #d97706; --warn-lo: rgba(217,119,6,.10);
      --danger: #dc2626; --danger-lo: rgba(220,38,38,.10);
      --nav-bg: #f5f3ee;
      --shadow-sm:0 1px 4px rgba(0,0,0,.08); --shadow-md:0 4px 20px rgba(0,0,0,.12); --shadow-lg:0 12px 40px rgba(0,0,0,.18);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: var(--bg); color: var(--text);
      font-family: 'Outfit', sans-serif; min-height: 100vh;
      -webkit-font-smoothing: antialiased;
      padding-left: var(--nav-w);
      transition: background .3s, color .3s;
    }
    @media(max-width:768px) { body { padding-left:0 !important; padding-bottom:var(--mobile-nav-h) !important; } }
    ::-webkit-scrollbar { width:4px; height:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:99px; }

    /* Typography */
    h1,h2,h3,h4 { font-family:'Archivo',sans-serif; font-weight:800; letter-spacing:-0.03em; line-height:1.15; }
    .serif { font-family:'Instrument Serif',serif; font-style:italic; }

    /* Layout */
    .container { max-width:1240px; margin:0 auto; padding:28px 24px; }
    @media(max-width:600px) { .container { padding:16px; } }

    /* Page header */
    .header { padding:0 0 30px; }
    .header h1 { font-size:2rem; font-weight:900; letter-spacing:-0.04em; }
    .header p { color:var(--text2); font-size:.9rem; margin-top:5px; }
    .page-header { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:28px; flex-wrap:wrap; }
    .page-title { font-family:'Archivo',sans-serif; font-size:1.75rem; font-weight:900; letter-spacing:-0.04em; }
    .page-subtitle { color:var(--text2); font-size:.875rem; margin-top:4px; }
    .header-actions { display:flex; gap:8px; align-items:center; }

    /* Top bar */
    .top-bar { display:flex; align-items:center; gap:8px; margin-bottom:28px; flex-wrap:wrap; }
    .back-link { display:inline-flex; align-items:center; gap:6px; color:var(--text2); text-decoration:none; font-size:.8rem; font-weight:500; padding:6px 12px; border:1px solid var(--border); border-radius:var(--r-md); background:var(--card); transition:all .15s; }
    .back-link:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-lo); }

    /* Stat cards */
    .stats-row { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:28px; }
    @media(min-width:600px) { .stats-row { grid-template-columns:repeat(4,1fr); } }
    .stat-card { background:var(--card); border:1px solid var(--border); border-radius:var(--r-lg); padding:20px 16px; text-align:center; transition:all .2s; }
    .stat-card:hover { border-color:var(--border2); transform:translateY(-2px); }
    .stat-value { font-family:'Archivo',sans-serif; font-size:1.75rem; font-weight:900; letter-spacing:-0.04em; line-height:1; }
    .stat-value.blue { color:var(--accent); }
    .stat-value.green { color:var(--accent2); }
    .stat-value.orange { color:var(--warn); }
    .stat-value.red { color:var(--danger); }
    .stat-value.clay { color:var(--clay); }
    .stat-label { font-size:.68rem; color:var(--dim); margin-top:7px; font-weight:600; text-transform:uppercase; letter-spacing:.07em; }

    /* Cards */
    .card,.section { background:var(--card); border:1px solid var(--border); border-radius:var(--r-xl); padding:22px; margin-bottom:16px; transition:border-color .2s; }
    .section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:10px; }
    .section-title { font-family:'Archivo',sans-serif; font-size:1rem; font-weight:700; letter-spacing:-0.02em; }

    /* Buttons */
    .btn { display:inline-flex; align-items:center; gap:7px; padding:10px 20px; border:none; border-radius:var(--r-md); font-family:'Outfit',sans-serif; font-size:.875rem; font-weight:600; cursor:pointer; text-decoration:none; transition:all .15s; white-space:nowrap; letter-spacing:.01em; }
    .btn:hover { transform:translateY(-1px); }
    .btn:active { transform:scale(.97); }
    .btn svg { width:15px; height:15px; flex-shrink:0; }

    .btn-primary { background:var(--accent); color:#fff; box-shadow:0 1px 0 rgba(0,0,0,.2),0 4px 12px rgba(59,130,246,.3),inset 0 1px 0 rgba(255,255,255,.15); }
    .btn-primary:hover { filter:brightness(1.08); box-shadow:0 1px 0 rgba(0,0,0,.25),0 8px 20px rgba(59,130,246,.4),inset 0 1px 0 rgba(255,255,255,.15); }

    .btn-clay { background:var(--clay); color:#fff; box-shadow:0 1px 0 rgba(0,0,0,.2),0 4px 12px rgba(194,65,12,.3),inset 0 1px 0 rgba(255,255,255,.12); }
    .btn-clay:hover { filter:brightness(1.1); box-shadow:0 1px 0 rgba(0,0,0,.25),0 8px 20px rgba(194,65,12,.4); }

    .btn-success { background:var(--accent2); color:#fff; box-shadow:0 1px 0 rgba(0,0,0,.2),0 4px 12px rgba(16,185,129,.25); }
    .btn-success:hover { filter:brightness(1.08); }

    .btn-danger { background:var(--danger); color:#fff; box-shadow:0 1px 0 rgba(0,0,0,.2),0 4px 10px rgba(239,68,68,.25); }
    .btn-outline { background:transparent; border:1px solid var(--border); color:var(--text); box-shadow:var(--shadow-sm); }
    .btn-outline:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-lo); }
    .btn-ghost { background:transparent; color:var(--text2); }
    .btn-ghost:hover { background:var(--card); color:var(--text); }
    .btn-small { padding:6px 12px; font-size:.78rem; }
    .btn-icon { padding:9px; min-width:38px; justify-content:center; }

    /* Filters */
    .filters { display:flex; gap:6px; margin-bottom:20px; flex-wrap:wrap; }
    .filter-btn { padding:7px 16px; background:transparent; border:1px solid var(--border); border-radius:99px; color:var(--text2); cursor:pointer; font-family:'Outfit',sans-serif; font-size:.8rem; font-weight:500; transition:all .15s; }
    .filter-btn:hover { border-color:var(--border2); color:var(--text); }
    .filter-btn.active { background:var(--accent); border-color:var(--accent); color:#fff; box-shadow:0 2px 8px rgba(59,130,246,.3); }

    /* Status badges */
    .status-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:99px; font-size:.68rem; font-weight:700; letter-spacing:.04em; text-transform:uppercase; }
    .status-badge::before { content:''; width:5px; height:5px; border-radius:50%; background:currentColor; flex-shrink:0; }
    .status-a_venir  { background:var(--warn-lo);    color:var(--warn);   }
    .status-en_cours { background:var(--accent-md);  color:var(--accent); }
    .status-termine  { background:var(--accent2-md); color:var(--accent2);}
    .status-recu     { background:var(--accent2-md); color:var(--accent2);}
    .status-partiel  { background:var(--warn-lo);    color:var(--warn);   }
    .status-annule   { background:var(--danger-lo);  color:var(--danger); }
    .status-payee    { background:var(--accent2-md); color:var(--accent2);}
    .status-impayee  { background:var(--danger-lo);  color:var(--danger); }
    .status-pending  { background:var(--clay-lo);    color:var(--clay);   }

    /* Inputs */
    input,select,textarea { font-family:'Outfit',sans-serif; background:var(--bg2); border:1px solid var(--border); border-radius:var(--r-md); color:var(--text); font-size:.875rem; padding:10px 14px; transition:border-color .15s,box-shadow .15s; outline:none; width:100%; }
    input:focus,select:focus,textarea:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(59,130,246,.12); }
    select option { background:var(--card); }
    label { font-size:.72rem; font-weight:700; color:var(--text2); margin-bottom:6px; display:block; text-transform:uppercase; letter-spacing:.06em; }

    /* Tables */
    .table-wrapper { overflow-x:auto; -webkit-overflow-scrolling:touch; border-radius:var(--r-lg); }
    table { width:100%; border-collapse:collapse; font-size:.85rem; }
    thead th { padding:10px 14px; text-align:left; color:var(--dim); font-size:.68rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; border-bottom:1px solid var(--border); white-space:nowrap; }
    tbody td { padding:12px 14px; border-bottom:1px solid var(--border); color:var(--text); vertical-align:middle; }
    tbody tr:last-child td { border-bottom:none; }
    tbody tr:hover td { background:rgba(128,128,128,.04); }

    /* Progress */
    .progress-bar { height:5px; background:var(--border); border-radius:99px; overflow:hidden; }
    .progress-header { display:flex; justify-content:space-between; margin-bottom:6px; font-size:.78rem; }
    .progress-fill { height:100%; border-radius:99px; transition:width .4s; }
    .progress-fill.safe    { background:linear-gradient(90deg,var(--accent2),#34d399); }
    .progress-fill.warning { background:linear-gradient(90deg,var(--warn),#fbbf24); }
    .progress-fill.danger  { background:linear-gradient(90deg,var(--danger),#f87171); }

    /* Modal */
    .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.6); backdrop-filter:blur(8px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; }
    .modal { background:var(--card); border:1px solid var(--border2); border-radius:var(--r-xl); padding:28px; width:100%; max-width:520px; max-height:90vh; overflow-y:auto; box-shadow:var(--shadow-lg); }
    .modal-title { font-family:'Archivo',sans-serif; font-size:1.1rem; font-weight:800; margin-bottom:20px; letter-spacing:-0.02em; }

    /* Toast */
    .toast { position:fixed; bottom:90px; right:20px; padding:12px 20px; border-radius:var(--r-lg); font-size:.875rem; font-weight:500; z-index:2000; animation:toastIn .2s ease; box-shadow:var(--shadow-md); }
    @keyframes toastIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    .toast-success { background:var(--accent2); color:#fff; }
    .toast-error { background:var(--danger); color:#fff; }

    /* Empty state */
    .empty-state { text-align:center; padding:64px 20px; color:var(--dim); }
    .empty-state p { font-size:.9rem; }

    /* Footer */
    .footer { text-align:center; padding:32px; color:var(--dim); font-size:.78rem; }
    .footer a { color:var(--accent); text-decoration:none; }
    hr { border:none; border-top:1px solid var(--border); margin:20px 0; }

    /* Project cards */
    .project-card { background:var(--card); border:1px solid var(--border); border-radius:var(--r-xl); overflow:hidden; transition:all .25s; cursor:pointer; }
    .project-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); border-color:var(--accent); }
    .project-header { padding:18px; border-bottom:1px solid var(--border); }
    .project-name { font-family:'Archivo',sans-serif; font-size:1.1rem; font-weight:800; margin-bottom:5px; letter-spacing:-0.02em; }
    .project-client { color:var(--text2); font-size:.82rem; }
    .project-body { padding:16px 18px; }
    .project-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:14px; }
    .project-stat { text-align:center; }
    .project-stat-value { font-family:'Archivo',sans-serif; font-size:.95rem; font-weight:800; }
    .project-stat-label { font-size:.65rem; color:var(--dim); margin-top:2px; }
    .project-footer { padding:12px 18px; background:rgba(128,128,128,.04); display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); }
    .project-location { font-size:.78rem; color:var(--dim); }
    .project-arrow { color:var(--accent); font-size:1rem; }
    .projects-grid { display:grid; grid-template-columns:1fr; gap:14px; }
    @media(min-width:600px) { .projects-grid { grid-template-columns:repeat(2,1fr); } }
    @media(min-width:900px) { .projects-grid { grid-template-columns:repeat(3,1fr); } }
  `;
  document.head.appendChild(tokens);

  /* ── SIDEBAR CSS ────────────────────────────────────────────── */
  const navCSS = document.createElement('style');
  navCSS.textContent = `
    #atlas-sidebar { position:fixed; top:0; left:0; width:var(--nav-w); height:100vh; background:var(--nav-bg); border-right:1px solid var(--border); display:flex; flex-direction:column; z-index:900; transition:background .3s,border-color .3s; overflow:hidden; }

    .nav-brand { padding:20px 16px 18px; border-bottom:1px solid var(--border); flex-shrink:0; }
    .nav-brand-row { display:flex; align-items:center; gap:10px; margin-bottom:2px; }
    .nav-brand-link { display:flex; align-items:center; gap:10px; text-decoration:none; flex:1; min-width:0; }
    .nav-logo-mark { width:30px; height:30px; flex-shrink:0; }
    .nav-logo-mark svg { width:30px; height:30px; }
    .nav-brand-name { font-family:'Archivo',sans-serif; font-size:1.05rem; font-weight:900; letter-spacing:-0.05em; color:var(--text); line-height:1; }
    .nav-brand-name em { font-style:italic; color:var(--clay); }
    .nav-brand-sub { font-size:.6rem; color:var(--dim); margin-top:4px; letter-spacing:.1em; text-transform:uppercase; padding-left:40px; }

    .nav-theme-btn { background:none; border:1px solid var(--border); border-radius:var(--r-md); padding:5px; cursor:pointer; color:var(--text2); display:flex; align-items:center; justify-content:center; transition:all .15s; flex-shrink:0; }
    .nav-theme-btn:hover { border-color:var(--border2); color:var(--text); background:var(--card); }
    .nav-theme-btn svg { width:14px; height:14px; stroke:currentColor; fill:none; }

    .nav-links { flex:1; padding:12px 8px; overflow-y:auto; display:flex; flex-direction:column; gap:1px; }
    .nav-section-lbl { font-size:.6rem; font-weight:700; color:var(--dim); text-transform:uppercase; letter-spacing:.1em; padding:9px 10px 3px; }
    .nav-item { display:flex; align-items:center; gap:9px; padding:9px 10px; border-radius:10px; text-decoration:none; color:var(--text2); font-size:.835rem; font-weight:500; border:1px solid transparent; position:relative; transition:all .12s; }
    .nav-item svg { width:16px; height:16px; flex-shrink:0; opacity:.6; transition:opacity .12s; }
    .nav-item:hover { background:rgba(128,128,128,.07); color:var(--text); }
    .nav-item:hover svg { opacity:.9; }
    .nav-item.active { background:var(--accent-md); color:var(--text); border-color:rgba(59,130,246,.2); font-weight:600; }
    .nav-item.active svg { opacity:1; color:var(--accent); }
    .nav-item.active::before { content:''; position:absolute; left:-1px; top:22%; bottom:22%; width:2px; background:var(--accent); border-radius:0 2px 2px 0; }
    [data-theme="light"] .nav-item.active { background:var(--accent-lo); border-color:rgba(29,78,216,.15); }
    .nav-div { height:1px; background:var(--border); margin:7px 6px; }
    .nav-footer { padding:14px 16px; border-top:1px solid var(--border); flex-shrink:0; }
    .nav-footer-pill { display:inline-flex; align-items:center; gap:6px; font-size:.65rem; color:var(--dim); background:var(--bg2); border:1px solid var(--border); padding:4px 10px; border-radius:99px; }
    .nav-footer-dot { width:5px; height:5px; background:var(--accent2); border-radius:50%; }

    #atlas-bottom-nav { display:none; position:fixed; bottom:0; left:0; right:0; height:var(--mobile-nav-h); background:var(--nav-bg); border-top:1px solid var(--border); backdrop-filter:blur(12px); z-index:900; overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none; transition:background .3s,border-color .3s; }
    #atlas-bottom-nav::-webkit-scrollbar { display:none; }
    .mobile-nav-inner { display:flex; align-items:stretch; height:100%; min-width:max-content; padding:0 4px; }
    .mobile-nav-item { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:4px 12px; text-decoration:none; color:var(--dim); font-size:.58rem; font-weight:500; gap:3px; min-width:56px; border-top:2px solid transparent; transition:all .15s; }
    .mobile-nav-item svg { width:19px; height:19px; }
    .mobile-nav-item.active { color:var(--accent); border-top-color:var(--accent); }

    @media(max-width:768px) { #atlas-sidebar { display:none; } #atlas-bottom-nav { display:block; } }
  `;
  document.head.appendChild(navCSS);

  /* ── LOGO SVG ───────────────────────────────────────────────── */
  const LOGO_SVG = `<svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="9" width="12" height="12" rx="1" transform="rotate(45 15 15)" stroke="var(--clay)" stroke-width="1.5"/>
    <rect x="12" y="12" width="6" height="6" transform="rotate(45 15 15)" fill="var(--clay)" opacity=".22"/>
    <line x1="7" y1="24" x2="23" y2="24" stroke="var(--clay)" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`;

  /* ── BUILD SIDEBAR ──────────────────────────────────────────── */
  function buildSidebar() {
    const renderItems = (items) => items.map(i => `
      <a href="${i.href}" class="nav-item ${activePage === i.id ? 'active' : ''}">${i.icon}<span>${i.label}</span></a>
    `).join('');

    const sidebar = document.createElement('nav');
    sidebar.id = 'atlas-sidebar';
    sidebar.innerHTML = `
      <div class="nav-brand">
        <div class="nav-brand-row">
          <a href="./atlas-projects.html" class="nav-brand-link">
            <div class="nav-logo-mark">${LOGO_SVG}</div>
            <div class="nav-brand-name">Atlas<em>Pose</em></div>
          </a>
          <button class="nav-theme-btn" id="atlas-theme-toggle" title="Changer le thème">
            ${currentTheme === 'dark' ? ICON_SUN : ICON_MOON}
          </button>
        </div>
        <div class="nav-brand-sub">Gestion chantiers</div>
      </div>
      <div class="nav-links">
        <div class="nav-section-lbl">Principal</div>
        ${renderItems(NAV_ITEMS.slice(0, 7))}
        <div class="nav-div"></div>
        <div class="nav-section-lbl">Système</div>
        ${renderItems(NAV_ITEMS.slice(7))}
      </div>
      <div class="nav-footer">
        <div class="nav-footer-pill"><div class="nav-footer-dot"></div>v4.0 · Atlas Pose</div>
      </div>
    `;
    document.body.insertBefore(sidebar, document.body.firstChild);
    document.getElementById('atlas-theme-toggle').addEventListener('click', () => {
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  /* ── BUILD BOTTOM NAV ───────────────────────────────────────── */
  function buildBottomNav() {
    const items = NAV_ITEMS.map(i => `
      <a href="${i.href}" class="mobile-nav-item ${activePage === i.id ? 'active' : ''}">${i.icon}<span>${i.label}</span></a>
    `).join('');
    const nav = document.createElement('nav');
    nav.id = 'atlas-bottom-nav';
    nav.innerHTML = `<div class="mobile-nav-inner">${items}</div>`;
    document.body.appendChild(nav);
  }

  /* ── CLEAN OLD LINKS ────────────────────────────────────────── */
  function cleanOldLinks() {
    document.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const text = a.textContent || '';
      if (href === './' || href === '../' || href === '/index.html' ||
        href.includes('alfred-hub') || href.includes('index.html') ||
        text.includes('Alfred Hub') || text.includes('🏠 Alfred Hub')) a.remove();
    });
  }

  /* ── INIT ───────────────────────────────────────────────────── */
  function init() {
    applyTheme(currentTheme);
    buildSidebar();
    buildBottomNav();
    setTimeout(cleanOldLinks, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
