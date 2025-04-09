// src/apis/doctorApi.js
import api from './index';

const doctorApi = {
  getAllDoctors: (config = {}) => api.get('/doctors', config),
  getDoctorById: (id, config = {}) => api.get(`/doctors/${id}`, config),
  createDoctor: (doctorData, config = {}) => api.post('/doctors', doctorData, config),
  updateDoctor: (id, doctorData, config = {}) => api.patch(`/doctors/${id}`, doctorData, config),
  deleteDoctor: (id, config = {}) => api.delete(`/doctors/${id}`, config),
  // Sửa getAppointments để gọi đúng endpoint
  getAppointments: (config = {}) => api.get('/appointments/me', config),
  getBusyTimes: (config = {}) => api.get('/doctors/busy-times', config),
  createBusyTime: (busyTimeData, config = {}) => api.post('/doctors/busy-times', busyTimeData, config),
  deleteBusyTime: (id, config = {}) => api.delete(`/doctors/busy-times/${id}`, config),
};

export { doctorApi };