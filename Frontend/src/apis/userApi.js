import api from './index';
import { toast } from 'react-toastify';

export const userApi = {
  getProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`); // Sửa thành /users/:id
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch profile');
      throw error;
    }
  },
  updateProfile: async (userId, userData) => {
    try {
      const response = await api.patch(`/users/${userId}`, userData); // Sửa thành /users/:id
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  },
  getAppointments: async () => {
    try {
      const response = await api.get('/appointments'); // Giả sử backend có endpoint này
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch appointments');
      throw error;
    }
  },
};

export default userApi;