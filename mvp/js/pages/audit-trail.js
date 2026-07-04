import { el, refreshIcons } from '../utils.js';
import { createAuditTimeline, createAuditEventCard } from '../components/shared.js';
import { state } from '../state.js';

export function renderAuditTrail(events) {
  let selectedEvent = events[0];

  const page = el('div', { className: 'page-enter' });
  page.appendChild(el('div', { className: 'page-header' }, [
    el('h1', {}, ['Audit Trail']),
    el('p', {}, [`Complete history for ${state.getSelectedPO()?.poNumber || 'PO-24119'}`])
  ]));

  const layout = el('div', { className: 'audit-layout' });
  const timelineCard = el('div', { className: 'card' });
  timelineCard.innerHTML = '<h3 class="card-title mb-4">Timeline</h3>';
  const timeline = createAuditTimeline(events);
  timeline.querySelectorAll('.timeline-item').forEach((item, i) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      selectedEvent = events[i];
      renderDetail();
      timeline.querySelectorAll('.timeline-item').forEach(t => t.classList.remove('active'));
      item.classList.add('active');
    });
    if (i === 0) item.classList.add('active');
  });
  timelineCard.appendChild(timeline);
  layout.appendChild(timelineCard);

  const detailArea = el('div');
  layout.appendChild(detailArea);

  function renderDetail() {
    detailArea.innerHTML = '';
    detailArea.appendChild(createAuditEventCard(selectedEvent));
    refreshIcons(detailArea);
  }

  renderDetail();
  page.appendChild(layout);
  refreshIcons(page);
  return page;
}
