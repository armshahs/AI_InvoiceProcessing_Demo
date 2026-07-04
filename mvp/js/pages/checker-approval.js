import { el, showToast, refreshIcons } from '../utils.js';
import { state } from '../state.js';

export function renderCheckerApproval(correction, navigate) {
  const page = el('div', { className: 'page-enter' });
  page.appendChild(el('div', { className: 'page-header' }, [
    el('h1', {}, ['Checker Approval']),
    el('p', {}, ['Review maker corrections before final approval'])
  ]));

  const card = el('div', { className: 'card' });
  card.innerHTML = `
    <h3 class="card-title mb-4">Field Comparison</h3>
    <p class="mb-4" style="color:var(--color-text-secondary)">Showing changes only — Original → AI Extraction → Maker Correction</p>`;

  const diffViewer = el('div', { className: 'diff-viewer' });
  diffViewer.innerHTML = `
    <table class="diff-table">
      <thead>
        <tr><th>Field</th><th class="col-original">Original</th><th class="col-ai">AI Extraction</th><th class="col-maker">Maker Correction</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Line Item 3 — Quantity (Maggi Noodles)</td>
          <td>${correction.original}</td>
          <td>${correction.aiValue}</td>
          <td class="diff-changed">${correction.correctedValue}</td>
        </tr>
      </tbody>
    </table>`;
  card.appendChild(diffViewer);

  const commentPanel = el('div', { className: 'form-group mt-6' });
  commentPanel.innerHTML = '<label class="form-label">Comment</label>';
  commentPanel.appendChild(el('textarea', {
    className: 'form-input',
    rows: '3',
    placeholder: 'Add approval notes...'
  }, [`Verified quantity change per customer email confirmation.`]));
  card.appendChild(commentPanel);

  const signatureArea = el('div', { className: 'signature-area' });
  const sigCheck = el('input', { type: 'checkbox', id: 'digital-sig' });
  const sigLabel = el('label', { htmlFor: 'digital-sig' }, [' I digitally sign and approve these corrections']);
  signatureArea.append(sigCheck, sigLabel);
  card.appendChild(signatureArea);

  const toolbar = el('div', { className: 'approval-toolbar' });
  toolbar.appendChild(el('button', {
    className: 'btn btn-success',
    onClick: () => {
      if (!sigCheck.checked) { showToast('Digital signature required', 'error'); return; }
      state.checkerDecision = 'approved';
      state.setWorkflowStep('erp-export');
      navigate('erp-export');
    }
  }, [el('span', { innerHTML: '<i data-lucide="check"></i>' }), 'Approve']));
  toolbar.appendChild(el('button', {
    className: 'btn btn-danger',
    onClick: () => showToast('PO rejected', 'error')
  }, [el('span', { innerHTML: '<i data-lucide="x"></i>' }), 'Reject']));
  toolbar.appendChild(el('button', {
    className: 'btn btn-secondary',
    onClick: () => { navigate('maker-review'); showToast('Sent back to maker', 'info'); }
  }, [el('span', { innerHTML: '<i data-lucide="undo-2"></i>' }), 'Send Back']));
  card.appendChild(toolbar);
  page.appendChild(card);

  refreshIcons(page);
  return page;
}
