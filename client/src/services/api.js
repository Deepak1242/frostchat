import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Token is already set in auth store, but we can also get from localStorage as backup
    const authData = localStorage.getItem('frostchat-auth');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state?.token && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${state.token}`;
        }
      } catch (e) {
        console.error('Error parsing auth data:', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('frostchat-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
