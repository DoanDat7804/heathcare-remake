// src/apis/appointmentsAPI.ts
import api from './api';

export interface AppointmentResponse {
  _id: string;
  patientId: string; // Thêm để khớp với backend
  doctorId: string;
  serviceType: string; // Đổi từ service sang serviceType
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'; // Thêm 'rejected' từ backend
  note?: string;
  symptoms?: string[]; // Thêm từ backend
  priority?: number; // Thêm từ backend
  isPrepaid?: boolean; // Thêm từ backend
  confirmationDate?: string; // Thêm từ backend
  rejectionReason?: string; // Thêm từ backend
  doctorNote?: string; // Thêm từ backend
  notificationSent?: boolean; // Thêm từ backend
  createdAt?: string; // Thêm từ backend
  updatedAt?: string; // Thêm từ backend
}

export interface CreateAppointmentRequest {
  doctorId: string;
  serviceType: string; // Đổi từ service sang serviceType
  date: string;
  timeSlot: string;
  symptoms?: string[]; // Thêm tùy chọn từ backend
  note?: string; // Thêm từ patientInfo
}

export const appointmentApi = {
  getMyAppointments: async (token: string) => {
    try {
      const response = await api.get('/users/me/appointments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as AppointmentResponse[];
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  createAppointment: async (data: CreateAppointmentRequest, token: string) => {
    try {
      const response = await api.post('/appointments', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as AppointmentResponse;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};