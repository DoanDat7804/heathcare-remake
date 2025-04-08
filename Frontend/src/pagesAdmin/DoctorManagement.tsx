import React, { useState, useEffect } from 'react';
import { adminApi } from '../apis/adminApi';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:3000';
const ITEMS_PER_PAGE = 5;

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialty: 'Đa Khoa',
    gender: 'Nam',
    role: 'doctor',
  });
  const [editDoctor, setEditDoctor] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem('adminToken') || '';

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
        if (!token) throw new Error('Token không tồn tại. Vui lòng đăng nhập.');
        const data = await adminApi.getAllDoctors(token);
        const normalizedData = data.map((doctor) => ({
          ...doctor,
          gender: doctor.gender || 'Nam',
          role: doctor.role || 'doctor',
          isActive: doctor.isActive !== undefined ? doctor.isActive : true,
          avatar: doctor.avatar ? `${BASE_URL}${doctor.avatar}` : null,
        }));
        setDoctors(normalizedData || []);
      } catch (err) {
        toast.error('Lỗi khi tải danh sách bác sĩ: ' + (err.response?.data?.message || err.message));
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [token]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{9,11}$/.test(phone);

  const checkDuplicate = (field, value, currentId) => {
    const isDuplicate = doctors.some(
      (doctor) => doctor[field] === value && doctor._id !== currentId
    );
    if (isDuplicate) {
      toast.error(`${field === 'email' ? 'Email' : 'Số điện thoại'} đã tồn tại!`);
      setIsDuplicate(true);
    } else {
      setIsDuplicate(false);
    }
    return isDuplicate;
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

    if (!validateEmail(newDoctor.email)) {
      toast.error('Email không hợp lệ!');
      return;
    }
    if (!validatePhone(newDoctor.phone)) {
      toast.error('Số điện thoại không hợp lệ (9-11 chữ số)!');
      return;
    }
    if (checkDuplicate('email', newDoctor.email, '') || checkDuplicate('phone', newDoctor.phone, '')) {
      toast.error('Email hoặc số điện thoại đã tồn tại!');
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
        role: newDoctor.role,
      };
      console.log('Dữ liệu gửi lên:', doctorData);
      const createdDoctor = await adminApi.createDoctor(doctorData, token);
      setDoctors([...doctors, { ...createdDoctor, avatar: createdDoctor.avatar ? `${BASE_URL}${createdDoctor.avatar}` : null }]);
      setNewDoctor({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialty: 'Đa Khoa',
        gender: 'Nam',
        role: 'doctor',
      });
      setShowAddForm(false);
      toast.success('Thêm bác sĩ thành công!');
      const totalPages = Math.ceil((doctors.length + 1) / ITEMS_PER_PAGE);
      setCurrentPage(totalPages);
    } catch (err) {
      console.error('Lỗi khi thêm bác sĩ:', err);
      const errorMessage = err.message || err.statusCode ? `${err.message}` : 'Lỗi không xác định';
      toast.error('Lỗi khi thêm bác sĩ: ' + errorMessage);
    }
  };

  const startEditDoctor = (doctor) => {
    setEditDoctor({ ...doctor, password: '' });
    setShowEditForm(true);
    setAvatarFile(null);
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
    if (!validateEmail(editDoctor.email)) {
      toast.error('Email không hợp lệ!');
      return;
    }
    if (!validatePhone(editDoctor.phone)) {
      toast.error('Số điện thoại không hợp lệ (9-11 chữ số)!');
      return;
    }
    try {
      const doctorData = {
        name: editDoctor.name,
        email: editDoctor.email,
        phone: editDoctor.phone,
        specialty: editDoctor.specialty,
        gender: editDoctor.gender,
        role: 'doctor',
        ...(editDoctor.password ? { password: editDoctor.password } : {}),
      };
      await adminApi.updateDoctor(editDoctor._id, doctorData, token);

      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const updatedDoctor = await adminApi.uploadAvatar(editDoctor._id, formData, token);
        setEditDoctor({ ...editDoctor, avatar: updatedDoctor.avatar ? `${BASE_URL}${updatedDoctor.avatar}` : null });
      }

      const data = await adminApi.getAllDoctors(token);
      const normalizedData = data.map((doctor) => ({
        ...doctor,
        avatar: doctor.avatar ? `${BASE_URL}${doctor.avatar}` : null,
      }));
      setDoctors(normalizedData || []);
      setShowEditForm(false);
      setEditDoctor(null);
      setAvatarFile(null);
      toast.success('Cập nhật bác sĩ thành công!');
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err);
      toast.error('Lỗi khi cập nhật bác sĩ: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bác sĩ này?')) {
      try {
        await adminApi.deleteDoctor(id, token);
        const data = await adminApi.getAllDoctors(token);
        const normalizedData = data.map((doctor) => ({
          ...doctor,
          avatar: doctor.avatar ? `${BASE_URL}${doctor.avatar}` : null,
        }));
        setDoctors(normalizedData || []);
        toast.success('Xóa bác sĩ thành công!');
        const filtered = filteredDoctors.filter((doctor) => doctor._id !== id);
        const totalPagesAfterDelete = Math.ceil(filtered.length / ITEMS_PER_PAGE);
        if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
          setCurrentPage(totalPagesAfterDelete);
        }
      } catch (err) {
        console.error('Lỗi khi xóa:', err);
        toast.error('Lỗi khi xóa bác sĩ: ' + (err.response?.data?.message || err.message));
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
          doctor.role.toLowerCase().includes(searchLower) ||
          statusText.toLowerCase().includes(searchLower)
        );
      })
    : [];

  const totalItems = filteredDoctors.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDoctors = filteredDoctors.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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
                <option key={spec} value={spec}>{spec}</option>
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
              className={`bg-green-600 text-white px-4 py-2 rounded ${isDuplicate ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
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
              placeholder="ID"
              value={editDoctor._id}
              disabled
              className="border p-2 rounded mb-2 w-full bg-gray-100"
            />
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
                <option key={spec} value={spec}>{spec}</option>
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
            <div className="mb-2">
              <label className="block mb-1">Ảnh đại diện:</label>
              {editDoctor.avatar ? (
                <img src={editDoctor.avatar} alt="Avatar" className="w-24 h-24 object-cover mb-2" />
              ) : (
                <img src="https://via.placeholder.com/100" alt="No Avatar" className="w-24 h-24 object-cover mb-2" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                className="border p-2 rounded w-full"
              />
            </div>
            <button
              onClick={handleEditDoctor}
              className={`bg-green-600 text-white px-4 py-2 rounded ${isDuplicate ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
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
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Ảnh</th>
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">SĐT</th>
              <th className="p-3 text-left">Chuyên khoa</th>
              <th className="p-3 text-left">Giới tính</th>
              <th className="p-3 text-left">Vai trò</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors.map((doctor) => (
              <tr key={doctor._id} className="border-t">
                <td className="p-3">{doctor._id}</td>
                <td className="p-3">
                  {doctor.avatar ? (
                    <img src={doctor.avatar} alt="Avatar" className="w-12 h-12 object-cover rounded-full" />
                  ) : (
                    <img src="https://via.placeholder.com/100" alt="No Avatar" className="w-12 h-12 object-cover rounded-full" />
                  )}
                </td>
                <td className="p-3">{doctor.name}</td>
                <td className="p-3">{doctor.email}</td>
                <td className="p-3">{doctor.phone}</td>
                <td className="p-3">{doctor.specialty}</td>
                <td className="p-3">{doctor.gender}</td>
                <td className="p-3">{doctor.role.charAt(0).toUpperCase() + doctor.role.slice(1)}</td>
                <td className="p-3">
                  <span className={doctor.isActive ? 'text-green-600' : 'text-red-600'}>
                    {doctor.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => startEditDoctor(doctor)} className="text-blue-600 mr-2 hover:underline">
                    Sửa
                  </button>
                  <button onClick={() => handleDeleteDoctor(doctor._id)} className="text-red-600 hover:underline">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalItems > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Hiển thị {startIndex + 1} - {Math.min(endIndex, totalItems)} trong tổng số {totalItems} bác sĩ
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
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

export default DoctorManagement;