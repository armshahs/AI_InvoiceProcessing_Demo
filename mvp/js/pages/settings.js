import { el, showToast, refreshIcons } from '../utils.js';

export function renderSettings() {
  const page = el('div', { className: 'page-enter' });
  page.appendChild(el('div', { className: 'page-header' }, [
    el('h1', {}, ['Settings']),
    el('p', {}, ['Configure platform preferences'])
  ]));

  const card = el('div', { className: 'card' });
  card.innerHTML = `
    <h3 class="card-title mb-4">General Settings</h3>
    <div class="form-group">
      <label class="form-label">Default Assignee</label>
      <select class="form-input"><option>Sarah Chen</option><option>Mike Johnson</option><option>Lisa Park</option></select>
    </div>
    <div class="form-group">
      <label class="form-label">Auto-process on receipt</label>
      <select class="form-input"><option selected>Enabled</option><option>Disabled</option></select>
    </div>
    <div class="form-group">
      <label class="form-label">Confidence threshold for auto-approval</label>
      <input class="form-input" type="number" value="95">
    </div>
    <div class="form-group">
      <label class="form-label">ERP Connection</label>
      <input class="form-input" value="SAP S/4HANA — Production" readonly>
    </div>`;

  card.appendChild(el('button', {
    className: 'btn btn-primary mt-4',
    onClick: () => showToast('Settings saved', 'success')
  }, ['Save Settings']));
  page.appendChild(card);
  refreshIcons(page);
  return page;
}
