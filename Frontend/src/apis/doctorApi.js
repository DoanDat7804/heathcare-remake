import api from './index'; // Giả sử axios đã được cấu hình

const doctorApi = {
  getAllDoctors: (config = {}) => api.get('/doctors', config),
  getDoctorById: (id, config = {}) => api.get(`/doctors/${id}`, config),
  createDoctor: (doctorData, config = {}) => api.post('/doctors', doctorData, config),
  updateDoctor: (id, doctorData, config = {}) => api.patch(`/doctors/${id}`, doctorData, config),
  deleteDoctor: (id, config = {}) => api.delete(`/doctors/${id}`, config),
};

export { doctorApi };