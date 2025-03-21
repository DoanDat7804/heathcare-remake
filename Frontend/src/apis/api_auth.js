import axios from 'axios';
import BASE_URL from "../apis/api.js";

const API_URL = `${BASE_URL}/auth`; // Đổi URL nếu cần

const apiAuth = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }
};

export default apiAuth;
