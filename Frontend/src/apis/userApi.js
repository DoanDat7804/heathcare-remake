import api from './index';

export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.patch('/users/profile', userData),
  getAppointments: () => api.get('/users/appointments'),
};