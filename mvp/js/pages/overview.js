import { el, refreshIcons } from '../utils.js';

/** Steps from tech_docs/02_User_Journey.md */
const USER_JOURNEY = [
  { step: 1, title: 'Dashboard', route: 'dashboard', icon: 'layout-dashboard', color: 'blue' },
  { step: 2, title: 'Purchase Order Inbox', route: 'inbox', icon: 'inbox', color: 'cyan' },
  { step: 3, title: 'AI Processing', route: 'ai-processing', icon: 'brain-circuit', color: 'purple' },
  { step: 4, title: 'Business Validation', route: 'validation', icon: 'shield-check', color: 'amber' },
  { step: 5, title: 'Maker Review', route: 'maker-review', icon: 'edit-3', color: 'violet' },
  { step: 6, title: 'Checker Approval', route: 'checker-approval', icon: 'user-check', color: 'orange' },
  { step: 7, title: 'ERP Export', route: 'erp-export', icon: 'database', color: 'green' },
  { step: 8, title: 'Audit Trail', route: 'audit-trail', icon: 'clock', color: 'slate' },
  { step: 9, title: 'AI Copilot', route: null, icon: 'message-circle', color: 'indigo' }
];

const STEP_DETAILS = {
  dashboard: {
    summary: 'Real-time command center for your PO processing operations.',
    advantage: 'Instant visibility into volume, bottlenecks, and automation KPIs — spot issues before they escalate.',
    metric: '247 POs/day tracked'
  },
  inbox: {
    summary: 'Central hub for all incoming purchase orders.',
    advantage: 'Invoices arrive via email forwarding or manual uploads — zero friction intake from any channel.',
    metric: 'Email · Portal · EDI'
  },
  'ai-processing': {
    summary: 'Custom-trained AI reads and extracts every field from the document.',
    advantage: 'Custom-trained AI delivers 97% PO data extraction accuracy — fine-tuned on your customer formats and layouts.',
    metric: '97% extraction accuracy',
    featured: true
  },
  validation: {
    summary: 'Extracted data is checked against your business rules automatically.',
    advantage: 'Automated rules catch SKU mismatches, pricing errors, and duplicates before they reach your team.',
    metric: '8 rules · instant checks'
  },
  'maker-review': {
    summary: 'Operations maker reviews exceptions and corrects flagged fields.',
    advantage: 'Human-in-the-loop review with AI confidence scores — makers focus only on what needs attention.',
    metric: '94% straight-through'
  },
  'checker-approval': {
    summary: 'Independent checker verifies maker corrections before sign-off.',
    advantage: 'Maker-checker dual verification ensures compliance, accountability, and reduced payment errors.',
    metric: 'Dual-signoff control',
    featured: true
  },
  'erp-export': {
    summary: 'Approved POs are transformed into ERP-ready payloads.',
    advantage: 'Results pushed into ERP through APIs or CSV exports — no manual re-keying, zero data loss.',
    metric: 'SAP · API · CSV',
    featured: true
  },
  'audit-trail': {
    summary: 'Every action is logged with timestamp, user, and AI confidence.',
    advantage: 'Complete immutable audit history for compliance, dispute resolution, and process improvement.',
    metric: 'Full traceability'
  },
  copilot: {
    summary: 'Floating AI assistant available on every screen.',
    advantage: 'Context-aware copilot explains flags, suggests corrections, and guides users through each workflow step.',
    metric: 'Always on · every screen',
    copilot: true
  }
};

const WORKFLOW_STEPS = USER_JOURNEY.map(j => {
  const detailKey = j.step === 9 ? 'copilot' : j.route;
  return {
    ...j,
    route: j.route || 'dashboard',
    ...STEP_DETAILS[detailKey]
  };
});

export function renderOverview(navigate) {
  const page = el('div', { className: 'page-enter overview-page' });

  const hero = el('div', { className: 'overview-hero' });
  hero.innerHTML = `
    <div class="overview-hero-content">
      <span class="overview-hero-badge"><i data-lucide="sparkles"></i> Platform Overview</span>
      <h1>AI-Powered PO Ingestion Workflow</h1>
      <p>From email intake to ERP export — an intelligent, human-verified pipeline that automates 94% of purchase order processing end to end.</p>
      <div class="overview-hero-stats">
        <div class="overview-hero-stat"><strong>97%</strong><span>Extraction accuracy</span></div>
        <div class="overview-hero-stat"><strong>94%</strong><span>Automation rate</span></div>
        <div class="overview-hero-stat"><strong>2m 14s</strong><span>Avg. processing</span></div>
      </div>
      <div class="overview-hero-benefits">
        <div class="overview-hero-benefit">
          <i data-lucide="mail-plus"></i>
          <span>Invoices via email forwarding or manual uploads</span>
        </div>
        <div class="overview-hero-benefit">
          <i data-lucide="user-check"></i>
          <span>Maker-checker for verification</span>
        </div>
        <div class="overview-hero-benefit">
          <i data-lucide="upload-cloud"></i>
          <span>Results pushed to ERP via APIs or CSV exports</span>
        </div>
      </div>
    </div>
    <div class="overview-hero-visual">
      <div class="overview-flow-mini">
        <span><i data-lucide="mail"></i> Intake</span>
        <i data-lucide="arrow-right" class="overview-flow-arrow"></i>
        <span><i data-lucide="brain"></i> AI</span>
        <i data-lucide="arrow-right" class="overview-flow-arrow"></i>
        <span><i data-lucide="user-check"></i> Verify</span>
        <i data-lucide="arrow-right" class="overview-flow-arrow"></i>
        <span><i data-lucide="database"></i> ERP</span>
      </div>
    </div>`;
  page.appendChild(hero);

  const stepsHeader = el('div', { className: 'overview-steps-header' });
  stepsHeader.innerHTML = `
    <h2>User Journey</h2>
    <p>The end-to-end workflow — click any step to open the live demo screen.</p>`;
  page.appendChild(stepsHeader);

  const journeyMap = el('div', { className: 'overview-journey-map card' });
  journeyMap.innerHTML = '<div class="overview-journey-map-label"><i data-lucide="route"></i> Workflow path</div>';
  const journeyTrack = el('div', { className: 'overview-journey-track' });
  USER_JOURNEY.forEach((j, i) => {
    if (i > 0) {
      journeyTrack.appendChild(el('span', { className: 'overview-journey-connector', innerHTML: '<i data-lucide="chevron-right"></i>' }));
    }
    const chip = el('button', {
      className: `overview-journey-chip overview-step-${j.color}`,
      type: 'button',
      onClick: () => navigate(j.route || 'dashboard')
    });
    chip.innerHTML = `
      <span class="overview-journey-chip-num">${j.step}</span>
      <span class="overview-journey-chip-icon"><i data-lucide="${j.icon}"></i></span>
      <span class="overview-journey-chip-title">${j.title}</span>`;
    journeyTrack.appendChild(chip);
  });
  journeyMap.appendChild(journeyTrack);
  page.appendChild(journeyMap);

  const detailHeader = el('div', { className: 'overview-steps-header overview-steps-header-secondary' });
  detailHeader.innerHTML = `
    <h2>Step Details &amp; Advantages</h2>
    <p>What each stage delivers and why it matters.</p>`;
  page.appendChild(detailHeader);

  const stepsGrid = el('div', { className: 'overview-steps' });
  WORKFLOW_STEPS.forEach((step, i) => {
    const card = el('div', {
      className: `overview-step-card overview-step-${step.color}${step.featured ? ' overview-step-featured' : ''} card-animate stagger-${Math.min(i + 1, 8)}`,
      onClick: () => navigate(step.route)
    });

    card.innerHTML = `
      <div class="overview-step-connector"></div>
      <div class="overview-step-number">${step.step}</div>
      <div class="overview-step-icon"><i data-lucide="${step.icon}"></i></div>
      <div class="overview-step-body">
        <div class="overview-step-top">
          <h3>${step.title}</h3>
          <span class="overview-step-metric">${step.metric}</span>
        </div>
        <p class="overview-step-summary">${step.summary}</p>
        <div class="overview-step-advantage">
          <i data-lucide="zap"></i>
          <span>${step.advantage}</span>
        </div>
        <button class="overview-step-link btn btn-ghost btn-sm">
          ${step.copilot ? 'Try Copilot on any screen' : 'Open step'}
          <i data-lucide="arrow-right"></i>
        </button>
      </div>`;

    card.querySelector('.overview-step-link').addEventListener('click', e => {
      e.stopPropagation();
      navigate(step.route);
    });

    stepsGrid.appendChild(card);
  });
  page.appendChild(stepsGrid);

  const cta = el('div', { className: 'overview-cta card' });
  cta.innerHTML = `
    <div class="overview-cta-content">
      <h3>Ready to walk through the demo?</h3>
      <p>Start from the Inbox, pick PO-24119, and follow the full journey to ERP export.</p>
    </div>`;
  const ctaBtn = el('button', { className: 'btn btn-primary btn-lg', onClick: () => navigate('inbox') });
  ctaBtn.innerHTML = '<i data-lucide="play"></i> Start Demo Journey';
  cta.appendChild(ctaBtn);
  page.appendChild(cta);

  refreshIcons(page);
  return page;
}
