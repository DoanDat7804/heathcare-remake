import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Thay bằng URL backend thực tế của bạn

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động gắn token vào header nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;

// Export tất cả các API khác
export * from './authApi';
export * from './userApi';
export * from './doctorApi';
export * from './newsApi';
export * from './adminApi';
