import api from './index';

export const doctorApi = {
  getAllDoctors: () => api.get('/doctors'),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  createDoctor: (doctorData) => api.post('/doctors', doctorData),
  updateDoctor: (id, doctorData) => api.patch(`/doctors/${id}`, doctorData),
  deleteDoctor: (id) => api.delete(`/doctors/${id}`),
  getAppointments: () => api.get('/doctors/me/appointments'),
  getBusyTimes: () => api.get('/doctors/me/busy-times'),
  createBusyTime: (busyTimeData) => api.post('/doctors/me/busy-times', busyTimeData),
  deleteBusyTime: (id) => api.delete(`/doctors/me/busy-times/${id}`),
};