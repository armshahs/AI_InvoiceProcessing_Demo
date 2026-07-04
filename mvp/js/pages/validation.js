import { el, refreshIcons } from '../utils.js';
import { createValidationCard } from '../components/shared.js';
import { state } from '../state.js';

export function renderValidation(rules, navigate) {
  const passed = rules.filter(r => r.status === 'passed').length;
  const warnings = rules.filter(r => r.status === 'warning').length;
  const failed = rules.filter(r => r.status === 'failed').length;

  const page = el('div', { className: 'page-enter' });
  page.appendChild(el('div', { className: 'page-header' }, [
    el('h1', {}, ['Business Validation']),
    el('p', {}, [`Validating extracted data for ${state.getSelectedPO()?.poNumber || 'PO-24119'}`])
  ]));

  const summary = el('div', { className: 'card validation-summary' });
  summary.innerHTML = `
    <div class="validation-summary-item"><span class="badge badge-success">Passed</span><span class="validation-summary-count">${passed}</span></div>
    <div class="validation-summary-item"><span class="badge badge-warning">Warnings</span><span class="validation-summary-count">${warnings}</span></div>
    <div class="validation-summary-item"><span class="badge badge-danger">Failed</span><span class="validation-summary-count">${failed}</span></div>`;
  page.appendChild(summary);

  const grid = el('div', { className: 'validation-grid' });
  rules.forEach(rule => grid.appendChild(createValidationCard(rule)));
  page.appendChild(grid);

  const actions = el('div', { className: 'flex gap-3 mt-6' });
  actions.appendChild(el('button', {
    className: 'btn btn-primary btn-lg',
    onClick: () => { state.setWorkflowStep('maker-review'); navigate('maker-review'); }
  }, [el('span', { innerHTML: '<i data-lucide="arrow-right"></i>' }), 'Continue to Maker Review']));
  page.appendChild(actions);

  refreshIcons(page);
  return page;
}
