import { el, getConfidenceBadge, formatCurrency, showToast, refreshIcons } from '../utils.js';
import { createDocumentViewer } from '../components/shared.js';
import { state } from '../state.js';

export function renderMakerReview(po, correction, navigate) {
  const activePo = po || state.purchaseOrders.find(p => p.id === 'po-24119') || state.purchaseOrders[0];
  const extracted = activePo?.extracted || {};
  const lineItems = extracted.lineItems || [];
  const makerCorrection = correction || { correctedValue: lineItems[2]?.quantity ?? 1000 };

  const page = el('div', { className: 'page-enter' });
  page.appendChild(el('div', { className: 'page-header' }, [
    el('h1', {}, ['Maker Review']),
    el('p', {}, [`Review and correct extracted fields for ${activePo?.poNumber || 'PO-24119'}`])
  ]));

  const layout = el('div', { className: 'review-layout' });

  const docPanel = el('div', { className: 'review-doc-panel card' });
  docPanel.appendChild(el('h3', { className: 'card-title mb-4' }, ['Original Document']));
  docPanel.appendChild(createDocumentViewer({
    minHeight: 520,
    highlights: [
      { top: 8, left: 10, width: 35, height: 5 },
      { top: 35, left: 5, width: 90, height: 28 },
      { top: 65, left: 60, width: 30, height: 5 }
    ]
  }));
  layout.appendChild(docPanel);

  const formPanel = el('div', { className: 'card review-form-panel' });
  formPanel.innerHTML = '<h3 class="card-title mb-4">Extracted Fields</h3>';

  function addField(label, value, confidence, reason) {
    const group = el('div', { className: 'form-group' });
    group.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <label class="form-label">${label}</label>
        ${getConfidenceBadge(confidence)}
      </div>`;
    group.appendChild(el('input', { className: 'form-input', value: value || '' }));
    if (reason) {
      const reasonEl = el('div', { className: 'ai-reason-panel' });
      reasonEl.innerHTML = `<i data-lucide="sparkles"></i> AI: ${reason}`;
      group.appendChild(reasonEl);
    }
    formPanel.appendChild(group);
  }

  addField('Customer', extracted.customer, 99);
  addField('PO Number', extracted.poNumber, 100);
  addField('Order Date', extracted.orderDate, 98);
  addField('Delivery Date', extracted.deliveryDate, 85, 'Date falls on company holiday — consider July 28');

  const lineItemsGroup = el('div', { className: 'form-group' });
  lineItemsGroup.innerHTML = '<label class="form-label">Line Items</label>';
  const table = el('table', { className: 'line-items-table' });
  table.innerHTML = `<thead><tr><th>SKU</th><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th><th>Conf.</th></tr></thead>`;
  const tbody = el('tbody');
  lineItems.forEach((item, i) => {
    const qty = i === 2 ? makerCorrection.correctedValue : item.quantity;
    const tr = el('tr');
    tr.innerHTML = `
      <td>${item.sku}</td>
      <td>${item.description}</td>
      <td><input class="form-input" style="width:70px" value="${qty}"></td>
      <td>${formatCurrency(item.unitPrice)}</td>
      <td>${formatCurrency(item.unitPrice * qty)}</td>
      <td>${getConfidenceBadge(item.confidence)}</td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  lineItemsGroup.appendChild(table);
  if (lineItems[2]?.confidence < 80) {
    lineItemsGroup.appendChild(el('div', { className: 'ai-reason-panel' }, [
      'AI: SKU partially obscured — possible match SKU-45391. Quantity may need customer confirmation.'
    ]));
  }
  formPanel.appendChild(lineItemsGroup);

  addField('Grand Total', formatCurrency(extracted.grandTotal), 99);
  addField('Notes', extracted.notes, 95);

  const toolbar = el('div', { className: 'approval-toolbar' });
  [
    { label: 'Approve', class: 'btn-success', icon: 'check', action: () => { state.setWorkflowStep('checker-approval'); navigate('checker-approval'); } },
    { label: 'Reject', class: 'btn-danger', icon: 'x', action: () => showToast('PO rejected and returned to sender', 'error') },
    { label: 'Correct', class: 'btn-secondary', icon: 'edit', action: () => showToast('Corrections saved', 'success') },
    { label: 'Save Draft', class: 'btn-secondary', icon: 'save', action: () => showToast('Draft saved', 'info') },
    { label: 'Next Exception', class: 'btn-ghost', icon: 'skip-forward', action: () => showToast('No more exceptions in queue', 'info') }
  ].forEach(btn => {
    toolbar.appendChild(el('button', {
      className: `btn ${btn.class}`,
      onClick: btn.action
    }, [el('span', { innerHTML: `<i data-lucide="${btn.icon}"></i>` }), btn.label]));
  });
  formPanel.appendChild(toolbar);
  layout.appendChild(formPanel);
  page.appendChild(layout);

  refreshIcons(page);
  return page;
}
