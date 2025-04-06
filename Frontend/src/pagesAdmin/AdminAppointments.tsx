import React, { useState, useEffect } from 'react';
import { adminApi } from '../apis/adminApi';
import { toast } from 'react-toastify';

interface Doctor { _id: string; name: string; specialty?: string; }
interface User { _id: string; name: string; role?: string; }
type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
interface AppointmentResponse { _id: string; patientId: string; doctorId: string; serviceType: string; date: string; timeSlot: string; status: AppointmentStatus; note?: string; }
interface CreateAppointmentRequest { patientId: string; doctorId: string; serviceType: string; date: string; timeSlot: string; symptoms: string[]; note?: string; }
interface UpdateAppointmentRequest { doctorId?: string; serviceType?: string; date?: string; timeSlot?: string; status?: AppointmentStatus; note?: string; }

const specialtyToServiceMap: { [key: string]: string } = {
  'Đa Khoa': 'Dịch vụ khám sức khỏe tổng quát',
  'Nhi Khoa': 'Khám và chăm sóc sức khỏe cho trẻ em',
  'Nội Khoa': 'Khám bệnh nội khoa',
  'Ngoại Khoa': 'Khám và điều trị ngoại khoa',
  'Sản Phụ Khoa': 'Khám và chăm sóc sức khỏe bà mẹ và trẻ sơ sinh',
  'Tim Mạch': 'Khám và điều trị các bệnh lý tim mạch',
};

const normalizeSpecialty = (raw: string): string => {
  const lower = raw.toLowerCase().trim();
  return lower.includes('tim mạch') || lower.includes('cardiology') ? 'Tim Mạch' : 
         lower.includes('đa khoa') ? 'Đa Khoa' : 
         lower.includes('nhi khoa') ? 'Nhi Khoa' : 
         lower.includes('nội khoa') ? 'Nội Khoa' : 
         lower.includes('ngoại khoa') ? 'Ngoại Khoa' : 
         lower.includes('sản phụ khoa') ? 'Sản Phụ Khoa' : 
         raw.charAt(0).toUpperCase() + raw.slice(1);
};

const allTimeSlots = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'];

const ITEMS_PER_PAGE = 5; // Số lượng lịch hẹn mỗi trang

const AdminAppointment: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<string>(''); // State để theo dõi dịch vụ được chọn
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editAppointment, setEditAppointment] = useState<AppointmentResponse | null>(null);
  const [createFormData, setCreateFormData] = useState<CreateAppointmentRequest>({ patientId: '', doctorId: '', serviceType: '', date: '', timeSlot: '', symptoms: [], note: '' });
  const [editFormData, setEditFormData] = useState<UpdateAppointmentRequest>({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null); // State để theo dõi hàng đang mở rộng
  const [currentPage, setCurrentPage] = useState(1); // State để theo dõi trang hiện tại

  const token = localStorage.getItem('adminToken') || '';

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return toast.error('Vui lòng đăng nhập để quản lý lịch hẹn');
      try {
        setLoading(true);
        const [appointmentsData, doctorsData, usersData] = await Promise.all([
          adminApi.getAllAppointments(token),
          adminApi.getAllDoctors(token),
          adminApi.getAllUsers(token),
        ]);

        const normalizedAppointments = Array.isArray(appointmentsData) ? appointmentsData.map(appt => ({
          _id: appt._id,
          patientId: appt.patientId?._id || appt.patientId,
          doctorId: appt.doctorId?._id || appt.doctorId,
          serviceType: appt.serviceType,
          date: appt.date,
          timeSlot: appt.timeSlot,
          status: appt.status as AppointmentStatus,
          note: appt.note,
        })) : [];

        normalizedAppointments.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (dateA.getTime() === dateB.getTime()) {
            const timeA = a.timeSlot.split('-')[0];
            const timeB = b.timeSlot.split('-')[0];
            return timeA.localeCompare(timeB);
          }
          return dateA.getTime() - dateB.getTime();
        });

        setAppointments(normalizedAppointments);
        setDoctors(Array.isArray(doctorsData) ? doctorsData.map(doc => ({
          _id: doc._id || doc.id,
          name: doc.name || 'Unnamed',
          specialty: normalizeSpecialty(doc.specialty || 'Chưa xác định'),
        })) : []);
        setUsers(Array.isArray(usersData) ? usersData.filter(u => u.role === 'patient').map(u => ({
          _id: u._id || u.id,
          name: u.name || 'Unnamed',
          role: u.role || 'Chưa xác định',
        })) : []);

        if (!doctors.length) toast.warn('Không tìm thấy bác sĩ nào');
        if (!users.length) toast.warn('Không tìm thấy người dùng nào');
        if (!appointments.length) toast.warn('Không có lịch hẹn nào');
      } catch (err) {
        toast.error('Lỗi khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
        setAppointments([]); setDoctors([]); setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleDeleteAppointment = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa lịch hẹn này?')) return;
    try {
      await adminApi.deleteAppointment(id, token);
      setAppointments(appointments.filter(a => a._id !== id));
      toast.success('Xóa lịch hẹn thành công!');
      const filtered = filteredAppointments.filter(a => a._id !== id);
      const totalPagesAfterDelete = Math.ceil(filtered.length / ITEMS_PER_PAGE);
      if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
        setCurrentPage(totalPagesAfterDelete);
      }
    } catch (err) {
      toast.error('Lỗi khi xóa lịch hẹn: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createFormData.patientId || !createFormData.doctorId || !createFormData.serviceType || !createFormData.date || !createFormData.timeSlot) {
      return toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
    }

    const isTimeSlotTaken = appointments.some(a => 
      a.doctorId === createFormData.doctorId && 
      a.date.split('T')[0] === createFormData.date && 
      a.timeSlot === createFormData.timeSlot && 
      a.status !== 'cancelled' && a.status !== 'rejected'
    );
    if (isTimeSlotTaken) {
      return toast.error('Khung giờ này đã được đặt cho bác sĩ này trong ngày này!');
    }

    try {
      const newAppointment = await adminApi.createAppointment(createFormData, token);
      setAppointments([...appointments, newAppointment].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() === dateB.getTime()) {
          const timeA = a.timeSlot.split('-')[0];
          const timeB = b.timeSlot.split('-')[0];
          return timeA.localeCompare(timeB);
        }
        return dateA.getTime() - dateB.getTime();
      }));
      toast.success('Tạo lịch hẹn thành công!');
      setCreateFormData({ patientId: '', doctorId: '', serviceType: '', date: '', timeSlot: '', symptoms: [], note: '' });
      setShowCreateForm(false);
      const totalPages = Math.ceil((appointments.length + 1) / ITEMS_PER_PAGE);
      setCurrentPage(totalPages);
    } catch (err) {
      toast.error('Lỗi khi tạo lịch hẹn: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEditAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAppointment) return;

    if (!editFormData.date || !editFormData.timeSlot) {
      return toast.error('Ngày và khung giờ là bắt buộc!');
    }

    const doctorId = editFormData.doctorId || editAppointment.doctorId;
    const selectedDate = editFormData.date;
    const selectedTimeSlot = editFormData.timeSlot;

    const isTimeSlotTaken = appointments.some(a => 
      a.doctorId === doctorId && 
      a.date.split('T')[0] === selectedDate && 
      a.timeSlot === selectedTimeSlot && 
      a._id !== editAppointment._id && 
      a.status !== 'cancelled' && a.status !== 'rejected'
    );

    if (isTimeSlotTaken) {
      toast.error('Khung giờ này đã được đặt cho bác sĩ này trong ngày này!');
      return;
    }

    const updatedData: UpdateAppointmentRequest = {
      doctorId: doctorId,
      serviceType: editFormData.serviceType || editAppointment.serviceType,
      date: new Date(selectedDate).toISOString(),
      timeSlot: selectedTimeSlot,
      status: editFormData.status || editAppointment.status,
      note: editFormData.note || editAppointment.note,
    };

    try {
      const updated = await adminApi.updateAppointment(editAppointment._id, updatedData, token);
      setAppointments(appointments.map(a => a._id === updated._id ? updated : a).sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() === dateB.getTime()) {
          const timeA = a.timeSlot.split('-')[0];
          const timeB = b.timeSlot.split('-')[0];
          return timeA.localeCompare(timeB);
        }
        return dateA.getTime() - dateB.getTime();
      }));
      toast.success('Cập nhật lịch hẹn thành công!');
      setShowEditForm(false);
      setEditAppointment(null);
      setEditFormData({});
    } catch (err) {
      console.error('Lỗi từ frontend:', err);
      toast.error('Lỗi khi cập nhật lịch hẹn: ' + (err.message || 'Không xác định'));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditFormData(prev => ({ ...prev, [name]: name === 'status' ? value as AppointmentStatus : value }));
      if (name === 'doctorId' || name === 'date') {
        const doctor = doctors.find(d => d._id === (name === 'doctorId' ? value : editFormData.doctorId || editAppointment?.doctorId));
        if (doctor && name === 'doctorId') {
          const serviceType = specialtyToServiceMap[doctor.specialty] || 'Dịch vụ chưa xác định';
          setEditFormData(prev => ({ ...prev, serviceType, timeSlot: '' }));
        } else if (name === 'date') {
          setEditFormData(prev => ({ ...prev, timeSlot: '' }));
        }
      }
    } else {
      setCreateFormData(prev => ({ ...prev, [name]: value }));
      if (name === 'doctorId' || name === 'date') {
        const doctor = doctors.find(d => d._id === (name === 'doctorId' ? value : createFormData.doctorId));
        if (doctor && name === 'doctorId') {
          const serviceType = specialtyToServiceMap[doctor.specialty] || 'Dịch vụ chưa xác định';
          setCreateFormData(prev => ({ ...prev, serviceType, timeSlot: '' }));
        } else if (name === 'date') {
          setCreateFormData(prev => ({ ...prev, timeSlot: '' }));
        }
      }
    }
  };

  const openEditForm = (appointment: AppointmentResponse) => {
    setEditAppointment(appointment);
    setEditFormData({
      doctorId: appointment.doctorId,
      serviceType: appointment.serviceType,
      date: appointment.date.split('T')[0],
      timeSlot: appointment.timeSlot,
      status: appointment.status,
      note: appointment.note || '',
    });
    setShowEditForm(true);
  };

  const getAvailableTimeSlots = (isEdit = false) => {
    const doctorId = isEdit ? (editFormData.doctorId || editAppointment?.doctorId) : createFormData.doctorId;
    const selectedDate = isEdit ? editFormData.date : createFormData.date;
    if (!doctorId || !selectedDate) return allTimeSlots.map(slot => ({ slot, disabled: false }));

    const bookedSlots = appointments
      .filter(a => 
        a.doctorId === doctorId && 
        a.date.split('T')[0] === selectedDate && 
        a.status !== 'cancelled' && a.status !== 'rejected' && 
        (!isEdit || a._id !== editAppointment?._id)
      )
      .map(a => a.timeSlot);

    return allTimeSlots.map(slot => ({
      slot,
      disabled: bookedSlots.includes(slot),
    }));
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (loading) return <div>Đang tải...</div>;

  // Lấy danh sách các dịch vụ duy nhất từ specialtyToServiceMap
  const availableServices = Object.values(specialtyToServiceMap);

  // Lọc danh sách theo dịch vụ và tìm kiếm
  const filteredAppointments = appointments.filter(a => {
    const doctor = doctors.find(d => d._id === a.doctorId);
    const patient = users.find(u => u._id === a.patientId);

    // Lọc theo dịch vụ
    const matchesService = selectedService ? a.serviceType === selectedService : true;

    // Tìm kiếm trên tất cả các trường
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = [
      doctor?.name || 'Unknown',
      doctor?._id || '',
      patient?.name || 'Unknown',
      patient?._id || '',
      a.serviceType || '',
      new Date(a.date).toLocaleDateString(),
      a.timeSlot || '',
      a.status || '',
      a.note || '',
    ].some(v => v.toLowerCase().includes(lowerSearchTerm));

    return matchesService && matchesSearch;
  });

  // Tính toán phân trang
  const totalItems = filteredAppointments.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setExpandedRow(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Lịch Hẹn</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between mb-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border p-2 rounded w-1/3"
            />
            <select
              value={selectedService}
              onChange={e => {
                setSelectedService(e.target.value);
                setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
              }}
              className="border p-2 rounded w-1/4"
            >
              <option value="">Tất cả dịch vụ</option>
              {availableServices.map(service => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
          <button onClick={() => setShowCreateForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Thêm Lịch Hẹn</button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateAppointment} className="mb-4 p-4 border rounded">
            <h2 className="text-lg font-semibold mb-2">Thêm Lịch Hẹn</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Bệnh nhân</label>
                <select name="patientId" value={createFormData.patientId} onChange={handleInputChange} className="border p-2 w-full rounded" required>
                  <option value="">Chọn bệnh nhân</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Bác sĩ</label>
                <select name="doctorId" value={createFormData.doctorId} onChange={handleInputChange} className="border p-2 w-full rounded" required>
                  <option value="">Chọn bác sĩ</option>
                  {doctors.map(d => (
                    <option key={d._id} value={d._id}>
                      {d.name} - Khoa {d.specialty}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Loại dịch vụ</label>
                <input type="text" name="serviceType" value={createFormData.serviceType} className="border p-2 w-full rounded bg-gray-100" readOnly />
              </div>
              <div>
                <label className="block mb-1">Ngày</label>
                <input type="date" name="date" value={createFormData.date} onChange={handleInputChange} className="border p-2 w-full rounded" required />
              </div>
              <div>
                <label className="block mb-1">Khung giờ</label>
                <select name="timeSlot" value={createFormData.timeSlot} onChange={handleInputChange} className="border p-2 w-full rounded" required disabled={!createFormData.doctorId || !createFormData.date}>
                  <option value="">Chọn khung giờ</option>
                  {getAvailableTimeSlots().map(({ slot, disabled }) => (
                    <option key={slot} value={slot} disabled={disabled}>
                      {slot} {disabled ? '(Đã đặt)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Ghi chú</label>
                <input type="text" name="note" value={createFormData.note || ''} onChange={handleInputChange} className="border p-2 w-full rounded" />
              </div>
            </div>
            <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Lưu</button>
            <button type="button" onClick={() => setShowCreateForm(false)} className="mt-4 ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Hủy</button>
          </form>
        )}

        {showEditForm && editAppointment && (
          <form onSubmit={handleEditAppointment} className="mb-4 p-4 border rounded">
            <h2 className="text-lg font-semibold mb-2">Sửa Lịch Hẹn</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Bệnh nhân</label>
                <input type="text" value={users.find(u => u._id === editAppointment.patientId)?.name || 'Unknown'} className="border p-2 w-full rounded bg-gray-100" readOnly />
              </div>
              <div>
                <label className="block mb-1">Bác sĩ</label>
                <select name="doctorId" value={editFormData.doctorId || ''} onChange={e => handleInputChange(e, true)} className="border p-2 w-full rounded" required>
                  <option value="">Chọn bác sĩ</option>
                  {doctors.map(d => (
                    <option key={d._id} value={d._id}>
                      {d.name} - Khoa {d.specialty}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Loại dịch vụ</label>
                <input type="text" name="serviceType" value={editFormData.serviceType || ''} onChange={e => handleInputChange(e, true)} className="border p-2 w-full rounded" />
              </div>
              <div>
                <label className="block mb-1">Ngày</label>
                <input type="date" name="date" value={editFormData.date || ''} onChange={e => handleInputChange(e, true)} className="border p-2 w-full rounded" required />
              </div>
              <div>
                <label className="block mb-1">Khung giờ</label>
                <select 
                  name="timeSlot" 
                  value={editFormData.timeSlot || ''} 
                  onChange={e => handleInputChange(e, true)} 
                  className="border p-2 w-full rounded" 
                  required 
                  disabled={!editFormData.doctorId || !editFormData.date}
                >
                  <option value="">Chọn khung giờ</option>
                  {getAvailableTimeSlots(true).map(({ slot, disabled }) => (
                    <option key={slot} value={slot} disabled={disabled}>
                      {slot} {disabled ? '(Đã đặt)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Trạng thái</label>
                <select name="status" value={editFormData.status || ''} onChange={e => handleInputChange(e, true)} className="border p-2 w-full rounded">
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                  <option value="rejected">Bị từ chối</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Ghi chú</label>
                <input type="text" name="note" value={editFormData.note || ''} onChange={e => handleInputChange(e, true)} className="border p-2 w-full rounded" />
              </div>
            </div>
            <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Lưu</button>
            <button type="button" onClick={() => setShowEditForm(false)} className="mt-4 ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Hủy</button>
          </form>
        )}

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
            {currentAppointments.map(a => {
              const doctor = doctors.find(d => d._id === a.doctorId);
              const patient = users.find(u => u._id === a.patientId);
              const isExpanded = expandedRow === a._id;

              return (
                <React.Fragment key={a._id}>
                  <tr
                    className="border-t cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleRow(a._id)}
                  >
                    <td className="p-3">
                      <div>
                        <span>{patient ? patient.name : 'Unknown'}</span>
                      </div>
                      {isExpanded && patient && (
                        <div className="mt-1 text-sm text-green-600 transition-all duration-300">
                          Mã bệnh nhân: {patient._id}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div>
                        <span>{doctor ? `${doctor.name} - Khoa ${doctor.specialty}` : 'Unknown'}</span>
                      </div>
                      {isExpanded && doctor && (
                        <div className="mt-1 text-sm text-green-600 transition-all duration-300">
                          Mã bác sĩ: {doctor._id}
                        </div>
                      )}
                    </td>
                    <td className="p-3">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="p-3">{a.timeSlot}</td>
                    <td className="p-3">{a.serviceType}</td>
                    <td className="p-3">
                      <span className={{
                        pending: 'text-yellow-600',
                        confirmed: 'text-green-600',
                        cancelled: 'text-red-600',
                        completed: 'text-blue-600',
                      }[a.status] || 'text-gray-600'}>{a.status}</span>
                    </td>
                    <td className="p-3">{a.note || 'Không có'}</td>
                    <td className="p-3">
                      <button onClick={(e) => { e.stopPropagation(); openEditForm(a); }} className="text-blue-600 mr-2 hover:underline">Sửa</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteAppointment(a._id); }} className="text-red-600 hover:underline">Xóa</button>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {totalItems > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Hiển thị {startIndex + 1} - {Math.min(endIndex, totalItems)} trong tổng số {totalItems} lịch hẹn
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointment;