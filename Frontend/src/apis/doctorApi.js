// doctorApi.js
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const doctorApi = {
  getAllDoctors: async () => {
    const response = await axios.get(`${API_URL}/doctors`); // Sửa api thành axios
    return response;
  },

  getDoctorById: (doctorId, config) => {
    return axios.get(`${API_URL}/doctors/${doctorId}`, config);
  },

  getAppointments: (config) => {
    return axios.get(`${API_URL}/appointments/me`, config);
  },

  getBusyTimes: (config) => {
    return axios.get(`${API_URL}/doctors/me/busy-times`, config);
  },

  createBusyTime: (busyTimeData, config) => {
    return axios.post(`${API_URL}/doctors/me/busy-times`, busyTimeData, config);
  },

  deleteBusyTime: (busyTimeId, config) => {
    return axios.delete(`${API_URL}/doctors/me/busy-times/${busyTimeId}`, config);
  },

  updateAppointment: (appointmentId, data, config) => {
    return axios.put(`${API_URL}/appointments/${appointmentId}/note`, { note: data.note }, config);
  },
};

export { doctorApi };