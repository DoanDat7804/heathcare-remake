import axios from './index';

const medicalRecordApi = {
  createMedicalRecord: (data) => {
    return axios.post('/medical-records', data);
  },

  getAllMedicalRecords: () => {
    return axios.get('/medical-records');
  },

  getMedicalRecordById: (id) => {
    return axios.get(`/medical-records/${id}`);
  },

  updateMedicalRecord: (id, data) => {
    return axios.patch(`/medical-records/${id}`, data);
  },

  deleteMedicalRecord: (id) => {
    return axios.delete(`/medical-records/${id}`);
  }
};

export default medicalRecordApi;
