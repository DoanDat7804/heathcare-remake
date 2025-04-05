import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../apis/appointmentsAPI';
import { adminApi } from '../apis/adminApi'; // Import adminApi để lấy danh sách users và doctors
import { toast } from 'react-toastify';

// Định nghĩa interface cho Appointment
interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  status: string;
  note?: string;
}

// Định nghĩa interface cho Doctor và User
interface Doctor {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  name: string;
}

// Định nghĩa interface cho dữ liệu form tạo lịch hẹn
interface CreateAppointmentForm {
  patientId: string; // Thay doctorId bằng patientId để rõ ràng hơn
  doctorId: string;
  serviceType: string;
  date: string; // ISO 8601 string
  timeSlot: string;
  symptoms?: string[];
}

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<CreateAppointmentForm>({
    patientId: '',
    doctorId: '',
    serviceType: '',
    date: '',
    timeSlot: '',
    symptoms: [],
  });

  // Token giả định (thay bằng token thực tế)
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ik5oYXRsaW5oQGdtYWlsLmNvbSIsInN1YiI6IjY3ZTkzZmVlMDkxNzMyZDZmYmRjNmUxOCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0MzczMTQzNSwiZXhwIjoxNzQzNzM1MDM1fQ.SkhCj1XeklvZ_tUUIui9wRBGl_3NIEsyUUynfepzqfg';

  // Lấy danh sách bác sĩ, người dùng và lịch hẹn khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsData, doctorsData, usersData] = await Promise.all([
          appointmentApi.getAll(token),
          adminApi.getAllDoctors(token),
          adminApi.getAllUsers(token),
        ]);
        setAppointments(appointmentsData || []);
        setDoctors(doctorsData || []);
        setUsers(usersData || []);
      } catch (err: any) {
        toast.error('Lỗi khi tải dữ liệu: ' + err.message);
        setAppointments([]);
        setDoctors([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa lịch hẹn này?')) {
      try {
        await appointmentApi.delete(id, token);
        setAppointments(appointments.filter((appointment) => appointment._id !== id));
        toast.success('Xóa lịch hẹn thành công!');
      } catch (err: any) {
        toast.error('Lỗi khi xóa lịch hẹn: ' + err.message);
      }
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !formData.serviceType || !formData.date || !formData.timeSlot) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    try {
      const newAppointment = await appointmentApi.create(formData, token);
      setAppointments([...appointments, newAppointment]);
      toast.success('Tạo lịch hẹn thành công!');
      setFormData({ patientId: '', doctorId: '', serviceType: '', date: '', timeSlot: '', symptoms: [] });
      setShowCreateForm(false);
    } catch (err: any) {
      toast.error('Lỗi khi tạo lịch hẹn: ' + err.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Đang tải...</div>;

  const filteredAppointments = Array.isArray(appointments)
    ? appointments.filter((appointment) => {
        const searchLower = searchTerm.toLowerCase();
        const doctorName = doctors.find((d) => d._id === appointment.doctorId)?.name || '';
        const patientName = users.find((u) => u._id === appointment.patientId)?.name || '';
        return (
          doctorName.toLowerCase().includes(searchLower) ||
          patientName.toLowerCase().includes(searchLower) ||
          appointment.serviceType.toLowerCase().includes(searchLower) ||
          new Date(appointment.date).toLocaleDateString().includes(searchLower) ||
          appointment.timeSlot.toLowerCase().includes(searchLower) ||
          appointment.status.toLowerCase().includes(searchLower)
        );
      })
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Lịch Hẹn</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo bác sĩ, bệnh nhân, dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-1/3"
          />
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm Lịch Hẹn
          </button>
        </div>

        {/* Form tạo lịch hẹn */}
        {showCreateForm && (
          <form onSubmit={handleCreateAppointment} className="mb-4 p-4 border rounded">
            <h2 className="text-lg font-semibold mb-2">Thêm Lịch Hẹn</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Bệnh nhân</label>
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  className="border p-2 w-full rounded"
                  required
                >
                  <option value="">Chọn bệnh nhân</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Bác sĩ</label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  className="border p-2 w-full rounded"
                  required
                >
                  <option value="">Chọn bác sĩ</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Loại dịch vụ</label>
                <input
                  type="text"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="border p-2 w-full rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Ngày</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="border p-2 w-full rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Khung giờ</label>
                <input
                  type="text"
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  className="border p-2 w-full rounded"
                  placeholder="VD: 09:00-10:00"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="mt-4 ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Hủy
            </button>
          </form>
        )}

        {/* Bảng danh sách lịch hẹn */}
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">Bệnh nhân</th>
              <th className="p-3 text-left">Bác sĩ</th>
              <th className="p-3 text-left">Ngày</th>
              <th className="p-3 text-left">Thời gian</th>
              <th className="p-3 text-left">Dịch vụ</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Ghi chú</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => {
              const doctorName = doctors.find((d) => d._id === appointment.doctorId)?.name || 'Unknown';
              const patientName = users.find((u) => u._id === appointment.patientId)?.name || 'Unknown';
              return (
                <tr key={appointment._id} className="border-t">
                  <td className="p-3">{patientName}</td>
                  <td className="p-3">{doctorName}</td>
                  <td className="p-3">{new Date(appointment.date).toLocaleDateString()}</td>
                  <td className="p-3">{appointment.timeSlot}</td>
                  <td className="p-3">{appointment.serviceType}</td>
                  <td className="p-3">
                    <span
                      className={
                        appointment.status === 'pending'
                          ? 'text-yellow-600'
                          : appointment.status === 'confirmed'
                          ? 'text-green-600'
                          : appointment.status === 'cancelled'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="p-3">{appointment.note || 'Không có'}</td>
                  <td className="p-3">
                    <button className="text-blue-600 mr-2 hover:underline">Sửa</button>
                    <button
                      onClick={() => handleDeleteAppointment(appointment._id)}
                      className="text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentManagement;