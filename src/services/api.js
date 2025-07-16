// frontend/src/services/api.js
import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token se existir
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços da API
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  verifyToken: () => api.get('/auth/verify'),
};

export const dashboardService = {
  getKPIs: () => api.get('/dashboard/kpis'),
  getRecentActivities: () => api.get('/dashboard/recent-activities'),
  getPerformanceData: (days = 30) => api.get(`/dashboard/performance-data?days=${days}`),
  getChannelPerformance: () => api.get('/dashboard/channel-performance'),
  getSalesFunnel: () => api.get('/dashboard/sales-funnel'),
  getTopSellers: () => api.get('/dashboard/top-sellers'),
  getMetricsSummary: () => api.get('/dashboard/metrics-summary'),
};

export const conversationService = {
  getAll: (params) => api.get('/conversations', { params }),
  getById: (id) => api.get(`/conversations/${id}`),
  sendMessage: (conversationId, data) => api.post(`/conversations/${conversationId}/messages`, data),
  markAsRead: (conversationId) => api.put(`/conversations/${conversationId}/read`),
  updateStatus: (conversationId, status) => api.put(`/conversations/${conversationId}/status`, { status }),
};

export const pipelineService = {
  getStages: () => api.get('/pipeline/stages'),
  getDeals: () => api.get('/pipeline/deals'),
  createDeal: (data) => api.post('/pipeline/deals', data),
  moveDeal: (dealId, stageId) => api.put(`/pipeline/deals/${dealId}/move`, { stageId }),
  updateDeal: (dealId, data) => api.put(`/pipeline/deals/${dealId}`, data),
  deleteDeal: (dealId) => api.delete(`/pipeline/deals/${dealId}`),
};

export const contactService = {
  getAll: (params) => api.get('/contacts', { params }),
  getById: (id) => api.get(`/contacts/${id}`),
  create: (data) => api.post('/contacts', data),
  update: (id, data) => api.put(`/contacts/${id}`, data),
  delete: (id) => api.delete(`/contacts/${id}`),
  bulkImport: (data) => api.post('/contacts/bulk-import', data),
};

// Alias para compatibilidade
export const contactsService = contactService;

export const automationService = {
  getStatus: () => api.get('/automation/status'),
  start: () => api.post('/automation/start'),
  stop: () => api.post('/automation/stop'),
  runNow: () => api.post('/automation/run-now'),
};

export const campaignService = {
  getAll: (params) => api.get('/campaigns', { params }),
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post('/campaigns', data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  delete: (id) => api.delete(`/campaigns/${id}`),
  start: (id) => api.post(`/campaigns/${id}/start`),
  pause: (id) => api.post(`/campaigns/${id}/pause`),
  getStats: (id) => api.get(`/campaigns/${id}/stats`),
};

export const reportService = {
  getDashboard: (params) => api.get('/reports/dashboard', { params }),
  getConversions: (params) => api.get('/reports/conversions', { params }),
  getChannels: (params) => api.get('/reports/channels', { params }),
  exportData: (type, params) => api.get(`/reports/export/${type}`, { params, responseType: 'blob' }),
};

// Adicionar aliases que podem estar sendo usados em outras páginas
export const pipelinesService = pipelineService;
export const conversationsService = conversationService;

export default api;