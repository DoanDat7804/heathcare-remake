
// Đây là file mô phỏng API để thử nghiệm frontend
// Trong ứng dụng thực tế, bạn sẽ thay thế bằng các cuộc gọi đến backend thực

// Mô phỏng độ trễ mạng
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dữ liệu mô phỏng
const mockDoctors = [
  { id: 1, name: 'TS. Nguyễn Văn A', specialty: 'Tim mạch', avatar: '/placeholder.svg', available: true },
  { id: 2, name: 'PGS. TS. Trần Thị B', specialty: 'Nhi khoa', avatar: '/placeholder.svg', available: true },
  { id: 3, name: 'BS. CKI. Phạm Văn C', specialty: 'Nội khoa', avatar: '/placeholder.svg', available: true },
  { id: 4, name: 'ThS. BS. Lê Thị D', specialty: 'Sản phụ khoa', avatar: '/placeholder.svg', available: false },
];

const mockServices = [
  { id: 1, name: 'Khám tổng quát', description: 'Kiểm tra sức khỏe toàn diện' },
  { id: 2, name: 'Khám nội khoa', description: 'Chẩn đoán và điều trị các bệnh nội khoa' },
  { id: 3, name: 'Khám nhi', description: 'Chăm sóc sức khỏe trẻ em' },
  { id: 4, name: 'Khám sản phụ khoa', description: 'Chăm sóc sức khỏe phụ nữ' },
  { id: 5, name: 'Khám tim mạch', description: 'Chẩn đoán và điều trị bệnh tim mạch' },
];

const mockAppointments = [
  { id: 1, patientName: 'Nguyễn Văn X', service: 'Khám tổng quát', date: '2023-06-15', time: '09:00', status: 'confirmed' },
  { id: 2, patientName: 'Trần Thị Y', service: 'Khám nhi', date: '2023-06-16', time: '14:00', status: 'pending' },
];

// API functions
export const api = {
  // Auth
  login: async (email: string, password: string) => {
    await delay(1000);
    
    // Mô phỏng kiểm tra đăng nhập
    if (email && password) {
      return { 
        success: true, 
        user: { 
          id: 1, 
          name: 'Nguyễn Văn A', 
          email, 
          role: email.includes('admin') ? 'admin' : 'patient' 
        },
        token: 'fake-jwt-token'
      };
    }
    
    throw new Error('Email hoặc mật khẩu không chính xác');
  },
  
  register: async (userData: any) => {
    await delay(1000);
    return { success: true, user: { id: 999, ...userData } };
  },
  
  // Doctors
  getDoctors: async () => {
    await delay(800);
    return mockDoctors;
  },
  
  // Services
  getServices: async () => {
    await delay(600);
    return mockServices;
  },
  
  // Appointments
  createAppointment: async (appointmentData: any) => {
    await delay(1200);
    const newAppointment = {
      id: Math.floor(Math.random() * 1000),
      ...appointmentData,
      status: 'pending'
    };
    return { success: true, appointment: newAppointment };
  },
  
  getAppointments: async () => {
    await delay(800);
    return mockAppointments;
  },
  
  // Timeslots
  getAvailableTimeslots: async (date: string, doctorId?: number) => {
    await delay(600);
    
    // Generate random availability
    const times = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
    return times.map(time => ({
      time,
      available: Math.random() > 0.3 // 70% khả năng có sẵn
    }));
  }
};
