import React, { useState, useEffect } from 'react';
import  appointmentApi  from '../apis/appointmentsApi'; // Đảm bảo đường dẫn đúng
import { toast } from 'react-toastify';

// Định nghĩa interface cho Appointment dựa trên schema backend
interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  serviceType: string;
  date: string; // Hoặc Date nếu backend trả về định dạng Date
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  note?: string;
}

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentApi.getAllAppointments();
        setAppointments(response.data as Appointment[]);
      } catch (err: any) {
        toast.error('Lỗi khi tải danh sách lịch hẹn: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa lịch hẹn này?')) {
      try {
        await appointmentApi.deleteAppointment(id);
        setAppointments(appointments.filter(appointment => appointment._id !== id));
        toast.success('Xóa lịch hẹn thành công!');
      } catch (err: any) {
        toast.error('Lỗi khi xóa lịch hẹn: ' + err.message);
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;

  const filteredAppointments = appointments.filter(appointment =>
    appointment.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(appointment.date).toLocaleDateString().includes(searchTerm)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Lịch Hẹn</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo ngày hoặc dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-1/3"
          />
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">Ngày</th>
              <th className="p-3 text-left">Thời gian</th>
              <th className="p-3 text-left">Dịch vụ</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Ghi chú</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map(appointment => (
              <tr key={appointment._id} className="border-t">
                <td className="p-3">{new Date(appointment.date).toLocaleDateString()}</td>
                <td className="p-3">{appointment.timeSlot}</td>
                <td className="p-3">{appointment.serviceType}</td>
                <td className="p-3">
                  <span className={appointment.status === 'pending' ? "text-yellow-600" : "text-green-600"}>
                    {appointment.status}
                  </span>
                </td>
                <td className="p-3">{appointment.note || 'Không có'}</td>
                <td className="p-3">
                  <button className="text-blue-600 mr-2">Sửa</button>
                  <button onClick={() => handleDeleteAppointment(appointment._id)} className="text-red-600">Hủy</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentManagement;