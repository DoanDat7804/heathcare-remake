import api from './index';

export const authApi = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  adminLogin: (email, password) =>
    api.post('/auth/admin/login', { email, password }),

  register: (userData) =>
    api.post('/auth/register', userData),
};