const STATUS_MAP = {
  received: { label: 'Received', class: 'badge-received' },
  processing: { label: 'AI Processing', class: 'badge-processing' },
  validation: { label: 'Validation', class: 'badge-validation' },
  maker: { label: 'Maker Review', class: 'badge-maker' },
  checker: { label: 'Checker Review', class: 'badge-checker' },
  completed: { label: 'Completed', class: 'badge-completed' },
  rejected: { label: 'Rejected', class: 'badge-rejected' },
  exported: { label: 'ERP Exported', class: 'badge-exported' }
};

export function getStatusBadge(status) {
  const s = STATUS_MAP[status] || STATUS_MAP.received;
  return `<span class="badge ${s.class}">${s.label}</span>`;
}

export function getConfidenceBadge(value) {
  if (value == null) return '<span class="confidence-badge confidence-medium">—</span>';
  let cls = 'confidence-high';
  if (value < 80) cls = 'confidence-low';
  else if (value < 95) cls = 'confidence-medium';
  return `<span class="confidence-badge ${cls}">${value}%</span>`;
}

export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'className') node.className = v;
    else if (k === 'innerHTML') node.innerHTML = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else node.setAttribute(k, v);
  }
  for (const child of children) {
    if (child == null) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

export function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = el('div', { className: 'toast-container' });
    document.body.appendChild(container);
  }
  const icons = { success: 'check-circle', error: 'x-circle', info: 'info' };
  const toast = el('div', { className: `toast toast-${type}` }, [
    el('span', { innerHTML: `<i data-lucide="${icons[type] || 'info'}"></i>` }),
    el('span', {}, [message])
  ]);
  container.appendChild(toast);
  if (window.lucide) lucide.createIcons({ nodes: [toast] });
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 4000);
}

export function showModal(title, bodyHTML, footerButtons = []) {
  return new Promise(resolve => {
    const overlay = el('div', { className: 'modal-overlay', onClick: e => { if (e.target === overlay) close(null); } });
    const modal = el('div', { className: 'modal', role: 'dialog', 'aria-modal': 'true' });
    const header = el('div', { className: 'modal-header' }, [
      el('h3', {}, [title]),
      el('button', { className: 'modal-close', 'aria-label': 'Close', onClick: () => close(null) }, [
        el('span', { innerHTML: '<i data-lucide="x"></i>' })
      ])
    ]);
    const body = el('div', { className: 'modal-body', innerHTML: bodyHTML });
    const footer = el('div', { className: 'modal-footer' });
    footerButtons.forEach(btn => {
      footer.appendChild(el('button', {
        className: `btn ${btn.class || 'btn-secondary'}`,
        onClick: () => close(btn.value)
      }, [btn.label]));
    });
    modal.append(header, body, footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    if (window.lucide) lucide.createIcons({ nodes: [overlay] });

    function close(val) {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
      resolve(val);
    }
    function onKey(e) { if (e.key === 'Escape') close(null); }
    document.addEventListener('keydown', onKey);
  });
}

export function animateCountUp(element, target, duration = 800, suffix = '') {
  const start = 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    element.textContent = (element.dataset.display || current) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

export function refreshIcons(root = document) {
  if (window.lucide) lucide.createIcons({ nodes: [root] });
}
