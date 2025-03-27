// appointmentApi.js
import api from './index';
import { toast } from 'react-toastify';
import { handleError } from './errorHandler';

const appointmentApi = {
  // API cho patient và doctor
  createAppointment: async (data) => {
    try {
      const response = await api.post('/appointments', data);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to create appointment');
    }
  },
  getMyAppointments: async () => {
    try {
      const response = await api.get('/appointments/me');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch your appointments');
    }
  },
  confirmAppointment: async (id) => {
    try {
      const response = await api.put(`/appointments/${id}/confirm`);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to confirm appointment');
    }
  },

  // API cho admin
  getAllAppointments: async () => {
    try {
      const response = await api.get('/admin/appointments');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch appointments');
    }
  },
  updateAppointment: async (id, data) => {
    try {
      const response = await api.patch(`/admin/appointments/${id}`, data);
      toast.success('Appointment updated successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to update appointment');
    }
  },
  deleteAppointment: async (id) => {
    try {
      const response = await api.delete(`/admin/appointments/${id}`);
      toast.success('Appointment deleted successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to delete appointment');
    }
  },
};

export default appointmentApi;
