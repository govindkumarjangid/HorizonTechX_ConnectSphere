import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests
api.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem('token') || localStorage.getItem('cs_token');
    if (token)
      request.headers.Authorization = `Bearer ${token}`;

    // If payload is FormData, let browser set multipart/form-data with boundary
    if (request.data instanceof FormData) {
      delete request.headers['Content-Type'];
    }

    return request;
  },
  (error) => Promise.reject(error)
);

// Global 401 Unauthorized handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('cs_token');
      localStorage.removeItem('cs_user');

      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register')
        window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;