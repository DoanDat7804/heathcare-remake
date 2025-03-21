import axios from 'axios';
import BASE_URL from "../apis/api.js";

const API_URL = `${BASE_URL}/users`; // Đổi URL nếu cần

const apiUser = {
  createUser: async (userData, token) => {
    try {
      const response = await axios.post(`${API_URL}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  getAllUsers: async (token) => {
    try {
      const response = await axios.get(`${API_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  },

  getUserById: async (id, token) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  updateUser: async (id, updateData, token) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  deleteUser: async (id, token) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },
};

export default apiUser;
