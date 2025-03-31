// src/apis/authApi.ts
import api from './index';

export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
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