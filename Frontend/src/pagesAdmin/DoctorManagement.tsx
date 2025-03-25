import React, { useState, useEffect } from 'react';
import { adminApi } from '../apis/adminApi'; // Đảm bảo đường dẫn đúng
import { toast } from 'react-toastify';

// Định nghĩa interface cho Doctor dựa trên schema backend
interface Doctor {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  specialty: string;
}

const DoctorManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newDoctor, setNewDoctor] = useState<Doctor>({
    _id: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    specialty: '',
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await adminApi.getAllDoctors();
        setDoctors(response.data as Doctor[]);
      } catch (err: any) {
        toast.error('Lỗi khi tải danh sách bác sĩ: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleAddDoctor = async () => {
    try {
      await adminApi.createDoctor(newDoctor);
      const response = await adminApi.getAllDoctors();
      setDoctors(response.data as Doctor[]);
      setNewDoctor({ _id: '', name: '', email: '', password: '', phone: '', specialty: '' });
      setShowAddForm(false);
      toast.success('Thêm bác sĩ thành công!');
    } catch (err: any) {
      toast.error('Lỗi khi thêm bác sĩ: ' + err.message);
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa bác sĩ này?')) {
      try {
        await adminApi.deleteDoctor(id);
        setDoctors(doctors.filter(doctor => doctor._id !== id));
        toast.success('Xóa bác sĩ thành công!');
      } catch (err: any) {
        toast.error('Lỗi khi xóa bác sĩ: ' + err.message);
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Bác Sĩ</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc chuyên khoa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-1/3"
          />
          <button onClick={() => setShowAddForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Thêm Bác Sĩ
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4 p-4 border rounded">
            <input
              type="text"
              placeholder="Tên"
              value={newDoctor.name}
              onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={newDoctor.email}
              onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={newDoctor.password}
              onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="SĐT"
              value={newDoctor.phone}
              onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Chuyên khoa"
              value={newDoctor.specialty}
              onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <button onClick={handleAddDoctor} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Lưu</button>
            <button onClick={() => setShowAddForm(false)} className="ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Hủy</button>
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">SĐT</th>
              <th className="p-3 text-left">Chuyên khoa</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map(doctor => (
              <tr key={doctor._id} className="border-t">
                <td className="p-3">{doctor.name}</td>
                <td className="p-3">{doctor.email}</td>
                <td className="p-3">{doctor.phone}</td>
                <td className="p-3">{doctor.specialty}</td>
                <td className="p-3">
                  <button className="text-blue-600 mr-2">Sửa</button>
                  <button onClick={() => handleDeleteDoctor(doctor._id)} className="text-red-600">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorManagement;