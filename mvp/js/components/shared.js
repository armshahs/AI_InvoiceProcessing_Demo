import { el, getStatusBadge, getConfidenceBadge, formatDateTime, formatCurrency, animateCountUp, refreshIcons } from '../utils.js';
import { PO_SAMPLE_SVG, PO_DOCUMENT_SRC } from '../assets/po-document.js';

export function createMetricCard(metric, index) {
  const card = el('div', { className: `card metric-card card-animate stagger-${index + 1}` });
  card.innerHTML = `
    <div class="metric-card-header">
      <div>
        <div class="metric-card-label">${metric.label}</div>
        <div class="metric-card-value" data-target="${metric.value}" data-display="${metric.display || ''}">0${metric.suffix || ''}</div>
        <div class="metric-card-trend ${metric.trendUp ? 'trend-up' : 'trend-down'}">
          <i data-lucide="${metric.trendUp ? 'trending-up' : 'trending-down'}"></i>
          ${metric.trend}% vs last week
        </div>
      </div>
      <div class="metric-card-icon ${metric.color}">
        <i data-lucide="${metric.icon}"></i>
      </div>
    </div>`;
  requestAnimationFrame(() => {
    const valEl = card.querySelector('.metric-card-value');
    if (metric.display) {
      valEl.textContent = metric.display;
    } else {
      animateCountUp(valEl, metric.value, 800, metric.suffix || '');
    }
  });
  return card;
}

export function createChartCard(title, canvasId) {
  const card = el('div', { className: 'card chart-card' });
  card.innerHTML = `
    <div class="card-header"><h3 class="card-title">${title}</h3></div>
    <canvas id="${canvasId}"></canvas>`;
  return card;
}

export function createAIInsightCard(insight) {
  const card = el('div', { className: 'card ai-insight-card' });
  card.innerHTML = `
    <div class="flex items-center gap-2 mb-4">
      <span class="ai-badge"><i data-lucide="sparkles"></i> AI Insight</span>
    </div>
    <strong>${insight.title}</strong>
    <p>${insight.description}</p>`;
  return card;
}

export function createDataTable(columns, rows, options = {}) {
  const { onRowClick, selectedId, sortKey, sortDir, onSort } = options;
  const wrapper = el('div', { className: 'data-table-wrapper' });
  const table = el('table', { className: 'data-table' });
  const thead = el('thead');
  const headerRow = el('tr');
  columns.forEach(col => {
    const th = el('th', {
      className: sortKey === col.key ? 'sorted' : '',
      onClick: () => onSort && onSort(col.key)
    });
    th.innerHTML = `${col.label}<span class="sort-icon"><i data-lucide="${sortKey === col.key ? (sortDir === 'asc' ? 'chevron-up' : 'chevron-down') : 'chevrons-up-down'}"></i></span>`;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = el('tbody');
  rows.forEach(row => {
    const tr = el('tr', {
      className: selectedId === row.id ? 'selected' : '',
      onClick: () => onRowClick && onRowClick(row)
    });
    columns.forEach(col => {
      let val = row[col.key];
      if (col.render) val = col.render(val, row);
      else if (col.key === 'status') val = getStatusBadge(val);
      else if (col.key === 'confidence') val = getConfidenceBadge(val);
      else if (col.key === 'received') val = formatDateTime(val);
      const td = el('td');
      if (typeof val === 'string' && val.includes('<')) td.innerHTML = val;
      else td.textContent = val ?? '—';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrapper.appendChild(table);
  return wrapper;
}

export function createPagination(page, totalPages, onPageChange) {
  const container = el('div', { className: 'pagination' });
  container.innerHTML = `<span>Page ${page} of ${totalPages}</span>`;
  const controls = el('div', { className: 'pagination-controls' });
  const prev = el('button', { className: 'pagination-btn', disabled: page <= 1, onClick: () => onPageChange(page - 1) });
  prev.innerHTML = '<i data-lucide="chevron-left"></i>';
  controls.appendChild(prev);
  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    controls.appendChild(el('button', {
      className: `pagination-btn${i === page ? ' active' : ''}`,
      onClick: () => onPageChange(i)
    }, [String(i)]));
  }
  const next = el('button', { className: 'pagination-btn', disabled: page >= totalPages, onClick: () => onPageChange(page + 1) });
  next.innerHTML = '<i data-lucide="chevron-right"></i>';
  controls.appendChild(next);
  container.appendChild(controls);
  return container;
}

export function createFilterPanel(filters, values, onChange) {
  const panel = el('div', { className: 'card filter-panel' });
  panel.innerHTML = '<h3 class="card-title mb-4">Filters</h3>';
  filters.forEach(f => {
    const group = el('div', { className: 'filter-group' });
    const label = el('label', {}, [f.label]);
    group.appendChild(label);
    if (f.type === 'select') {
      const select = el('select', { onChange: e => onChange(f.key, e.target.value) });
      select.appendChild(el('option', { value: '' }, ['All']));
      f.options.forEach(opt => {
        select.appendChild(el('option', { value: opt, selected: values[f.key] === opt }, [opt]));
      });
      group.appendChild(select);
    } else {
      group.appendChild(el('input', {
        type: f.type || 'text',
        value: values[f.key] || '',
        placeholder: f.placeholder || '',
        onInput: e => onChange(f.key, e.target.value)
      }));
    }
    panel.appendChild(group);
  });
  return panel;
}

export function createDocumentViewer(options = {}) {
  const { highlights = [], showScanLine = false, zoom = 1, rotation = 0, minHeight = 400, inline = true } = options;
  const viewer = el('div', { className: 'document-viewer' });
  const toolbar = el('div', { className: 'document-viewer-toolbar' });
  toolbar.innerHTML = `
    <div class="flex gap-2">
      <button class="btn btn-ghost btn-sm" data-action="zoom-out" aria-label="Zoom out"><i data-lucide="zoom-out"></i></button>
      <span data-zoom-label>${Math.round(zoom * 100)}%</span>
      <button class="btn btn-ghost btn-sm" data-action="zoom-in" aria-label="Zoom in"><i data-lucide="zoom-in"></i></button>
      <button class="btn btn-ghost btn-sm" data-action="rotate" aria-label="Rotate"><i data-lucide="rotate-cw"></i></button>
    </div>
    <span class="ai-badge"><i data-lucide="sparkles"></i> Generated by AI</span>`;

  const canvas = el('div', { className: 'document-viewer-canvas' });
  canvas.style.minHeight = `${minHeight}px`;
  const page = el('div', { className: 'document-page', style: `transform: scale(${zoom}) rotate(${rotation}deg)` });

  if (inline) {
    const svgWrap = el('div', { className: 'document-svg-wrap' });
    svgWrap.innerHTML = PO_SAMPLE_SVG;
    page.appendChild(svgWrap);
  } else {
    const img = el('img', {
      src: PO_DOCUMENT_SRC,
      alt: 'Purchase Order Document',
      style: 'width:100%;max-width:100%;height:auto;display:block;'
    });
    page.appendChild(img);
  }
  highlights.forEach(h => {
    page.appendChild(el('div', {
      className: 'field-highlight',
      style: `top:${h.top}%;left:${h.left}%;width:${h.width}%;height:${h.height}%;`
    }));
  });
  if (showScanLine) page.appendChild(el('div', { className: 'scan-line' }));
  canvas.appendChild(page);
  viewer.append(toolbar, canvas);

  let currentZoom = zoom;
  let currentRotation = rotation;
  toolbar.querySelector('[data-action="zoom-in"]').addEventListener('click', () => {
    currentZoom = Math.min(currentZoom + 0.1, 2);
    page.style.transform = `scale(${currentZoom}) rotate(${currentRotation}deg)`;
    toolbar.querySelector('[data-zoom-label]').textContent = `${Math.round(currentZoom * 100)}%`;
  });
  toolbar.querySelector('[data-action="zoom-out"]').addEventListener('click', () => {
    currentZoom = Math.max(currentZoom - 0.1, 0.5);
    page.style.transform = `scale(${currentZoom}) rotate(${currentRotation}deg)`;
    toolbar.querySelector('[data-zoom-label]').textContent = `${Math.round(currentZoom * 100)}%`;
  });
  toolbar.querySelector('[data-action="rotate"]').addEventListener('click', () => {
    currentRotation = (currentRotation + 90) % 360;
    page.style.transform = `scale(${currentZoom}) rotate(${currentRotation}deg)`;
  });

  return viewer;
}

export function createProcessingTimeline(steps, activeIndex) {
  const timeline = el('div', { className: 'timeline' });
  steps.forEach((step, i) => {
    let status = 'pending';
    if (i < activeIndex) status = 'completed';
    else if (i === activeIndex) status = 'active';
    const item = el('div', { className: `timeline-item ${status}` });
    item.innerHTML = `
      <div class="timeline-dot">${status === 'completed' ? '<i data-lucide="check" style="width:12px;height:12px"></i>' : ''}</div>
      <div class="timeline-title">${step.title}</div>
      <div class="timeline-desc">${step.desc || ''}</div>`;
    timeline.appendChild(item);
  });
  return timeline;
}

export function createValidationCard(rule) {
  const card = el('div', { className: `card validation-card ${rule.status}` });
  const icons = { passed: 'check-circle', warning: 'alert-triangle', failed: 'x-circle' };
  card.innerHTML = `
    <div class="validation-card-icon"><i data-lucide="${icons[rule.status]}"></i></div>
    <div class="validation-card-content">
      <div class="validation-card-title">${rule.name}</div>
      <div class="validation-card-desc">${rule.description}</div>
      ${rule.suggestion ? `<div class="validation-card-suggestion"><i data-lucide="sparkles"></i> ${rule.suggestion}</div>` : ''}
      <div class="mt-4">${getConfidenceBadge(rule.confidence)}</div>
    </div>`;
  return card;
}

export function createCopilotWidget(copilotData, getContext) {
  let isOpen = false;
  const fab = el('button', { className: 'copilot-fab', 'aria-label': 'Open AI Copilot' });
  fab.innerHTML = '<i data-lucide="message-circle"></i>';
  let panel = null;

  function toggle() {
    isOpen = !isOpen;
    if (isOpen) {
      panel = buildPanel();
      document.body.appendChild(panel);
    } else if (panel) {
      panel.remove();
      panel = null;
    }
    refreshIcons(document.body);
  }

  function buildPanel() {
    const p = el('div', { className: 'copilot-panel', role: 'dialog', 'aria-label': 'AI Copilot' });
    p.innerHTML = `
      <div class="copilot-header">
        <div class="flex items-center gap-2">
          <i data-lucide="sparkles"></i>
          <strong>AI Copilot</strong>
        </div>
        <button class="modal-close" data-close><i data-lucide="x"></i></button>
      </div>`;
    const messages = el('div', { className: 'copilot-messages' });
    messages.appendChild(el('div', { className: 'copilot-message ai' }, [
      'Hi! I\'m your AI Copilot. I can help explain validation results, summarize POs, and suggest corrections. What would you like to know?'
    ]));
    p.appendChild(messages);

    const prompts = el('div', { className: 'copilot-prompts' });
    copilotData.prompts.forEach(prompt => {
      prompts.appendChild(el('button', {
        className: 'copilot-prompt-btn',
        onClick: () => sendMessage(prompt, messages)
      }, [prompt]));
    });
    p.appendChild(prompts);

    const inputArea = el('div', { className: 'copilot-input-area' });
    const input = el('input', { type: 'text', placeholder: 'Ask anything about this PO...' });
    const sendBtn = el('button', { className: 'btn btn-primary btn-sm' });
    sendBtn.innerHTML = '<i data-lucide="send"></i>';
    sendBtn.addEventListener('click', () => { if (input.value.trim()) { sendMessage(input.value, messages); input.value = ''; } });
    input.addEventListener('keydown', e => { if (e.key === 'Enter' && input.value.trim()) { sendMessage(input.value, messages); input.value = ''; } });
    inputArea.append(input, sendBtn);
    p.appendChild(inputArea);

    p.querySelector('[data-close]').addEventListener('click', toggle);
    return p;
  }

  function sendMessage(text, messagesEl) {
    messagesEl.appendChild(el('div', { className: 'copilot-message user' }, [text]));
    const keyMap = {
      'Why is this flagged?': 'why-flagged',
      'Summarize this PO': 'summarize',
      'Show validation errors': 'validation-errors',
      'Explain confidence score': 'confidence',
      'Suggest corrections': 'suggest-corrections',
      'Find duplicate orders': 'duplicates',
      'Generate ERP payload summary': 'erp-summary'
    };
    const responseKey = keyMap[text] || 'default';
    const response = copilotData.responses[responseKey] || copilotData.responses.default;
    setTimeout(() => {
      const msg = el('div', { className: 'copilot-message ai' });
      msg.innerHTML = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
      messagesEl.appendChild(msg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 600);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  fab.addEventListener('click', toggle);
  return fab;
}

export function createAuditTimeline(events) {
  const timeline = el('div', { className: 'timeline' });
  events.forEach(evt => {
    const item = el('div', { className: 'timeline-item completed' });
    item.innerHTML = `
      <div class="timeline-dot"><i data-lucide="check" style="width:12px;height:12px"></i></div>
      <div class="timeline-time">${evt.time}</div>
      <div class="timeline-title">${evt.title}</div>
      <div class="timeline-desc">${evt.description}</div>`;
    timeline.appendChild(item);
  });
  return timeline;
}

export function createAuditEventCard(event) {
  const card = el('div', { className: 'card' });
  card.innerHTML = `
    <h3 class="card-title mb-4">${event.title}</h3>
    <dl class="audit-event-detail">
      <dt>User</dt><dd>${event.user}</dd>
      <dt>Timestamp</dt><dd>${event.timestamp}</dd>
      <dt>Changes</dt><dd>${event.changes}</dd>
      <dt>Reason</dt><dd>${event.reason}</dd>
      <dt>Previous Value</dt><dd>${event.previousValue || '—'}</dd>
      <dt>New Value</dt><dd>${event.newValue || '—'}</dd>
      <dt>AI Confidence</dt><dd>${event.confidence != null ? event.confidence + '%' : '—'}</dd>
    </dl>`;
  return card;
}

export { formatCurrency };
