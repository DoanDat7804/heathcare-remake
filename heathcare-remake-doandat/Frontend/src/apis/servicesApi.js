import axios from './index';

const serviceApi = {
  createService: (data) => {
    return axios.post('/services', data);
  },

  getAllServices: () => {
    return axios.get('/services');
  },

  getServiceById: (id) => {
    return axios.get(`/services/${id}`);
  },

  updateService: (id, data) => {
    return axios.patch(`/services/${id}`, data);
  },

  deleteService: (id) => {
    return axios.delete(`/services/${id}`);
  }
};

export default serviceApi;
