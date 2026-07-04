export const state = {
  selectedPoId: 'po-24119',
  workflowStep: 'dashboard',
  makerCorrections: {},
  checkerDecision: null,
  sidebarCollapsed: false,
  purchaseOrders: [],
  dashboardData: null,
  validationRules: [],
  auditEvents: [],
  copilotData: null,

  getSelectedPO() {
    return this.purchaseOrders.find(po => po.id === this.selectedPoId) || null;
  },

  setSelectedPO(id) {
    this.selectedPoId = id;
  },

  setWorkflowStep(step) {
    this.workflowStep = step;
  }
};
