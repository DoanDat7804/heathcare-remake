// index.ts
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:3000'; // Đảm bảo khớp với cổng backend
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho request
api.interceptors.request.use(
  (config) => {
    // Lấy token linh hoạt: ưu tiên adminToken, rồi doctorToken, rồi token chung
    const adminToken = localStorage.getItem('adminToken');
    const doctorToken = localStorage.getItem('doctorToken');
    const genericToken = localStorage.getItem('token');

    const token = adminToken || doctorToken || genericToken;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Token gửi đi trong request:', token); // Debug token
    } else {
      console.log('Không tìm thấy token trong localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor cho response
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
        // Xử lý đăng xuất dựa trên loại token
        if (localStorage.getItem('adminToken')) {
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
        } else if (localStorage.getItem('doctorToken')) {
          localStorage.removeItem('doctorToken');
          window.location.href = '/doctor/login';
        } else if (localStorage.getItem('token')) {
          localStorage.removeItem('token');
          window.location.href = '/login'; // Đường dẫn chung nếu cần
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;