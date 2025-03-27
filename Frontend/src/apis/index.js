import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:3000'; // Lấy từ .env

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho request: Thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor cho response: Xử lý lỗi chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      window.location.href = '/admin/login'; // Chuyển hướng đến trang login
    }
    return Promise.reject(error); // Ném lỗi để các hàm API xử lý
  },
);

export default api;

// Export các API khác
export * from './authApi';
export * from './userApi';
export * from './doctorApi';
export * from './newsApi';
export * from './adminApi';
export * from './appointmentsApi';
export * from './medical-recordsApi';
export * from './notificationApi';
export * from './servicesApi';