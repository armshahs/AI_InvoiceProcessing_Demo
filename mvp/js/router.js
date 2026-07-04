import { state } from './state.js';
import { refreshIcons } from './utils.js';
import { renderAppShell } from './components/layout.js';
import { createCopilotWidget } from './components/shared.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderInbox } from './pages/inbox.js';
import { renderAIProcessing } from './pages/ai-processing.js';
import { renderValidation } from './pages/validation.js';
import { renderMakerReview } from './pages/maker-review.js';
import { renderCheckerApproval } from './pages/checker-approval.js';
import { renderERPExport } from './pages/erp-export.js';
import { renderAuditTrail } from './pages/audit-trail.js';
import { renderSettings } from './pages/settings.js';

const routes = {
  dashboard: () => renderDashboard(state.dashboardData, state.purchaseOrders, navigate),
  inbox: () => renderInbox(state.purchaseOrders, navigate),
  'ai-processing': () => renderAIProcessing(navigate),
  validation: () => renderValidation(state.validationRules, navigate),
  'maker-review': () => renderMakerReview(state.getSelectedPO(), state.makerCorrectionData, navigate),
  'checker-approval': () => renderCheckerApproval(state.makerCorrectionData, navigate),
  'erp-export': () => renderERPExport(state.getSelectedPO(), navigate),
  'audit-trail': () => renderAuditTrail(state.auditEvents),
  settings: () => renderSettings()
};

let currentRoute = 'dashboard';
let copilotFab = null;

function navigate(route) {
  if (!routes[route]) route = 'dashboard';
  currentRoute = route;
  state.setWorkflowStep(route);
  window.location.hash = `#/${route}`;
  render();
}

function getRouteFromHash() {
  const hash = window.location.hash.replace('#/', '') || 'dashboard';
  return routes[hash] ? hash : 'dashboard';
}

function toggleSidebar() {
  state.sidebarCollapsed = !state.sidebarCollapsed;
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('app-main');
  if (sidebar) sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
  if (sidebar) sidebar.classList.toggle('open', !state.sidebarCollapsed);
  if (main) main.classList.toggle('sidebar-collapsed', state.sidebarCollapsed);
}

function render() {
  currentRoute = getRouteFromHash();
  const pageRenderer = routes[currentRoute] || routes.dashboard;
  const content = pageRenderer();

  const app = document.getElementById('app');
  app.innerHTML = '';

  const shell = renderAppShell(currentRoute, content, navigate, toggleSidebar);
  app.appendChild(shell);

  if (!copilotFab) {
    copilotFab = createCopilotWidget(state.copilotData);
  }
  app.appendChild(copilotFab);

  refreshIcons(app);
}

export function initRouter() {
  window.addEventListener('hashchange', () => render());
  navigate(getRouteFromHash());
}

export { navigate };
