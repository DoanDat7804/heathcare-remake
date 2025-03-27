// userApi.js
import api from './index';
import { toast } from 'react-toastify';
import { handleError } from './errorHandler';

export const userApi = {
  getProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch profile');
    }
  },
  updateProfile: async (userId, userData) => {
    try {
      const response = await api.patch(`/users/${userId}`, userData);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to update profile');
    }
  },
  getAppointments: async () => {
    try {
      const response = await api.get('/appointments');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch appointments');
    }
  },
};

export default userApi;
