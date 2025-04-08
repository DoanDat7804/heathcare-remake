// doctorApi.js
import api from './index';

const doctorApi = {
  getAllDoctors: (config = {}) => api.get('/doctors', config),
  getDoctorById: (id, config = {}) => api.get(`/doctors/${id}`, config),
  createDoctor: (doctorData, config = {}) => api.post('/doctors', doctorData, config),
  updateDoctor: (id, doctorData, config = {}) => api.patch(`/doctors/${id}`, doctorData, config),
  deleteDoctor: (id, config = {}) => api.delete(`/doctors/${id}`, config),
  getAppointments: (config = {}) => api.get('/appointments/me', config),
  // Thêm hàm updateAppointment vào doctorApi
  updateAppointment: (id, data, config) =>
    api.put(`/appointments/${id}/note`, { note: data.note }, config),
};

export { doctorApi };