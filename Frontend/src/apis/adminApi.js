// adminApi.js
import api from './index';
import { toast } from 'react-toastify';
import { handleError } from './errorHandler';

export const adminApi = {
  // Quản lý Users
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch users');
    }
  },
  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      toast.success('User created successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to create user');
    }
  },
  updateUser: async (id, userData) => {
    try {
      const response = await api.patch(`/admin/users/${id}`, userData);
      toast.success('User updated successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to update user');
    }
  },
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      toast.success('User deleted successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to delete user');
    }
  },

  // Quản lý Doctors
  getAllDoctors: async () => {
    try {
      const response = await api.get('/admin/doctors');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch doctors');
    }
  },
  createDoctor: async (doctorData) => {
    try {
      const response = await api.post('/admin/doctors', doctorData);
      toast.success('Doctor created successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to create doctor');
    }
  },
  updateDoctor: async (id, doctorData) => {
    try {
      const response = await api.patch(`/admin/doctors/${id}`, doctorData);
      toast.success('Doctor updated successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to update doctor');
    }
  },
  deleteDoctor: async (id) => {
    try {
      const response = await api.delete(`/admin/doctors/${id}`);
      toast.success('Doctor deleted successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to delete doctor');
    }
  },

  // Quản lý News
  getAllNews: async () => {
    try {
      const response = await api.get('/admin/news');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch news');
    }
  },
  createNews: async (newsData) => {
    try {
      const response = await api.post('/admin/news', newsData);
      toast.success('News created successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to create news');
    }
  },
  updateNews: async (id, newsData) => {
    try {
      const response = await api.patch(`/admin/news/${id}`, newsData);
      toast.success('News updated successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to update news');
    }
  },
  deleteNews: async (id) => {
    try {
      const response = await api.delete(`/admin/news/${id}`);
      toast.success('News deleted successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to delete news');
    }
  },

  // Quản lý Appointments
  getAllAppointments: async () => {
    try {
      const response = await api.get('/admin/appointments');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch appointments');
    }
  },
  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await api.patch(`/admin/appointments/${id}`, appointmentData);
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

export default adminApi;
