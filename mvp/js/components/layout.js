import { el, refreshIcons } from '../utils.js';

const NAV_ITEMS = [
  { route: 'overview', label: 'Overview', icon: 'map' },
  { route: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { route: 'inbox', label: 'Inbox', icon: 'inbox' },
  { route: 'ai-processing', label: 'AI Processing', icon: 'brain' },
  { route: 'validation', label: 'Validation', icon: 'shield-check' },
  { route: 'maker-review', label: 'Maker Review', icon: 'edit-3' },
  { route: 'checker-approval', label: 'Checker Review', icon: 'user-check' },
  { route: 'erp-export', label: 'ERP Export', icon: 'database' },
  { route: 'audit-trail', label: 'Audit Trail', icon: 'clock' },
  { route: 'settings', label: 'Settings', icon: 'settings' }
];

const BREADCRUMBS = {
  overview: ['Overview'],
  dashboard: ['Overview', 'Dashboard'],
  inbox: ['Overview', 'Dashboard', 'Inbox'],
  'ai-processing': ['Overview', 'Dashboard', 'Inbox', 'AI Processing'],
  validation: ['Overview', 'Dashboard', 'Inbox', 'AI Processing', 'Validation'],
  'maker-review': ['Overview', 'Dashboard', 'Inbox', 'Validation', 'Maker Review'],
  'checker-approval': ['Overview', 'Dashboard', 'Inbox', 'Maker Review', 'Checker Approval'],
  'erp-export': ['Overview', 'Dashboard', 'Inbox', 'Checker Approval', 'ERP Export'],
  'audit-trail': ['Overview', 'Dashboard', 'Audit Trail'],
  settings: ['Overview', 'Dashboard', 'Settings']
};

export function renderSidebar(activeRoute, onNavigate) {
  const nav = el('nav', { className: 'sidebar-nav', 'aria-label': 'Main navigation' });
  NAV_ITEMS.forEach(item => {
    const link = el('a', {
      className: `sidebar-nav-item${activeRoute === item.route ? ' active' : ''}`,
      href: `#/${item.route}`,
      onClick: e => { e.preventDefault(); onNavigate(item.route); }
    }, [
      el('span', { innerHTML: `<i data-lucide="${item.icon}"></i>` }),
      item.label
    ]);
    nav.appendChild(link);
  });
  return nav;
}

export function renderHeader(activeRoute, onToggleSidebar) {
  const crumbs = BREADCRUMBS[activeRoute] || ['Dashboard'];
  const breadcrumbEl = el('nav', { className: 'breadcrumb', 'aria-label': 'Breadcrumb' });
  crumbs.forEach((c, i) => {
    if (i > 0) breadcrumbEl.appendChild(el('span', { className: 'breadcrumb-sep' }, ['/']));
    breadcrumbEl.appendChild(el('span', {
      className: `breadcrumb-item${i === crumbs.length - 1 ? ' active' : ''}`
    }, [c]));
  });

  return el('header', { className: 'app-header' }, [
    el('div', { className: 'header-left' }, [
      el('button', { className: 'header-menu-btn', 'aria-label': 'Toggle menu', onClick: onToggleSidebar }, [
        el('span', { innerHTML: '<i data-lucide="menu"></i>' })
      ]),
      breadcrumbEl
    ]),
    el('div', { className: 'header-right' }, [
      el('div', { className: 'header-search' }, [
        el('span', { className: 'header-search-icon', innerHTML: '<i data-lucide="search"></i>' }),
        el('input', { type: 'search', placeholder: 'Search POs, customers...', 'aria-label': 'Search' })
      ]),
      el('button', { className: 'header-icon-btn', 'aria-label': 'Notifications' }, [
        el('span', { innerHTML: '<i data-lucide="bell"></i>' }),
        el('span', { className: 'notification-dot' })
      ]),
      el('div', { className: 'header-profile' }, [
        el('div', { className: 'header-avatar' }, ['SC']),
        el('div', { className: 'header-profile-info' }, [
          el('div', { className: 'header-profile-name' }, ['Sarah Chen']),
          el('div', { className: 'header-profile-role' }, ['Operations Manager'])
        ])
      ])
    ])
  ]);
}

export function renderAppShell(activeRoute, contentEl, onNavigate, onToggleSidebar) {
  const sidebar = el('aside', { className: 'app-sidebar', id: 'sidebar' }, [
    el('div', { className: 'sidebar-logo' }, [
      el('div', { className: 'sidebar-logo-icon' }, [el('span', { innerHTML: '<i data-lucide="sparkles"></i>' })]),
      el('div', { className: 'sidebar-logo-text' }, ['PO Ingestion', el('span', {}, ['AI Platform'])])
    ]),
    renderSidebar(activeRoute, onNavigate)
  ]);

  const main = el('main', { className: 'app-main', id: 'app-main' }, [
    renderHeader(activeRoute, onToggleSidebar),
    el('div', { className: 'app-content', id: 'app-content' })
  ]);

  main.querySelector('#app-content').appendChild(contentEl);
  return el('div', { className: 'app-layout' }, [sidebar, main]);
}

export { NAV_ITEMS, BREADCRUMBS };
