import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

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
  callback: () => apiClient.post('/auth/callback'),
  getCurrentUser: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
};

export const dataAPI = {
  getUserData: () => apiClient.get('/data/user-data'),
};