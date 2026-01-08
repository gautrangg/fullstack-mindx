import axios from 'axios';

// Use env variable for API base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  getLoginUrl: () => apiClient.get('/auth/login'),
  callback: (code: string) => apiClient.post('/auth/callback', { code }),
  getSessionData: (sessionId: string) => apiClient.get(`/auth/session/${sessionId}`),
  getCurrentUser: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
};

export const dataAPI = {
  getUserData: () => apiClient.get('/data/user-data'),
};