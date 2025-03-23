import axios from './index';

const notificationApi = {
  createNotification: (data) => {
    return axios.post('/notifications', data);
  },

  getAllNotifications: () => {
    return axios.get('/notifications');
  },

  getNotificationById: (id) => {
    return axios.get(`/notifications/${id}`);
  },

  updateNotification: (id, data) => {
    return axios.patch(`/notifications/${id}`, data);
  },

  deleteNotification: (id) => {
    return axios.delete(`/notifications/${id}`);
  }
};

export default notificationApi;
