// ============================================================
// TRANSITOPS — APP.JS
// Shared application logic: sidebar, header, theme, toasts
// ============================================================

// Global cache for logged-in user details
let currentUser = null;

// Fetch active user details from the Next.js API
async function fetchCurrentUser() {
  if (currentUser) return currentUser;
  try {
    const res = await fetch('/api/auth/me');
    if (res.ok) {
      currentUser = await res.json();
      return currentUser;
    }
  } catch (e) {
    console.error('Failed to fetch user session', e);
  }
  return null;
}

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

// ── Logout Handler ──
async function handleLogout() {
  try {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      showToast('success', 'Logged Out', 'Redirecting to sign-in page...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    }
  } catch (e) {
    showToast('error', 'Logout Failed', 'Please try again.');
  }
}

// ── Sidebar Component ──
async function renderSidebar() {
  const currentPage = getCurrentPage();
  const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  const user = await fetchCurrentUser();

  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', href: 'index.html' },
    { id: 'fleet-map', icon: 'fleetMap', label: 'Live Fleet Map', href: 'fleet-map.html' },
    { id: 'trips', icon: 'trips', label: 'Trips', href: 'trips.html' },
    { id: 'drivers', icon: 'drivers', label: 'Drivers', href: 'drivers.html' },
    { id: 'maintenance', icon: 'maintenance', label: 'Maintenance', href: 'maintenance.html' },
    { id: 'fuel-costs', icon: 'fuel', label: 'Fuel & Costs', href: 'fuel-costs.html' },
    { id: 'reports', icon: 'reports', label: 'Reports', href: 'reports.html' },
  ];

  // Dynamic: Add "Users" tab for System Admins and Fleet Managers
  if (user && (user.role === 'ADMIN' || user.role === 'FLEET_MANAGER')) {
    navItems.push({ id: 'users', icon: 'users', label: 'Manage Users', href: '/users' });
  }

  const secondaryItems = [
    { id: 'alerts', icon: 'alerts', label: 'Alerts', href: 'alerts.html' },
    { id: 'settings', icon: 'settings', label: 'Settings', href: 'settings.html' },
  ];

  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const initials = user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
  const displayName = user ? user.name : 'Guest User';
  const roleDisplay = user ? user.role.replace('_', ' ') : 'Unauthorized';

  sidebar.className = `sidebar${isCollapsed ? ' collapsed' : ''}`;
  sidebar.innerHTML = `
    <div class="sidebar-logo">
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
          <span class="nav-icon">${Icons[item.icon] || Icons.dashboard}</span>
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
    <div class="sidebar-bottom" style="display:flex; flex-direction:column; gap: 8px;">
      <div class="sidebar-user" style="width: 100%;">
        <div class="avatar" style="background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; width: 34px; height: 34px; border-radius: 50%; font-size: 13px;">${initials}</div>
        <div style="flex:1;min-width:0; margin-left: 10px;">
          <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${displayName}</div>
          <div style="font-size:11px;color:var(--text-tertiary); text-transform: capitalize;">${roleDisplay.toLowerCase()}</div>
        </div>
      </div>
      <button onclick="handleLogout()" class="nav-item" style="width:100%; border:none; background: rgba(244,63,94,0.08); color:#fb7185; cursor:pointer; padding: 8px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 8px; justify-content: center;">
        <span style="display:inline-block; transform: rotate(180deg);">${Icons.logout || '🚪'}</span>
        <span>Sign Out</span>
      </button>
      <button class="sidebar-collapse-btn" onclick="toggleSidebar()" aria-label="Toggle sidebar" style="margin-top: 4px;">
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
      <button class="btn-primary" onclick="showToast('success', 'Trip Report', 'New trip report form opened')">
        ${Icons.plus}
        <span>New Trip Report</span>
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
    document.documentElement.classList.add('theme-dark');
    document.documentElement.classList.remove('theme-light');
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
  btn.innerHTML = isLight ? Icons.moon : Icons.sun;
}

// ── Toast System ──
function showToast(type, title, message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? Icons.check : (type === 'error' ? Icons.x : Icons.bell);

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div style="flex:1">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;

  container.appendChild(toast);

  // Automatically remove toast after 4s
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.25s forwards';
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}

// ── Global Page Initialization ──
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  // Call sidebar load (requires async fetch user session)
  await renderSidebar();
  injectIcons();
  animateMetrics();
});
