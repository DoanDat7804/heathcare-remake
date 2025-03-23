import axios from './index';

const appointmentApi = {
  createAppointment: (data) => {
    return axios.post('/appointments', data);
  },

  getMyAppointments: () => {
    return axios.get('/appointments/me');
  },

  confirmAppointment: (id) => {
    return axios.put(`/appointments/${id}/confirm`);
  }
};

export default appointmentApi;
