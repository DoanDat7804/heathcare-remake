// Định nghĩa các type dựa trên DTO từ backend
export interface AppointmentResponse {
    _id: string;
    patientId: string;
    doctorId: string;
    serviceType: string;
    date: string;
    timeSlot: string;
    status: string;
    note?: string;
    priority?: number;
    isPrepaid?: boolean;
    confirmationDate?: string;
    rejectionReason?: string;
    doctorNote?: string;
    notificationSent?: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateAppointmentRequest {
    doctorId: string;
    serviceType: string;
    date: string; 
    timeSlot: string;
    symptoms?: string[];
  }
  
  export interface UpdateAppointmentRequest {
    serviceType?: string;
    date?: string; // ISO 8601 string
    timeSlot?: string;
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
    note?: string;
    priority?: number;
    isPrepaid?: boolean;
    confirmationDate?: string; // ISO 8601 string
    rejectionReason?: string;
    doctorNote?: string;
    notificationSent?: boolean;
  }
  
  // Cấu hình base URL của backend
  const BASE_URL = 'http://localhost:3000'; // Thay đổi theo URL backend của bạn
  
  // Hàm xử lý lỗi
  class ApiError extends Error {
    constructor(public status: number, message: string) {
      super(message);
      this.name = 'ApiError';
    }
  }
  
  // Hàm gọi API chung
  async function apiFetch<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    token?: string
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new ApiError(response.status, data.message || 'Đã xảy ra lỗi');
    }
  
    return data as T;
  }
  
  // API Services
  export const appointmentApi = {
    // Tạo lịch hẹn mới
    create: async (data: CreateAppointmentRequest, token: string): Promise<AppointmentResponse> => {
      return apiFetch<AppointmentResponse>('/appointments', 'POST', data, token);
    },
  
    // Lấy danh sách lịch hẹn của người dùng hiện tại
    getMyAppointments: async (token: string): Promise<AppointmentResponse[]> => {
      return apiFetch<AppointmentResponse[]>('/appointments/me', 'GET', undefined, token);
    },
  
    // Xác nhận lịch hẹn
    confirm: async (id: string, token: string): Promise<AppointmentResponse> => {
      return apiFetch<AppointmentResponse>(`/appointments/${id}/confirm`, 'PUT', undefined, token);
    },
  
    // Lấy tất cả lịch hẹn (cho admin)
    getAll: async (token: string): Promise<AppointmentResponse[]> => {
      return apiFetch<AppointmentResponse[]>('/appointments', 'GET', undefined, token);
    },
  
    // Cập nhật lịch hẹn (cho admin)
    update: async (
      id: string,
      data: UpdateAppointmentRequest,
      token: string
    ): Promise<AppointmentResponse> => {
      return apiFetch<AppointmentResponse>(`/appointments/${id}`, 'PUT', data, token);
    },
  
    // Xóa lịch hẹn (cho admin)
    delete: async (id: string, token: string): Promise<void> => {
      return apiFetch<void>(`/appointments/${id}`, 'DELETE', undefined, token);
    },
  };
  
  // Ví dụ sử dụng (có thể xóa khi tích hợp vào dự án)
  async function example() {
    const token = 'your-jwt-token';
  
    try {
      // Tạo lịch hẹn
      const newAppointment = await appointmentApi.create(
        {
          doctorId: 'doctor123',
          serviceType: 'Khám tổng quát',
          date: '2025-04-10T00:00:00.000Z',
          timeSlot: '09:00-10:00',
          symptoms: ['ho', 'sốt'],
        },
        token
      );
      console.log('Lịch hẹn mới:', newAppointment);
  
      // Lấy danh sách lịch hẹn của tôi
      const myAppointments = await appointmentApi.getMyAppointments(token);
      console.log('Danh sách lịch hẹn:', myAppointments);
  
      // Xác nhận lịch hẹn
      const confirmedAppointment = await appointmentApi.confirm('appointment123', token);
      console.log('Lịch hẹn đã xác nhận:', confirmedAppointment);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Lỗi ${error.status}: ${error.message}`);
      } else {
        console.error('Lỗi không xác định:', error);
      }
    }
  }