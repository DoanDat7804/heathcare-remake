import api from './index';

export const newsApi = {
  getAllNews: () => api.get('/news'),
  getNewsById: (id) => api.get(`/news/${id}`),
  createNews: (newsData) => api.post('/news', newsData),
  updateNews: (id, newsData) => api.patch(`/news/${id}`, newsData),
  deleteNews: (id) => api.delete(`/news/${id}`),
};