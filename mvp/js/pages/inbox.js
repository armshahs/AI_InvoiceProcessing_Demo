import { el, getConfidenceBadge, formatDateTime, refreshIcons } from '../utils.js';
import { createDataTable, createFilterPanel, createPagination } from '../components/shared.js';
import { PO_SAMPLE_SVG } from '../assets/po-document.js';
import { state } from '../state.js';

export function renderInbox(pos, navigate) {
  let filtered = [...pos];
  let selectedId = state.selectedPoId;
  let sortKey = 'received';
  let sortDir = 'desc';
  let page = 1;
  const pageSize = 8;
  const filters = {
    customer: '', status: '', date: '', source: '', priority: '', assignedUser: ''
  };

  const container = el('div', { className: 'page-enter' });
  container.appendChild(el('div', { className: 'page-header' }, [
    el('h1', {}, ['Purchase Order Inbox']),
    el('p', {}, ['All incoming purchase orders'])
  ]));

  const layout = el('div', { className: 'inbox-layout' });

  function applyFilters() {
    filtered = pos.filter(po => {
      if (filters.customer && po.customer !== filters.customer) return false;
      if (filters.status && po.status !== filters.status) return false;
      if (filters.source && po.source !== filters.source) return false;
      if (filters.priority && po.priority !== filters.priority) return false;
      if (filters.assignedUser && po.assignedTo !== filters.assignedUser) return false;
      return true;
    });
    filtered.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === 'received') { av = new Date(av); bv = new Date(bv); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    page = 1;
    renderTable();
    renderPreview();
  }

  const filterPanel = createFilterPanel([
    { key: 'customer', label: 'Customer', type: 'select', options: [...new Set(pos.map(p => p.customer))] },
    { key: 'status', label: 'Status', type: 'select', options: ['received', 'processing', 'validation', 'maker', 'checker', 'completed', 'rejected'] },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'source', label: 'Source', type: 'select', options: ['Email', 'Portal', 'EDI'] },
    { key: 'priority', label: 'Priority', type: 'select', options: ['high', 'normal', 'low'] },
    { key: 'assignedUser', label: 'Assigned User', type: 'select', options: [...new Set(pos.map(p => p.assignedTo))] }
  ], filters, (key, val) => { filters[key] = val; applyFilters(); });
  layout.appendChild(filterPanel);

  const tableArea = el('div');
  layout.appendChild(tableArea);

  const previewPanel = el('div', { className: 'card inbox-preview' });
  layout.appendChild(previewPanel);

  function renderPreview() {
    previewPanel.innerHTML = '';
    const po = pos.find(p => p.id === selectedId);
    if (!po) {
      previewPanel.innerHTML = '<div class="empty-state"><p>Select a PO to preview</p></div>';
      return;
    }
    previewPanel.innerHTML = `
      <h3 class="card-title mb-4">${po.poNumber}</h3>
      <div class="inbox-preview-doc document-svg-wrap">
        ${PO_SAMPLE_SVG}
      </div>
      <dl class="inbox-preview-meta">
        <dt>Customer</dt><dd>${po.customer}</dd>
        <dt>Source</dt><dd>${po.source}</dd>
        <dt>Pages</dt><dd>${po.pages}</dd>
        <dt>Status</dt><dd>${po.status}</dd>
        <dt>Confidence</dt><dd>${getConfidenceBadge(po.confidence)}</dd>
        <dt>Assigned To</dt><dd>${po.assignedTo}</dd>
      </dl>`;
    const btn = el('button', {
      className: 'btn btn-primary mt-4',
      style: 'width:100%',
      onClick: () => {
        state.setSelectedPO(po.id);
        state.setWorkflowStep('ai-processing');
        navigate('ai-processing');
      }
    }, [el('span', { innerHTML: '<i data-lucide="brain"></i>' }), 'Start AI Processing']);
    previewPanel.appendChild(btn);
    refreshIcons(previewPanel);
  }

  function renderTable() {
    tableArea.innerHTML = '';
    const start = (page - 1) * pageSize;
    const pageRows = filtered.slice(start, start + pageSize);
    const tableCard = el('div', { className: 'card' });
    tableCard.appendChild(createDataTable([
      { key: 'received', label: 'Received' },
      { key: 'customer', label: 'Customer' },
      { key: 'poNumber', label: 'PO Number' },
      { key: 'source', label: 'Source' },
      { key: 'pages', label: 'Pages' },
      { key: 'status', label: 'Status' },
      { key: 'confidence', label: 'Confidence' },
      { key: 'assignedTo', label: 'Assigned To' }
    ], pageRows, {
      selectedId,
      sortKey,
      sortDir,
      onSort: key => { sortDir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc'; sortKey = key; applyFilters(); },
      onRowClick: row => { selectedId = row.id; state.setSelectedPO(row.id); renderTable(); renderPreview(); }
    }));
    tableCard.appendChild(createPagination(page, Math.ceil(filtered.length / pageSize) || 1, p => { page = p; renderTable(); }));
    tableArea.appendChild(tableCard);
    refreshIcons(tableArea);
  }

  container.appendChild(layout);
  renderTable();
  renderPreview();
  return container;
}
