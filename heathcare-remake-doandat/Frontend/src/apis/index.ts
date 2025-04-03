import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:3000'; // Đảm bảo khớp với cổng backend
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        message: error.response.data?.message || error.message,
        url: error.config.url,
      });
      if (error.response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;