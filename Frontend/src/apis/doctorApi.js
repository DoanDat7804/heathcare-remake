// doctorApi.js
import api from './index';
import { toast } from 'react-toastify';
import { handleError } from './errorHandler';

export const doctorApi = {
  getAllDoctors: async () => {
    try {
      const response = await api.get('/doctors');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch doctors');
    }
  },
  getDoctorById: async (id) => {
    try {
      const response = await api.get(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch doctor details');
    }
  },
  createDoctor: async (doctorData) => {
    try {
      const response = await api.post('/doctors', doctorData);
      toast.success('Doctor created successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to create doctor');
    }
  },
  updateDoctor: async (id, doctorData) => {
    try {
      const response = await api.patch(`/doctors/${id}`, doctorData);
      toast.success('Doctor updated successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to update doctor');
    }
  },
  deleteDoctor: async (id) => {
    try {
      const response = await api.delete(`/doctors/${id}`);
      toast.success('Doctor deleted successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to delete doctor');
    }
  },
};

export default doctorApi;
