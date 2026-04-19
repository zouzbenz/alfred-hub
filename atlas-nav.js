/**
 * Atlas Pose — Navigation partagée
 * Sidebar fixe sur desktop, bottom nav sur mobile
 * Inclure ce script dans toutes les pages AVANT </body>
 * Usage: <script src="./atlas-nav.js"></script>
 */

(function() {
  const NAV_ITEMS = [
    { href: './atlas-projects.html',   icon: '🏗️',  label: 'Projets',      id: 'projects'   },
    { href: './atlas-clients.html',    icon: '👤',  label: 'Clients',      id: 'clients'    },
    { href: './atlas-commandes.html',  icon: '📦',  label: 'Commandes',    id: 'commandes'  },
    { href: './atlas-factures.html',   icon: '🧾',  label: 'Factures',     id: 'factures'   },
    { href: './atlas-tasks.html',      icon: '📋',  label: 'Tâches',       id: 'tasks'      },
    { href: './atlas-ouvriers.html',   icon: '👷',  label: 'Équipe',       id: 'ouvriers'   },
    { href: './atlas-suppliers.html',  icon: '🏢',  label: 'Fournisseurs', id: 'suppliers'  },
    { href: './atlas-backoffice.html', icon: '⚙️',  label: 'Admin',        id: 'backoffice' },
  ];

  // Déterminer la page active
  function getActivePage() {
    const path = window.location.pathname;
    const file = path.split('/').pop().replace('.html', '');
    for (const item of NAV_ITEMS) {
      if (item.href.includes(file)) return item.id;
    }
    return '';
  }

  const activePage = getActivePage();

  // CSS injection
  const style = document.createElement('style');
  style.textContent = `
    /* === ATLAS NAV SYSTEM === */
    :root {
      --nav-w: 220px;
      --nav-bg: #0d1420;
      --nav-border: #1a2332;
      --nav-accent: #3b82f6;
      --nav-text: #f3f4f6;
      --nav-dim: #6b7280;
      --nav-hover: rgba(59,130,246,0.1);
      --nav-active-bg: rgba(59,130,246,0.15);
      --nav-active-border: #3b82f6;
      --mobile-nav-h: 64px;
    }

    /* Body padding pour laisser place à la nav */
    body {
      padding-left: var(--nav-w) !important;
    }
    @media(max-width: 768px) {
      body {
        padding-left: 0 !important;
        padding-bottom: var(--mobile-nav-h) !important;
      }
    }

    /* ===== SIDEBAR (desktop) ===== */
    #atlas-sidebar {
      position: fixed;
      top: 0; left: 0;
      width: var(--nav-w);
      height: 100vh;
      background: var(--nav-bg);
      border-right: 1px solid var(--nav-border);
      display: flex;
      flex-direction: column;
      z-index: 900;
      overflow: hidden;
    }

    #atlas-sidebar .nav-brand {
      padding: 20px 16px 18px;
      border-bottom: 1px solid var(--nav-border);
      flex-shrink: 0;
    }
    #atlas-sidebar .nav-brand-logo {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--nav-text);
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }
    #atlas-sidebar .nav-brand-logo span {
      color: var(--nav-accent);
    }
    #atlas-sidebar .nav-brand-sub {
      font-size: 0.7rem;
      color: var(--nav-dim);
      margin-top: 3px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    #atlas-sidebar .nav-links {
      flex: 1;
      padding: 12px 10px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    #atlas-sidebar .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      text-decoration: none;
      color: var(--nav-dim);
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.15s ease;
      border: 1px solid transparent;
      position: relative;
    }
    #atlas-sidebar .nav-item:hover {
      background: var(--nav-hover);
      color: var(--nav-text);
    }
    #atlas-sidebar .nav-item.active {
      background: var(--nav-active-bg);
      color: var(--nav-text);
      border-color: var(--nav-active-border);
      font-weight: 600;
    }
    #atlas-sidebar .nav-item .nav-icon {
      font-size: 1rem;
      width: 20px;
      text-align: center;
      flex-shrink: 0;
    }
    #atlas-sidebar .nav-item .nav-label {
      flex: 1;
    }
    #atlas-sidebar .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0; top: 25%; bottom: 25%;
      width: 3px;
      background: var(--nav-accent);
      border-radius: 0 3px 3px 0;
    }

    #atlas-sidebar .nav-divider {
      height: 1px;
      background: var(--nav-border);
      margin: 8px 10px;
    }

    #atlas-sidebar .nav-footer {
      padding: 14px 16px;
      border-top: 1px solid var(--nav-border);
      flex-shrink: 0;
    }
    #atlas-sidebar .nav-footer-text {
      font-size: 0.7rem;
      color: var(--nav-dim);
      text-align: center;
    }

    /* ===== BOTTOM NAV (mobile) ===== */
    #atlas-bottom-nav {
      display: none;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      height: var(--mobile-nav-h);
      background: var(--nav-bg);
      border-top: 1px solid var(--nav-border);
      z-index: 900;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    #atlas-bottom-nav::-webkit-scrollbar { display: none; }

    #atlas-bottom-nav .mobile-nav-inner {
      display: flex;
      align-items: stretch;
      height: 100%;
      min-width: max-content;
      padding: 0 4px;
    }

    #atlas-bottom-nav .mobile-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6px 14px;
      text-decoration: none;
      color: var(--nav-dim);
      font-size: 0.6rem;
      font-weight: 500;
      gap: 3px;
      min-width: 60px;
      border-top: 2px solid transparent;
      transition: all 0.15s ease;
    }
    #atlas-bottom-nav .mobile-nav-item .mob-icon {
      font-size: 1.3rem;
      line-height: 1;
    }
    #atlas-bottom-nav .mobile-nav-item.active {
      color: var(--nav-accent);
      border-top-color: var(--nav-accent);
    }

    @media(max-width: 768px) {
      #atlas-sidebar { display: none; }
      #atlas-bottom-nav { display: block; }
    }

    /* Masquer les anciens top-bar avec liens de nav */
    .atlas-hide-old-nav .top-bar {
      /* On garde le top-bar mais on supprime les back-links qui dupliquent la nav */
    }
  `;
  document.head.appendChild(style);

  // Build sidebar HTML
  function buildSidebar() {
    const items = NAV_ITEMS.map(item => `
      <a href="${item.href}" class="nav-item ${activePage === item.id ? 'active' : ''}" data-id="${item.id}">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label">${item.label}</span>
      </a>
    `).join('');

    const sidebar = document.createElement('nav');
    sidebar.id = 'atlas-sidebar';
    sidebar.innerHTML = `
      <div class="nav-brand">
        <a href="./atlas-projects.html" class="nav-brand-logo">
          🔧 Atlas<span>Pose</span>
        </a>
        <div class="nav-brand-sub">Gestion chantiers</div>
      </div>
      <div class="nav-links">
        ${items}
      </div>
      <div class="nav-footer">
        <div class="nav-footer-text">v2.0 — Atlas Pose</div>
      </div>
    `;
    document.body.insertBefore(sidebar, document.body.firstChild);
  }

  // Build mobile bottom nav
  function buildBottomNav() {
    const items = NAV_ITEMS.map(item => `
      <a href="${item.href}" class="mobile-nav-item ${activePage === item.id ? 'active' : ''}">
        <span class="mob-icon">${item.icon}</span>
        <span>${item.label}</span>
      </a>
    `).join('');

    const bottomNav = document.createElement('nav');
    bottomNav.id = 'atlas-bottom-nav';
    bottomNav.innerHTML = `<div class="mobile-nav-inner">${items}</div>`;
    document.body.appendChild(bottomNav);
  }

  // Supprimer les liens vers Alfred Hub dans tous les top-bars
  function removeAlfredLinks() {
    document.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const text = a.textContent || '';
      if (
        href === './' || href === '../' || href === '/index.html' ||
        href.includes('alfred-hub') || href.includes('index.html') ||
        text.includes('Alfred Hub') || text.includes('🏠 Alfred Hub')
      ) {
        a.remove();
      }
    });
  }

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    buildSidebar();
    buildBottomNav();
    // Petit délai pour laisser le DOM se rendre
    setTimeout(removeAlfredLinks, 100);
  }

})();
