// ============================================================
// TRANSITOPS — APP.JS
// Shared application logic: sidebar, header, theme, toasts
// ============================================================

// ── Icon Injection (replaces data-icon attributes with SVGs) ──
function injectIcons() {
  document.querySelectorAll('[data-icon]').forEach(el => {
    const name = el.getAttribute('data-icon');
    if (Icons[name]) {
      el.innerHTML = Icons[name];
    }
  });
}

// ── Premium Metric Count-Up Animation ──
function animateMetrics() {
  const elements = document.querySelectorAll('.kpi-card-value, .report-hero-value');
  elements.forEach(el => {
    // Parse the inner text or children text
    const text = el.innerText.trim();
    
    // Check if we've already animated this element
    if (el.dataset.animated === "true") return;
    el.dataset.animated = "true";

    // Extract numbers, decimal point, prefix and suffix
    const match = text.match(/^([^\d\.]*)([\d,\.]+)([^\d]*)$/);
    if (!match) return;

    const prefix = match[1];
    const rawNumberStr = match[2].replace(/,/g, '');
    const suffix = match[3];
    const targetValue = parseFloat(rawNumberStr);

    if (isNaN(targetValue)) return;

    // Detect decimal places
    const decMatch = rawNumberStr.match(/\.(\d+)/);
    const decimals = decMatch ? decMatch[1].length : 0;

    let startTimestamp = null;
    const duration = 1200; // milliseconds

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Quad ease-out easing
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const currentValue = easedProgress * targetValue;
      
      // Format number with decimals & thousands separators
      let formattedVal = currentValue.toFixed(decimals);
      if (decimals === 0) {
        formattedVal = Math.floor(currentValue).toLocaleString();
      } else {
        const parts = currentValue.toFixed(decimals).split('.');
        parts[0] = parseInt(parts[0]).toLocaleString();
        formattedVal = parts.join('.');
      }

      el.innerHTML = `${prefix}${formattedVal}${suffix ? `<span class="kpi-card-unit">${suffix.trim()}</span>` : ''}`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Set exact final string
        el.innerHTML = text.replace(match[2], targetValue.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }));
      }
    }
    window.requestAnimationFrame(step);
  });
}

// ── Current Page Detection ──
function getCurrentPage() {
  const path = window.location.pathname;
  const file = path.split('/').pop() || 'index.html';
  if (file === '' || file === 'index.html') return 'dashboard';
  return file.replace('.html', '');
}

// ── Sidebar Component ──
function renderSidebar() {
  const currentPage = getCurrentPage();
  const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';

  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', href: 'index.html' },
    { id: 'fleet-map', icon: 'fleetMap', label: 'Live Fleet Map', href: 'fleet-map.html' },
    { id: 'vehicles', icon: 'truck', label: 'Vehicles', href: 'vehicles.html' },
    { id: 'drivers', icon: 'drivers', label: 'Drivers', href: 'drivers.html' },
    { id: 'trips', icon: 'trips', label: 'Trips', href: 'trips.html' },
    { id: 'maintenance', icon: 'maintenance', label: 'Maintenance', href: 'maintenance.html' },
    { id: 'fuel-costs', icon: 'fuel', label: 'Fuel & Costs', href: 'fuel-costs.html' },
    { id: 'reports', icon: 'reports', label: 'Reports', href: 'reports.html' },
  ];

  const secondaryItems = [
    { id: 'alerts', icon: 'alerts', label: 'Alerts', href: 'alerts.html' },
    { id: 'settings', icon: 'settings', label: 'Settings', href: 'settings.html' },
  ];

  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  sidebar.className = `sidebar${isCollapsed ? ' collapsed' : ''}`;
  sidebar.innerHTML = `
    <div class="sidebar-logo" style="cursor:pointer" onclick="window.location.href='landing.html'" title="Return to Landing Page">
      <div class="sidebar-logo-mark">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
          <polyline points="2 17 12 22 22 17"/>
          <polyline points="2 12 12 17 22 12"/>
        </svg>
      </div>
      <span class="sidebar-logo-text">TransitOps</span>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-title">Main</div>
      ${navItems.map(item => `
        <a href="${item.href}" class="nav-item${currentPage === item.id ? ' active' : ''}" data-page="${item.id}">
          <span class="nav-icon">${Icons[item.icon]}</span>
          <span class="nav-label">${item.label}</span>
        </a>
      `).join('')}
      <div class="nav-section-title">System</div>
      ${secondaryItems.map(item => `
        <a href="${item.href}" class="nav-item${currentPage === item.id ? ' active' : ''}" data-page="${item.id}">
          <span class="nav-icon">${Icons[item.icon]}</span>
          <span class="nav-label">${item.label}</span>
        </a>
      `).join('')}
    </nav>
    <div class="sidebar-bottom">
      <div class="sidebar-user">
        <div class="avatar">${(() => { const u = JSON.parse(localStorage.getItem('transitops_user') || '{}'); return u.initials || 'U'; })()}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${(() => { const u = JSON.parse(localStorage.getItem('transitops_user') || '{}'); return u.name || 'User'; })()}</div>
          <div style="font-size:11px;color:var(--text-tertiary)">${(() => { const u = JSON.parse(localStorage.getItem('transitops_user') || '{}'); return u.role || 'Fleet Manager'; })()}</div>
        </div>
        <button title="Logout" onclick="localStorage.removeItem('transitops_auth');localStorage.removeItem('transitops_user');window.location.href='landing.html'" style="background:none;border:none;cursor:pointer;color:var(--text-tertiary);padding:4px;border-radius:6px;transition:color 0.2s" onmouseover="this.style.color='var(--coral-400)'" onmouseout="this.style.color='var(--text-tertiary)'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
      <button class="sidebar-collapse-btn" onclick="toggleSidebar()" aria-label="Toggle sidebar">
        ${Icons.sidebar}
      </button>
    </div>
  `;
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main = document.querySelector('.main-wrapper');
  sidebar.classList.toggle('collapsed');
  if (main) main.classList.toggle('sidebar-collapsed');
  localStorage.setItem('sidebar-collapsed', sidebar.classList.contains('collapsed'));
}

// ── Header Component ──
function renderHeader(pageTitle, breadcrumbs) {
  const header = document.getElementById('header');
  if (!header) return;

  const breadcrumbHtml = breadcrumbs ? breadcrumbs.map((b, i) => {
    if (i < breadcrumbs.length - 1) {
      return `<span>${b}</span><span class="breadcrumb-sep">/</span>`;
    }
    return `<span style="color:var(--text-primary)">${b}</span>`;
  }).join('') : '';

  header.innerHTML = `
    <div class="header-left">
      <div>
        <div class="page-title">${pageTitle}</div>
        ${breadcrumbHtml ? `<div class="breadcrumb">${breadcrumbHtml}</div>` : ''}
      </div>
    </div>
    <div class="header-right">
      <div class="header-search">
        <span class="search-icon">${Icons.search}</span>
        <input type="text" placeholder="Search vehicles, drivers, routes..." id="globalSearch" />
        <span class="header-search-shortcut">⌘K</span>
      </div>
      <div class="system-status">
        <span class="status-dot"></span>
        <span>All Systems Operational</span>
      </div>
      <button class="header-bell" aria-label="Notifications" onclick="showToast('info', 'Notifications', '3 new alerts since your last login')">
        ${Icons.bell}
        <span class="header-bell-badge">3</span>
      </button>
      <button class="btn-icon" onclick="toggleTheme()" aria-label="Toggle theme" id="themeToggleBtn">
        ${Icons.moon}
      </button>
    </div>
  `;

  updateThemeIcon();
}

// ── Theme Toggle ──
function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.documentElement.classList.add('theme-light');
    document.documentElement.classList.remove('theme-dark');
  } else {
    document.documentElement.classList.add('theme-dark');
    document.documentElement.classList.remove('theme-light');
  }
}

function toggleTheme() {
  const isLight = document.documentElement.classList.contains('theme-light');
  if (isLight) {
    document.documentElement.classList.remove('theme-light');
    document.documentElement.classList.add('theme-dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.add('theme-light');
    document.documentElement.classList.remove('theme-dark');
    localStorage.setItem('theme', 'light');
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  const isLight = document.documentElement.classList.contains('theme-light');
  btn.innerHTML = isLight ? Icons.sun : Icons.moon;
}

// ── Toast System ──
function showToast(type, title, message, duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const iconMap = {
    success: `<span style="color:var(--emerald-400)">${Icons.check}</span>`,
    error: `<span style="color:var(--coral-400)">${Icons.alertTriangle}</span>`,
    warning: `<span style="color:var(--amber-400)">${Icons.alertTriangle}</span>`,
    info: `<span style="color:var(--violet-400)">${Icons.info}</span>`
  };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || iconMap.info}</span>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.closest('.toast').remove()">
      ${Icons.x}
    </button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 200);
  }, duration);
}

// ── Star Rating Helper ──
function renderStars(rating) {
  let html = '<span class="star-rating">';
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      html += Icons.star;
    } else {
      html += `<span class="star-empty">${Icons.starEmpty}</span>`;
    }
  }
  html += '</span>';
  return html;
}

// ── Status Pill Helper ──
function statusPill(status) {
  const labels = {
    'delivered': 'Delivered',
    'in-transit': 'In Transit',
    'delayed': 'Delayed',
    'cancelled': 'Cancelled',
    'active': 'Active',
    'off-duty': 'Off Duty',
    'on-break': 'On Break',
    'moving': 'Moving',
    'idle': 'Idle',
    'alert': 'Alert',
    'scheduled': 'Scheduled',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'overdue': 'Overdue',
    'critical': 'Critical',
    'high': 'High',
    'medium': 'Medium',
    'low': 'Low',
    'success': 'Success',
    'warning': 'Warning',
  };
  return `<span class="status-pill ${status}">${labels[status] || status}</span>`;
}

// ── Priority Badge Helper ──
function priorityBadge(priority) {
  return `<span class="priority-badge ${priority}">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>`;
}

// ── Mobile Navigation ──
function renderMobileNav() {
  const currentPage = getCurrentPage();
  const items = [
    { id: 'dashboard', icon: 'dashboard', label: 'Home', href: 'index.html' },
    { id: 'fleet-map', icon: 'fleetMap', label: 'Map', href: 'fleet-map.html' },
    { id: 'trips', icon: 'trips', label: 'Trips', href: 'trips.html' },
    { id: 'drivers', icon: 'drivers', label: 'Drivers', href: 'drivers.html' },
    { id: 'reports', icon: 'reports', label: 'Reports', href: 'reports.html' },
  ];

  const nav = document.createElement('nav');
  nav.className = 'mobile-nav';
  nav.innerHTML = items.map(item => `
    <a href="${item.href}" class="mobile-nav-item${currentPage === item.id ? ' active' : ''}">
      ${Icons[item.icon]}
      <span>${item.label}</span>
    </a>
  `).join('');
  document.body.appendChild(nav);
}

// ── Init App ──
function initApp(pageTitle, breadcrumbs) {
  // ── Auth Guard: redirect unauthenticated users to landing page ──
  const auth = localStorage.getItem('transitops_auth');
  if (!auth) {
    window.location.replace('landing.html');
    return;
  }

  initTheme();
  renderSidebar();
  renderHeader(pageTitle, breadcrumbs);
  renderMobileNav();
  injectIcons();
  
  // Stagger start the count-ups after DOM is fully painted
  setTimeout(animateMetrics, 150);

  // Keyboard shortcut for search
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const search = document.getElementById('globalSearch');
      if (search) search.focus();
    }
  });
}

// ── Format Currency ──
function formatCurrency(num) {
  return '$' + num.toLocaleString();
}

// ── Format Number ──
function formatNum(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}
