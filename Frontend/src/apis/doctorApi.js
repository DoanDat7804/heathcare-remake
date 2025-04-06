// doctorApi.js
import api from './index';

export const doctorApi = {
  getAllDoctors: (config = {}) => api.get('/doctors', config),
  getDoctorById: (id, config = {}) => api.get(`/doctors/${id}`, config),
  createDoctor: (doctorData, config = {}) => api.post('/doctors', doctorData, config),
  updateDoctor: (id, doctorData, config = {}) => api.patch(`/doctors/${id}`, doctorData, config),
  deleteDoctor: (id, config = {}) => api.delete(`/doctors/${id}`, config),
  getAppointments: (config = {}) => api.get('/appointments/me', config), 
  getBusyTimes: (config = {}) => api.get('/doctors/me/busy-times', config),
  createBusyTime: (busyTimeData, config = {}) => api.post('/doctors/me/busy-times', busyTimeData, config),
  deleteBusyTime: (id, config = {}) => api.delete(`/doctors/me/busy-times/${id}`, config),
};