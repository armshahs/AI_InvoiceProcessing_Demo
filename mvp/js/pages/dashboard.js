import { el, showToast, getStatusBadge } from '../utils.js';
import { createMetricCard, createChartCard, createAIInsightCard, createDataTable } from '../components/shared.js';

let chartInstances = [];

export function renderDashboard(data, pos, navigate) {
  chartInstances.forEach(c => c.destroy());
  chartInstances = [];

  const page = el('div', { className: 'page-enter' });
  page.appendChild(el('div', { className: 'page-header' }, [
    el('h1', {}, ['Dashboard']),
    el('p', {}, ['Real-time overview of purchase order processing'])
  ]));

  const metricsGrid = el('div', { className: 'grid grid-4 dashboard-metrics' });
  data.metrics.forEach((m, i) => metricsGrid.appendChild(createMetricCard(m, i)));
  page.appendChild(metricsGrid);

  const chartsGrid = el('div', { className: 'dashboard-charts' });
  const chartConfigs = [
    { title: 'PO Volume', id: 'chart-volume', type: 'line' },
    { title: 'Automation %', id: 'chart-automation', type: 'line' },
    { title: 'Validation Errors', id: 'chart-errors', type: 'bar' },
    { title: 'Customer Distribution', id: 'chart-customers', type: 'doughnut' },
    { title: 'Processing Time', id: 'chart-time', type: 'bar' }
  ];
  chartConfigs.forEach(c => chartsGrid.appendChild(createChartCard(c.title, c.id)));
  page.appendChild(chartsGrid);

  const bottom = el('div', { className: 'dashboard-bottom' });
  const activityCard = el('div', { className: 'card' });
  activityCard.innerHTML = '<div class="card-header"><h3 class="card-title">Recent Activity</h3></div>';
  const activityRows = pos.slice(0, 10).map(po => ({
    ...po,
    currentStep: po.status,
    assignedUser: po.assignedTo
  }));
  activityCard.appendChild(createDataTable([
    { key: 'poNumber', label: 'PO Number' },
    { key: 'customer', label: 'Customer' },
    { key: 'status', label: 'Status' },
    { key: 'currentStep', label: 'Current Step', render: v => getStatusBadge(v) },
    { key: 'assignedUser', label: 'Assigned User' }
  ], activityRows, { onRowClick: row => { navigate('inbox'); } }));
  bottom.appendChild(activityCard);

  const rightCol = el('div', { className: 'flex flex-col gap-6' });
  const actionsCard = el('div', { className: 'card' });
  actionsCard.innerHTML = '<h3 class="card-title mb-4">Quick Actions</h3>';
  const actions = el('div', { className: 'quick-actions' });
  [
    { label: 'Upload PO', icon: 'upload', action: () => showToast('PO upload simulated — file received', 'success') },
    { label: 'Open Inbox', icon: 'inbox', action: () => navigate('inbox'), primary: true },
    { label: 'Review Queue', icon: 'list-checks', action: () => navigate('maker-review') },
    { label: 'Export Reports', icon: 'download', action: () => showToast('Report export started', 'info') },
    { label: 'Settings', icon: 'settings', action: () => showToast('Settings coming soon', 'info') }
  ].forEach(a => {
    actions.appendChild(el('button', {
      className: `btn ${a.primary ? 'btn-primary' : 'btn-secondary'}`,
      onClick: a.action
    }, [el('span', { innerHTML: `<i data-lucide="${a.icon}"></i>` }), a.label]));
  });
  actionsCard.appendChild(actions);
  rightCol.appendChild(actionsCard);

  const insightsCard = el('div', { className: 'card' });
  insightsCard.innerHTML = '<h3 class="card-title mb-4">AI Insights</h3>';
  data.insights.forEach(insight => insightsCard.appendChild(createAIInsightCard(insight)));
  rightCol.appendChild(insightsCard);
  bottom.appendChild(rightCol);
  page.appendChild(bottom);

  requestAnimationFrame(() => initCharts(data));
  return page;
}

function initCharts(data) {
  if (!window.Chart) return;
  const colors = { primary: '#2563EB', success: '#16A34A', warning: '#F59E0B', palette: ['#2563EB', '#16A34A', '#F59E0B', '#9333EA', '#0EA5E9', '#64748B'] };
  const common = { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } } };

  chartInstances.push(new Chart(document.getElementById('chart-volume'), {
    type: 'line',
    data: { labels: data.charts.poVolume.labels, datasets: [{ data: data.charts.poVolume.data, borderColor: colors.primary, backgroundColor: 'rgba(37,99,235,0.1)', fill: true, tension: 0.4 }] },
    options: { ...common, scales: { y: { beginAtZero: true, grid: { color: '#F1F5F9' } }, x: { grid: { display: false } } } }
  }));

  chartInstances.push(new Chart(document.getElementById('chart-automation'), {
    type: 'line',
    data: { labels: data.charts.automation.labels, datasets: [{ data: data.charts.automation.data, borderColor: colors.success, backgroundColor: 'rgba(22,163,74,0.1)', fill: true, tension: 0.4 }] },
    options: { ...common, scales: { y: { min: 80, max: 100, grid: { color: '#F1F5F9' } }, x: { grid: { display: false } } } }
  }));

  chartInstances.push(new Chart(document.getElementById('chart-errors'), {
    type: 'bar',
    data: { labels: data.charts.validationErrors.labels, datasets: [{ data: data.charts.validationErrors.data, backgroundColor: colors.warning, borderRadius: 6 }] },
    options: { ...common, scales: { y: { beginAtZero: true, grid: { color: '#F1F5F9' } }, x: { grid: { display: false } } } }
  }));

  chartInstances.push(new Chart(document.getElementById('chart-customers'), {
    type: 'doughnut',
    data: { labels: data.charts.customerDistribution.labels, datasets: [{ data: data.charts.customerDistribution.data, backgroundColor: colors.palette, borderWidth: 0 }] },
    options: { responsive: true, plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } } } }
  }));

  chartInstances.push(new Chart(document.getElementById('chart-time'), {
    type: 'bar',
    data: { labels: data.charts.processingTime.labels, datasets: [{ data: data.charts.processingTime.data, backgroundColor: colors.primary, borderRadius: 6 }] },
    options: { ...common, indexAxis: 'y', scales: { x: { beginAtZero: true, grid: { color: '#F1F5F9' } }, y: { grid: { display: false } } } }
  }));
}
