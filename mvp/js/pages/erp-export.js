import { el, showToast, showModal, refreshIcons } from '../utils.js';
import { state } from '../state.js';

const PIPELINE_STEPS = [
  { id: 'validated', label: 'Validated', icon: 'shield-check' },
  { id: 'transform', label: 'Transform', icon: 'cog' },
  { id: 'payload', label: 'ERP Payload', icon: 'file-json' },
  { id: 'complete', label: 'Export Complete', icon: 'check-circle' }
];

function getERPPayload(po) {
  const ext = po?.extracted || {};
  return {
    orderType: 'ZPO',
    customerId: '1000234',
    customerName: ext.customer || 'Nestle USA Inc.',
    poReference: ext.poNumber || 'PO-24119',
    orderDate: ext.orderDate,
    deliveryDate: '2026-07-28',
    currency: ext.currency || 'USD',
    lineItems: (ext.lineItems || []).map((item, i) => ({
      lineNumber: i + 1,
      materialNumber: item.sku,
      description: item.description,
      quantity: i === 2 ? 1000 : item.quantity,
      unitPrice: item.unitPrice,
      netAmount: item.unitPrice * (i === 2 ? 1000 : item.quantity)
    })),
    netValue: 43880.00,
    taxAmount: 3510.40,
    totalAmount: 47390.40,
    sapOrderNumber: '4500127890'
  };
}

export function renderERPExport(po, navigate) {
  let activeStep = 0;
  let animationDone = false;

  const page = el('div', { className: 'page-enter' });
  page.appendChild(el('div', { className: 'page-header' }, [
    el('h1', {}, ['ERP Export']),
    el('p', {}, ['Finalize workflow and generate ERP-ready output'])
  ]));

  const pipeline = el('div', { className: 'card export-pipeline' });
  const payload = getERPPayload(po);

  function renderPipeline() {
    pipeline.innerHTML = '';
    PIPELINE_STEPS.forEach((step, i) => {
      if (i > 0) pipeline.appendChild(el('span', { className: 'pipeline-arrow', innerHTML: '<i data-lucide="arrow-right"></i>' }));
      const stepEl = el('div', { className: `pipeline-step${i < activeStep ? ' completed' : ''}${i === activeStep ? ' active' : ''}` });
      stepEl.innerHTML = `
        <div class="pipeline-step-icon"><i data-lucide="${step.icon}"></i></div>
        <span>${step.label}</span>`;
      pipeline.appendChild(stepEl);
    });
    refreshIcons(pipeline);
  }

  renderPipeline();
  page.appendChild(pipeline);

  const payloadCard = el('div', { className: 'card' });
  payloadCard.innerHTML = '<h3 class="card-title mb-4">ERP Payload Preview</h3>';
  const payloadEl = el('pre', { className: 'erp-payload' });
  payloadEl.textContent = JSON.stringify(payload, null, 2);
  payloadCard.appendChild(payloadEl);

  const actions = el('div', { className: 'export-actions' });
  actions.appendChild(el('button', {
    className: 'btn btn-primary btn-lg',
    onClick: async () => {
      if (!animationDone) {
        showToast('Please wait for pipeline animation to complete', 'info');
        return;
      }
      await showModal('Export Successful', `
        <div class="flex flex-col gap-4" style="text-align:center;padding:20px">
          <div style="width:64px;height:64px;background:var(--color-success-light);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto">
            <i data-lucide="check-circle" style="width:32px;height:32px;color:var(--color-success)"></i>
          </div>
          <h3>ERP Updated Successfully</h3>
          <p style="color:var(--color-text-secondary)">SAP Order #4500127890 created. Document archived to DMS-2026-78432.</p>
        </div>`, [
        { label: 'View Audit Trail', class: 'btn-primary', value: 'audit' },
        { label: 'Close', class: 'btn-secondary', value: 'close' }
      ]).then(val => { if (val === 'audit') navigate('audit-trail'); });
      refreshIcons(document.body);
    }
  }, [el('span', { innerHTML: '<i data-lucide="upload-cloud"></i>' }), 'Push to ERP']));

  [
    { label: 'Export CSV', icon: 'file-spreadsheet' },
    { label: 'Export Excel', icon: 'file-spreadsheet' },
    { label: 'Download JSON', icon: 'download' },
    { label: 'View API Payload', icon: 'code' }
  ].forEach(a => {
    actions.appendChild(el('button', {
      className: 'btn btn-secondary',
      onClick: () => {
        if (a.label === 'View API Payload') {
          showModal('API Payload', `<pre class="erp-payload">${JSON.stringify(payload, null, 2)}</pre>`, [
            { label: 'Close', class: 'btn-secondary', value: 'close' }
          ]);
        } else {
          showToast(`${a.label} downloaded`, 'success');
        }
      }
    }, [el('span', { innerHTML: `<i data-lucide="${a.icon}"></i>` }), a.label]));
  });
  payloadCard.appendChild(actions);
  page.appendChild(payloadCard);

  const animInterval = setInterval(() => {
    if (activeStep >= PIPELINE_STEPS.length - 1) {
      clearInterval(animInterval);
      animationDone = true;
      return;
    }
    activeStep++;
    renderPipeline();
  }, 1200);

  refreshIcons(page);
  return page;
}
