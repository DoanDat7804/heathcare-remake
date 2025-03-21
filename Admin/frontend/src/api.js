import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const login = (data) => axios.post(`${API_URL}/auth/login`, data);
export const register = (data) => axios.post(`${API_URL}/auth/register`, data);
export const updateProfile = (data) => axios.post(`${API_URL}/auth/updateProfile`, data);
