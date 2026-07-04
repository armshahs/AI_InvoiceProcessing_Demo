import { el, getConfidenceBadge, refreshIcons } from '../utils.js';
import { createDocumentViewer, createProcessingTimeline } from '../components/shared.js';
import { state } from '../state.js';

const STEPS = [
  { title: 'Receiving Document', desc: 'Ingesting PDF from email' },
  { title: 'OCR', desc: 'Optical character recognition' },
  { title: 'Layout Detection', desc: 'Identifying document structure' },
  { title: 'Table Detection', desc: 'Finding line item tables' },
  { title: 'LLM Extraction', desc: 'Extracting structured fields' },
  { title: 'Confidence Calculation', desc: 'Scoring field accuracy' },
  { title: 'Completed', desc: 'Extraction complete' }
];

const MESSAGES = [
  'Detecting customer...',
  'Finding tables...',
  'Reading line items...',
  'Calculating totals...',
  'Extraction Complete'
];

const HIGHLIGHTS = [
  { top: 8, left: 10, width: 35, height: 5 },
  { top: 18, left: 10, width: 40, height: 4 },
  { top: 35, left: 5, width: 90, height: 25 },
  { top: 65, left: 60, width: 30, height: 5 },
  { top: 75, left: 10, width: 50, height: 4 }
];

export function renderAIProcessing(navigate) {
  let activeStep = 0;
  let activeHighlights = [];
  let messageIndex = 0;
  let fieldsExtracted = 0;
  let confidence = 0;
  let processingTime = 0;
  let timerInterval = null;
  let completed = false;

  const page = el('div', { className: 'page-enter' });
  page.appendChild(el('div', { className: 'page-header' }, [
    el('h1', {}, ['AI Processing']),
    el('p', {}, [`Processing ${state.getSelectedPO()?.poNumber || 'PO-24119'} — AI is reading and understanding the document`])
  ]));

  const customAiBanner = el('div', { className: 'custom-ai-banner mb-6' });
  customAiBanner.innerHTML = `
    <div class="custom-ai-banner-icon"><i data-lucide="brain-circuit"></i></div>
    <div class="custom-ai-banner-content">
      <div class="custom-ai-banner-eyebrow">
        <i data-lucide="sparkles"></i>
        Custom-Trained AI Engine
      </div>
      <h2 class="custom-ai-banner-title">PO Intelligence Model v2.4</h2>
      <p class="custom-ai-banner-desc">
        This document is processed by our proprietary AI — fine-tuned on 1.2M+ enterprise purchase orders
        across your customer formats, SKU catalogs, and approval workflows.
      </p>
    </div>
    <div class="custom-ai-banner-badges">
      <span class="custom-ai-banner-badge"><i data-lucide="shield-check"></i> Domain-Specific</span>
      <span class="custom-ai-banner-badge"><i data-lucide="zap"></i> 94% Auto-Rate</span>
      <span class="custom-ai-banner-badge"><i data-lucide="database"></i> Your ERP Rules</span>
    </div>`;
  page.appendChild(customAiBanner);

  const layout = el('div', { className: 'ai-processing-layout' });
  const docArea = el('div');
  const sidePanel = el('div', { className: 'card' });
  sidePanel.innerHTML = '<h3 class="card-title mb-4">Processing Timeline</h3>';
  const timelineContainer = el('div');
  sidePanel.appendChild(timelineContainer);

  const statusPanel = el('div', { className: 'card mt-6' });
  const messagesEl = el('div');
  const progressBar = el('div', { className: 'progress-bar mt-4' });
  const progressFill = el('div', { className: 'progress-bar-fill', style: 'width:0%' });
  progressBar.appendChild(progressFill);
  const statsEl = el('div', { className: 'ai-stats' });
  statusPanel.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h3 class="card-title">AI Status</h3>
      <span class="custom-ai-pill"><i data-lucide="brain"></i> Custom Model Active</span>
    </div>`;
  statusPanel.append(messagesEl, progressBar, statsEl);

  layout.append(docArea, el('div', {}, [sidePanel, statusPanel]));
  page.appendChild(layout);

  function renderDoc() {
    docArea.innerHTML = '';
    docArea.appendChild(createDocumentViewer({
      highlights: activeHighlights,
      showScanLine: !completed
    }));
  }

  function renderTimeline() {
    timelineContainer.innerHTML = '';
    timelineContainer.appendChild(createProcessingTimeline(STEPS, activeStep));
    refreshIcons(timelineContainer);
  }

  function renderStats() {
    statsEl.innerHTML = `
      <div><div class="ai-stat-value">${fieldsExtracted}</div><div class="ai-stat-label">Fields Extracted</div></div>
      <div><div class="ai-stat-value">${processingTime}s</div><div class="ai-stat-label">Processing Time</div></div>
      <div><div class="ai-stat-value">${confidence}%</div><div class="ai-stat-label">Confidence</div></div>`;
  }

  function addMessage(text, active = false) {
    messagesEl.appendChild(el('div', { className: `ai-message${active ? ' active' : ''}` }, [text]));
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  renderDoc();
  renderTimeline();
  renderStats();
  refreshIcons(page);
  addMessage('Custom-trained model analyzing document layout...', true);

  timerInterval = setInterval(() => {
    if (completed) return;
    processingTime++;
    renderStats();
  }, 1000);

  const stepInterval = setInterval(() => {
    if (activeStep >= STEPS.length - 1) {
      clearInterval(stepInterval);
      clearInterval(timerInterval);
      completed = true;
      fieldsExtracted = 34;
      confidence = 96;
      processingTime = 18;
      progressFill.style.width = '100%';
      addMessage('Extraction Complete', true);
      renderDoc();
      renderStats();
      renderTimeline();
      setTimeout(() => {
        state.setWorkflowStep('validation');
        navigate('validation');
      }, 2000);
      return;
    }
    activeStep++;
    fieldsExtracted = Math.min(34, Math.round((activeStep / 6) * 34));
    confidence = Math.min(96, Math.round((activeStep / 6) * 96));
    progressFill.style.width = `${(activeStep / (STEPS.length - 1)) * 100}%`;
    if (activeStep <= HIGHLIGHTS.length) activeHighlights = HIGHLIGHTS.slice(0, activeStep);
    if (messageIndex < MESSAGES.length - 1 && activeStep % 2 === 0) {
      messageIndex++;
      addMessage(MESSAGES[messageIndex], true);
    }
    renderDoc();
    renderTimeline();
    renderStats();
  }, 800);

  return page;
}
