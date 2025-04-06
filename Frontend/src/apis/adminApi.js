import api from './index';
import { toast } from 'react-toastify';

export const adminApi = {
  // Quản lý Users
  getAllUsers: async (token) => {
    try {
      const response = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
      throw error;
    }
  },

  createUser: async (userData, token) => {
    console.log('Dữ liệu gửi đến API:', userData);
    try {
      const response = await api.post('/admin/users', userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User created successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create user';
      toast.error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
      throw error;
    }
  },

  updateUser: async (id, userData, token) => {
    try {
      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: userData.role,
        gender: userData.gender,
        address: userData.address,
      };
      console.log('Dữ liệu gửi đi:', payload);
      const response = await api.patch(`/admin/users/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User updated successfully');
      return response.data;
    } catch (error) {
      console.error('Chi tiết lỗi:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to update user');
      throw error;
    }
  },

  deleteUser: async (id, token) => {
    try {
      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
      throw error;
    }
  },

  // Quản lý Doctors
  getAllDoctors: async (token) => {
    try {
      const response = await api.get('/admin/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Raw doctors data from API:', response.data); // Thêm log để kiểm tra
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch doctors');
      throw error;
    }
  },

  createDoctor: async (doctorData, token) => {
    try {
      const response = await api.post('/admin/doctors', doctorData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Doctor created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create doctor');
      throw error;
    }
  },

  updateDoctor: async (id, doctorData, token) => {
    try {
      const response = await api.patch(`/admin/doctors/${id}`, doctorData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Doctor updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update doctor');
      throw error;
    }
  },

  deleteDoctor: async (id, token) => {
    try {
      await api.delete(`/admin/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Doctor deleted successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete doctor';
      toast.error(errorMessage);
      return { success: false, error: error.response?.data || error };
    }
  },

  // Quản lý News
  getAllNews: async (token) => {
    try {
      const response = await api.get('/admin/news', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch news');
      throw error;
    }
  },

  createNews: async (newsData, token) => {
    try {
      console.log('Dữ liệu gửi lên:', newsData);
      const response = await api.post('/admin/news', newsData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('News created successfully');
      return response.data;
    } catch (error) {
      console.error('Lỗi từ server:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to create news');
      throw error;
    }
  },

  updateNews: async (id, newsData, token) => {
    try {
      console.log('Dữ liệu gửi đi:', newsData);
      const response = await api.patch(`/admin/news/${id}`, newsData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('News updated successfully');
      return response.data;
    } catch (error) {
      console.error('Chi tiết lỗi:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to update news');
      throw error;
    }
  },

  deleteNews: async (id, token) => {
    try {
      await api.delete(`/admin/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('News deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete news');
      throw error;
    }
  },

  // Quản lý Appointments
  getAllAppointments: async (token) => {
    try {
      const response = await api.get('/admin/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Raw appointments response:', response.data); // Debug dữ liệu thô
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch appointments');
      throw error;
    }
  },

  createAppointment: async (appointmentData, token) => {
    console.log('Dữ liệu gửi đến API:', appointmentData);
    try {
      const response = await api.post('/admin/appointments', appointmentData, { // Sửa URL thành /admin/appointments
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Appointment created successfully');
      return response.data;
    } catch (error) {
      console.error('Lỗi từ server:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to create appointment');
      throw error;
    }
  },

  updateAppointment: async (id, appointmentData, token) => {
    try {
      const response = await api.patch(`/admin/appointments/${id}`, appointmentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Appointment updated successfully');
      return response.data;
    } catch (error) {
      const errorDetails = error.response?.data || error.message;
      console.error('Chi tiết lỗi từ server:', JSON.stringify(errorDetails, null, 2));
      const errorMessage = error.response?.data?.message?.join(', ') || error.response?.data?.message || 'Failed to update appointment';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  deleteAppointment: async (id, token) => {
    try {
      await api.delete(`/appointments/admin/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Appointment deleted successfully');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete appointment');
      return { success: false, error: error.response?.data || error };
    }
  },
};

export default adminApi;