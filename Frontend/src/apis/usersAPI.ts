// src/apis/usersAPI.ts
import api from './api'; // Instance axios từ api.js

// Định nghĩa type (giả sử đã có từ code trước)
export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    district: string;
    city: string;
    country: string;
  };
  healthInfo?: {
    bloodType?: string;
    allergies?: string[];
    currentMedications?: string[];
  };
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    district: string;
    city: string;
    country: string;
  };
}

export const usersApi = {
  getById: async (id: string, token: string) => {
    try {
      const response = await api.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Token sẽ được thêm tự động bởi interceptor, nhưng để rõ ràng, có thể giữ ở đây
        },
      });
      return response.data as UserResponse;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  update: async (id: string, data: UpdateUserRequest, token: string) => {
    try {
      const response = await api.put(`/users/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as UserResponse;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};