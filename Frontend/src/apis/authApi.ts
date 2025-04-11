  import api from './index';

export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data; // Đảm bảo trả về { access_token }
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  adminLogin: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/admin/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  register: async (userData: Record<string, any>) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};