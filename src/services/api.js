// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token quando implementarmos autenticação
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Socket.io - desabilitado temporariamente
let socket = null;

export const initSocket = (empresaId = '00000000-0000-0000-0000-000000000001') => {
  // Desabilitado temporariamente para evitar erros
  return {
    on: () => {},
    off: () => {},
    emit: () => {},
    disconnect: () => {}
  };
};

export const getSocket = () => socket;

// Serviços da API

// Dashboard
export const dashboardService = {
  getKPIs: () => api.get('/dashboard/kpis'),
  getRecentActivities: () => api.get('/dashboard/recent-activities'),
  getPerformanceData: (days = 10) => api.get(`/dashboard/performance-data?days=${days}`),
  getChannelPerformance: () => api.get('/dashboard/channel-performance')
};

// Conversas
export const conversationsService = {
  getAll: (params = {}) => api.get('/conversations', { params }),
  getMessages: (conversationId) => api.get(`/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, message) => 
    api.post(`/conversations/${conversationId}/messages`, { message }),
  updateStatus: (conversationId, status) => 
    api.put(`/conversations/${conversationId}/status`, { status })
};

// Contatos
export const contactsService = {
  getAll: (params = {}) => api.get('/contacts', { params }),
  getById: (id) => api.get(`/contacts/${id}`),
  create: (data) => api.post('/contacts', data),
  update: (id, data) => api.put(`/contacts/${id}`, data),
  delete: (id) => api.delete(`/contacts/${id}`),
  import: (formData) => api.post('/contacts/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  export: () => api.get('/contacts/export', { responseType: 'blob' }),
  getTemplate: () => api.get('/contacts/template', { responseType: 'blob' })
};

// Pipeline
export const pipelineService = {
  getStages: () => api.get('/pipeline/stages'),
  getDeals: (params = {}) => api.get('/pipeline/deals', { params }),
  createDeal: (data) => api.post('/pipeline/deals', data),
  updateDeal: (dealId, data) => api.put(`/pipeline/deals/${dealId}`, data),
  moveDeal: (dealId, stageId) => api.put(`/pipeline/deals/${dealId}/move`, { stageId })
};

// Relatórios
export const reportsService = {
  getSalesReport: (period) => api.get(`/reports/sales?period=${period}`),
  getTeamPerformance: () => api.get('/reports/team-performance'),
  getCommunicationStats: () => api.get('/reports/communication-stats')
};

// Integração WhatsApp
export const whatsappService = {
  getConnectionStatus: () => api.get('/whatsapp/status'),
  getQRCode: () => api.get('/whatsapp/qr-code'),
  disconnect: () => api.post('/whatsapp/disconnect')
};

export default api;