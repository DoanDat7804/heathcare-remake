import api from './index';

export const adminApi = {
  
  // Quản lý Users
  getAllUsers: () => api.get('/admin/users'),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (id, userData) => api.patch(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Quản lý Doctors
  getAllDoctors: () => api.get('/admin/doctors'),
  createDoctor: (doctorData) => api.post('/admin/doctors', doctorData),
  updateDoctor: (id, doctorData) => api.patch(`/admin/doctors/${id}`, doctorData),
  deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`),

  // Quản lý News
  getAllNews: () => api.get('/admin/news'),
  createNews: (newsData) => api.post('/admin/news', newsData),
  updateNews: (id, newsData) => api.patch(`/admin/news/${id}`, newsData),
  deleteNews: (id) => api.delete(`/admin/news/${id}`),
};

export default adminApi;