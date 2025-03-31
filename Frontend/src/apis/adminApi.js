import api from './index';
import { toast } from 'react-toastify';


export const adminApi = {
  // Quản lý Users
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data; // Trả về dữ liệu từ response
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
      throw error; // Ném lỗi để component gọi hàm xử lý tiếp
    }
  },
  createUser: async (userData) => {
    console.log('Dữ liệu gửi đến API:', userData);
    try {
      const response = await api.post('/admin/users', userData);
      toast.success('User created successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create user';
      toast.error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
      throw error;
    }
  },
  updateUser: async (id, userData) => {
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
      const response = await api.patch(`/admin/users/${id}`, payload);
      toast.success('User updated successfully');
      return response.data;
    } catch (error) {
      console.error('Chi tiết lỗi:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to update user');
      throw error;
    }
  },
  deleteUser: async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
      throw error;
    }
  },

  // Quản lý Doctors
  getAllDoctors: async () => {
    try {
      const response = await api.get('/admin/doctors');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch doctors');
      throw error;
    }
  },
  createDoctor: async (doctorData) => {
    try {
      const response = await api.post('/admin/doctors', doctorData);
      toast.success('Doctor created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create doctor');
      throw error;
    }
  },
  updateDoctor: async (id, doctorData) => {
    try {
      const response = await api.patch(`/admin/doctors/${id}`, doctorData);
      toast.success('Doctor updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update doctor');
      throw error;
    }
  },
  deleteDoctor: async (id) => {
    try {
      await api.delete(`/admin/doctors/${id}`);
      toast.success('Doctor deleted successfully');
      return { success: true }; // Trả về kết quả thành công
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete doctor';
      toast.error(errorMessage);
      return { success: false, error: error.response?.data || error }; // Trả về lỗi chi tiết
    }
  },

  // Quản lý News
  getAllNews: async () => {
    try {
      const response = await api.get('/admin/news');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch news');
      throw error;
    }
  },
  createNews: async (newsData) => {
    try {
      const response = await api.post('/admin/news', newsData);
      toast.success('News created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create news');
      throw error;
    }
  },
  updateNews: async (id, newsData) => {
    try {
      const response = await api.patch(`/admin/news/${id}`, newsData);
      toast.success('News updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update news');
      throw error;
    }
  },
  deleteNews: async (id) => {
    try {
      await api.delete(`/admin/news/${id}`);
      toast.success('News deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete news');
      throw error;
    }
  },

  // Quản lý Appointments (thêm mới)
  getAllAppointments: async () => {
    try {
      const response = await api.get('/admin/appointments');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch appointments');
      throw error;
    }
  },
  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await api.patch(`/admin/appointments/${id}`, appointmentData);
      toast.success('Appointment updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update appointment');
      throw error;
    }
  },
  deleteAppointment: async (id) => {
    try {
      await api.delete(`/admin/appointments/${id}`);
      toast.success('Appointment deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete appointment');
      throw error;
    }
  },
};

export default adminApi;