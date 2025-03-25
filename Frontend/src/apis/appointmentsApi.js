import axios from './index';

const appointmentApi = {
  // API cho patient và doctor (giữ nguyên)
  createAppointment: (data) => {
    return axios.post('/appointments', data);
  },

  getMyAppointments: () => {
    return axios.get('/appointments/me');
  },

  confirmAppointment: (id) => {
    return axios.put(`/appointments/${id}/confirm`);
  },

  // API mới cho admin
  getAllAppointments: () => {
    return axios.get('/admin/appointments');
  },

  updateAppointment: (id, data) => {
    return axios.patch(`/admin/appointments/${id}`, data);
  },

  deleteAppointment: (id) => {
    return axios.delete(`/admin/appointments/${id}`);
  }
};

export default appointmentApi;