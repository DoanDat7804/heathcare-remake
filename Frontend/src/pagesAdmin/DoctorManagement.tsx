import React, { useState, useEffect } from 'react';
import { adminApi } from '../apis/adminApi';
import { toast } from 'react-toastify';

interface Doctor {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  specialty: string;
  gender: string;
  isActive?: boolean;
}

const DoctorManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [newDoctor, setNewDoctor] = useState<Doctor>({
    _id: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    specialty: 'Đa Khoa', // Giá trị mặc định
    gender: 'Nam',
  });
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);

  const specialties = [
    'Đa Khoa',
    'Nhi Khoa',
    'Nội Khoa',
    'Ngoại Khoa',
    'Sản Phụ Khoa',
    'Tim Mạch Khoa',
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await adminApi.getAllDoctors();
        const normalizedData = data.map((doctor: Doctor) => ({
          ...doctor,
          gender: doctor.gender || 'Nam',
          isActive: doctor.isActive !== undefined ? doctor.isActive : true,
        }));
        setDoctors(normalizedData || []);
      } catch (err: any) {
        console.error('Lỗi khi tải danh sách bác sĩ:', err.response?.data);
        toast.error('Lỗi khi tải danh sách bác sĩ: ' + (err.response?.data?.message || err.message));
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const checkDuplicate = (field: 'email' | 'phone', value: string, currentId: string) => {
    const isDuplicate = doctors.some(
      (doctor) => doctor[field] === value && doctor._id !== currentId
    );
    if (isDuplicate) {
      toast.error(`${field === 'email' ? 'Email' : 'Số điện thoại'} đã tồn tại!`);
      setIsDuplicate(true);
    } else {
      setIsDuplicate(false);
    }
  };

  const handleAddDoctor = async () => {
    if (
      !newDoctor.name ||
      !newDoctor.email ||
      !newDoctor.password ||
      !newDoctor.phone ||
      !newDoctor.specialty ||
      !newDoctor.gender
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    try {
      const doctorData = {
        name: newDoctor.name,
        email: newDoctor.email,
        password: newDoctor.password,
        phone: newDoctor.phone,
        specialty: newDoctor.specialty,
        gender: newDoctor.gender,
      };
      console.log('Dữ liệu gửi đi (POST):', doctorData);
      await adminApi.createDoctor(doctorData);
      const data = await adminApi.getAllDoctors();
      setDoctors(data || []);
      setNewDoctor({
        _id: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        specialty: 'Đa Khoa',
        gender: 'Nam',
      });
      setShowAddForm(false);
      toast.success('Thêm bác sĩ thành công!');
    } catch (err: any) {
      console.error('Lỗi từ server (POST):', err.response?.data);
      const errorMessage =
        err.response?.data?.message && typeof err.response?.data?.message === 'string'
          ? err.response?.data?.message
          : JSON.stringify(err.response?.data || err.message);
      toast.error('Lỗi khi thêm bác sĩ: ' + errorMessage);
    }
  };

  const startEditDoctor = (doctor: Doctor) => {
    setEditDoctor({ ...doctor, password: '' });
    setShowEditForm(true);
    setIsDuplicate(false);
  };

  const handleEditDoctor = async () => {
    if (!editDoctor || isDuplicate) return;
    if (
      !editDoctor.name ||
      !editDoctor.email ||
      !editDoctor.phone ||
      !editDoctor.specialty ||
      !editDoctor.gender
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    try {
      const doctorData: Partial<Doctor> = {
        name: editDoctor.name,
        email: editDoctor.email,
        phone: editDoctor.phone,
        specialty: editDoctor.specialty,
        gender: editDoctor.gender,
        ...(editDoctor.password ? { password: editDoctor.password } : {}),
      };
      console.log('Dữ liệu gửi đi (PATCH):', doctorData);
      await adminApi.updateDoctor(editDoctor._id, doctorData);
      const data = await adminApi.getAllDoctors();
      setDoctors(data || []);
      setShowEditForm(false);
      setEditDoctor(null);
      toast.success('Cập nhật bác sĩ thành công!');
    } catch (err: any) {
      console.error('Lỗi từ server (PATCH):', err.response?.data);
      const errorMessage =
        err.response?.data?.message && typeof err.response?.data?.message === 'string'
          ? err.response?.data?.message
          : JSON.stringify(err.response?.data || err.message);
      toast.error('Lỗi khi cập nhật bác sĩ: ' + errorMessage);
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    console.log('ID gửi đi để xóa:', id);
    if (window.confirm('Bạn có chắc muốn xóa bác sĩ này?')) {
      try {
        await adminApi.deleteDoctor(id);
        const data = await adminApi.getAllDoctors();
        setDoctors(data || []);
        toast.success('Xóa bác sĩ thành công!');
      } catch (err: any) {
        console.error('Lỗi từ server (DELETE):', err.response?.data);
        let errorMessage = 'Lỗi không xác định';
        if (err.response?.data) {
          if (typeof err.response?.data.message === 'string') {
            errorMessage = err.response?.data.message;
          } else if (Array.isArray(err.response?.data.message)) {
            errorMessage = err.response?.data.message.join(', ');
          } else {
            errorMessage = JSON.stringify(err.response?.data, null, 2);
          }
        } else {
          errorMessage = err.message || 'Không thể kết nối server';
        }
        toast.error('Lỗi khi xóa bác sĩ: ' + errorMessage);
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;

  const filteredDoctors = Array.isArray(doctors)
    ? doctors.filter((doctor) => {
        const searchLower = searchTerm.toLowerCase();
        const statusText = doctor.isActive ? 'hoạt động' : 'không hoạt động';
        return (
          doctor.name.toLowerCase().includes(searchLower) ||
          doctor.email.toLowerCase().includes(searchLower) ||
          doctor.phone.toLowerCase().includes(searchLower) ||
          doctor.specialty.toLowerCase().includes(searchLower) ||
          doctor.gender.toLowerCase().includes(searchLower) ||
          statusText.toLowerCase().includes(searchLower)
        );
      })
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Bác Sĩ</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm Bác Sĩ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-1/3"
          />
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm Bác Sĩ
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4 p-4 border rounded">
            <h2 className="text-lg font-semibold mb-2">Thêm Bác Sĩ</h2>
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
              onChange={(e) => {
                const newEmail = e.target.value;
                setNewDoctor({ ...newDoctor, email: newEmail });
                checkDuplicate('email', newEmail, '');
              }}
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
              onChange={(e) => {
                const newPhone = e.target.value;
                setNewDoctor({ ...newDoctor, phone: newPhone });
                checkDuplicate('phone', newPhone, '');
              }}
              className="border p-2 rounded mb-2 w-full"
            />
            <select
              value={newDoctor.specialty}
              onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            >
              {specialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <select
              value={newDoctor.gender}
              onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            <button
              onClick={handleAddDoctor}
              className={`bg-green-600 text-white px-4 py-2 rounded ${
                isDuplicate ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
              }`}
              disabled={isDuplicate}
            >
              Lưu
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Hủy
            </button>
          </div>
        )}

        {showEditForm && editDoctor && (
          <div className="mb-4 p-4 border rounded">
            <h2 className="text-lg font-semibold mb-2">Chỉnh sửa Bác sĩ</h2>
            <input
              type="text"
              placeholder="Tên"
              value={editDoctor.name}
              onChange={(e) => setEditDoctor({ ...editDoctor, name: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={editDoctor.email}
              onChange={(e) => {
                const newEmail = e.target.value;
                setEditDoctor({ ...editDoctor, email: newEmail });
                checkDuplicate('email', newEmail, editDoctor._id);
              }}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="password"
              placeholder="Mật khẩu (để trống nếu không đổi)"
              value={editDoctor.password || ''}
              onChange={(e) => setEditDoctor({ ...editDoctor, password: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="SĐT"
              value={editDoctor.phone}
              onChange={(e) => {
                const newPhone = e.target.value;
                setEditDoctor({ ...editDoctor, phone: newPhone });
                checkDuplicate('phone', newPhone, editDoctor._id);
              }}
              className="border p-2 rounded mb-2 w-full"
            />
            <select
              value={editDoctor.specialty}
              onChange={(e) => setEditDoctor({ ...editDoctor, specialty: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            >
              {specialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <select
              value={editDoctor.gender}
              onChange={(e) => setEditDoctor({ ...editDoctor, gender: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            <button
              onClick={handleEditDoctor}
              className={`bg-green-600 text-white px-4 py-2 rounded ${
                isDuplicate ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
              }`}
              disabled={isDuplicate}
            >
              Cập nhật
            </button>
            <button
              onClick={() => setShowEditForm(false)}
              className="ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Hủy
            </button>
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">SĐT</th>
              <th className="p-3 text-left">Chuyên khoa</th>
              <th className="p-3 text-left">Giới tính</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor) => (
              <tr key={doctor._id} className="border-t">
                <td className="p-3">{doctor.name}</td>
                <td className="p-3">{doctor.email}</td>
                <td className="p-3">{doctor.phone}</td>
                <td className="p-3">{doctor.specialty}</td>
                <td className="p-3">{doctor.gender}</td>
                <td className="p-3">
                  <span className={doctor.isActive ? 'text-green-600' : 'text-red-600'}>
                    {doctor.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => startEditDoctor(doctor)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteDoctor(doctor._id)}
                    className="text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
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