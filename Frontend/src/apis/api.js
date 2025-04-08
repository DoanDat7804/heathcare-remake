import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

// 🔹 Sử dụng biến môi trường để linh hoạt trong phát triển và triển khai
const API_URL = 'http://localhost:3000';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🛠️ Interceptor cho request: Thêm token vào header nếu có
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

// 🛠️ Interceptor cho response: Xử lý lỗi chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", {
        status: error.response.status,
        message: error.response.data?.message || error.message,
        url: error.config.url,
      });

      if (error.response.status === 401) {
        // 🔹 Xử lý khi token hết hạn hoặc không hợp lệ
        logout();
      }
    }

    return Promise.reject(error);
  },
);

// 🛠️ Hàm logout: Xóa token và chuyển hướng đến trang đăng nhập
const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/admin/login'; // Chuyển hướng về trang đăng nhập
};

// 🔹 Xuất `api` để sử dụng trong các module khác
export default api;
