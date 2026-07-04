import { state } from './state.js';
import { initRouter } from './router.js';
import { refreshIcons } from './utils.js';

async function loadData() {
  const [dashboard, pos, validation, audit, copilot] = await Promise.all([
    fetch('js/data/dashboard.json').then(r => r.json()),
    fetch('js/data/purchase-orders.json').then(r => r.json()),
    fetch('js/data/validation-rules.json').then(r => r.json()),
    fetch('js/data/audit-events.json').then(r => r.json()),
    fetch('js/data/copilot-responses.json').then(r => r.json())
  ]);

  state.dashboardData = dashboard;
  state.purchaseOrders = pos.purchaseOrders;
  state.makerCorrectionData = pos.makerCorrection;
  state.validationRules = validation.rules;
  state.auditEvents = audit.events;
  state.copilotData = copilot;
}

async function bootstrap() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="app-layout" style="align-items:center;justify-content:center;min-height:100vh">
      <div style="text-align:center">
        <div class="skeleton skeleton-title" style="width:200px;margin:0 auto 16px"></div>
        <div class="skeleton skeleton-text" style="width:300px;margin:0 auto"></div>
        <p style="margin-top:24px;color:var(--color-text-secondary)">Loading PO Ingestion Platform...</p>
      </div>
    </div>`;

  try {
    await loadData();
    initRouter();
  } catch (err) {
    app.innerHTML = `
      <div class="empty-state" style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <h2>Failed to load application</h2>
        <p>Please run a local server: <code>python -m http.server 8080</code></p>
        <p style="color:var(--color-text-muted);margin-top:8px">${err.message}</p>
      </div>`;
  }

  if (window.lucide) lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', bootstrap);
