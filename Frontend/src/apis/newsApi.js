// newsApi.js
import api from './index';
import { toast } from 'react-toastify';
import { handleError } from './errorHandler';

export const newsApi = {
  getAllNews: async () => {
    try {
      const response = await api.get('/news');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch news');
    }
  },
  getNewsById: async (id) => {
    try {
      const response = await api.get(`/news/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch news details');
    }
  },
  createNews: async (newsData) => {
    try {
      const response = await api.post('/news', newsData);
      toast.success('News created successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to create news');
    }
  },
  updateNews: async (id, newsData) => {
    try {
      const response = await api.patch(`/news/${id}`, newsData);
      toast.success('News updated successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to update news');
    }
  },
  deleteNews: async (id) => {
    try {
      const response = await api.delete(`/news/${id}`);
      toast.success('News deleted successfully');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to delete news');
    }
  },
};

export default newsApi;
