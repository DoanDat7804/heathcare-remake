import React, { useState, useEffect } from 'react';
import { adminApi } from '../apis/adminApi';
import api from '../apis/index.ts';
import { toast } from 'react-toastify';

interface User {
  _id: string;
  name: string;
  email: string;
  password?: string; // Password không cần hiển thị trong bảng
  phone: string;
  role: string;
  gender: string;
  address: string;
  isActive?: boolean;
}

const UserForm: React.FC<{
  user: User;
  onSave: () => void;
  onCancel: () => void;
  onChange: (user: User) => void;
  checkDuplicate?: (field: 'email' | 'phone', value: string, currentId: string) => void;
  isDuplicate?: boolean;
}> = ({ user, onSave, onCancel, onChange, checkDuplicate, isDuplicate }) => (
  <div className="mb-4 p-4 border rounded">
    <h2 className="text-lg font-semibold mb-2">{user._id ? 'Chỉnh sửa' : 'Thêm'} Người Dùng</h2>
    <input
      type="text"
      placeholder="Tên"
      value={user.name}
      onChange={(e) => onChange({ ...user, name: e.target.value })}
      className="border p-2 rounded mb-2 w-full"
    />
    <input
      type="email"
      placeholder="Email"
      value={user.email}
      onChange={(e) => {
        const newEmail = e.target.value;
        onChange({ ...user, email: newEmail });
        if (checkDuplicate) checkDuplicate('email', newEmail, user._id);
      }}
      className="border p-2 rounded mb-2 w-full"
    />
    <input
      type="password"
      placeholder={user._id ? 'Mật khẩu (để trống nếu không đổi)' : 'Mật khẩu'}
      value={user.password || ''}
      onChange={(e) => onChange({ ...user, password: e.target.value })}
      className="border p-2 rounded mb-2 w-full"
    />
    <input
      type="text"
      placeholder="SĐT"
      value={user.phone}
      onChange={(e) => {
        const newPhone = e.target.value;
        onChange({ ...user, phone: newPhone });
        if (checkDuplicate) checkDuplicate('phone', newPhone, user._id);
      }}
      className="border p-2 rounded mb-2 w-full"
    />
    <select
      value={user.gender}
      onChange={(e) => onChange({ ...user, gender: e.target.value })}
      className="border p-2 rounded mb-2 w-full"
    >
      <option value="Giới tính">Giới tính</option>
      <option value="Nam">Nam</option>
      <option value="Nữ">Nữ</option>
      <option value="Khác">Khác</option>
    </select>
    <input
      type="text"
      placeholder="Địa chỉ (VD: 123 Đường Láng, Đống Đa, Hà Nội, Việt Nam)"
      value={user.address}
      onChange={(e) => onChange({ ...user, address: e.target.value })}
      className="border p-2 rounded mb-2 w-full"
    />
    <select
      value={user.role}
      onChange={(e) => onChange({ ...user, role: e.target.value })}
      className="border p-2 rounded mb-2 w-full"
    >
      <option value="patient">Bệnh nhân</option>
      <option value="admin">Quản trị viên</option>
    </select>
    <button
      onClick={onSave}
      className={`bg-green-600 text-white px-4 py-2 rounded ${
        isDuplicate ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
      }`}
      disabled={isDuplicate}
    >
      Lưu
    </button>
    <button
      onClick={onCancel}
      className="ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
    >
      Hủy
    </button>
  </div>
);

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<User>({
    _id: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'patient',
    gender: 'Giới tính',
    address: '',
  });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminApi.getAllUsers();
        const normalizedData = data.map((user: any) => ({
          _id: user._id,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || 'patient',
          gender: user.gender || 'Giới tính',
          address:
            user.address && typeof user.address === 'object'
              ? `${user.address.street}, ${user.address.district}, ${user.address.city}, ${user.address.country}`
              : user.address || '',
          isActive: user.isActive ?? true,
        }));
        setUsers(normalizedData || []);
      } catch (err: any) {
        toast.error('Lỗi khi tải danh sách người dùng: ' + err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const checkDuplicate = (field: 'email' | 'phone', value: string, currentId: string) => {
    const isDuplicate = users.some(
      (user) => user[field] === value && user._id !== currentId
    );
    setIsDuplicate(isDuplicate);
    if (isDuplicate) {
      toast.error('Email hoặc số điện thoại đã tồn tại!');
    }
  };

  const handleAddUser = async () => {
    const userData = { ...newUser };
    delete userData._id;
    if (!userData.name || !userData.email || !userData.password || !userData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    if (!/^(0[1-9][0-9]{8})$/.test(userData.phone)) {
      toast.error('Số điện thoại phải là số Việt Nam hợp lệ (ví dụ: 0987654321)');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(userData.email)) {
      toast.error('Email không hợp lệ!');
      return;
    }
    if (userData.gender === 'Giới tính') delete userData.gender;
    console.log('Dữ liệu gửi lên server:', userData);
    try {
      await adminApi.createUser(userData);
      const data = await adminApi.getAllUsers();
      const normalizedData = data.map((user: any) => ({
        _id: user._id,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'patient',
        gender: user.gender || 'Giới tính',
        address:
          user.address && typeof user.address === 'object'
            ? `${user.address.street}, ${user.address.district}, ${user.address.city}, ${user.address.country}`
            : user.address || '',
        isActive: user.isActive ?? true,
      }));
      setUsers(normalizedData || []);
      setNewUser({
        _id: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'patient',
        gender: 'Giới tính',
        address: '',
      });
      setShowAddForm(false);
      toast.success('Thêm người dùng thành công!');
    } catch (err: any) {
      console.error('Lỗi từ server (chi tiết):', JSON.stringify(err.response?.data, null, 2));
      toast.error(err.response?.data?.message?.message?.join(', ') || err.response?.data?.message || 'Lỗi khi thêm người dùng');
    }
  };

  const handleEditUser = (user: User) => {
    setEditUser({ ...user, password: '' });
    setShowEditForm(true);
    setIsDuplicate(false);
  };

  const handleUpdateUser = async () => {
    if (!editUser || isDuplicate) return;
    const userData: Partial<User> = {
      name: editUser.name,
      email: editUser.email,
      phone: editUser.phone,
      role: editUser.role,
      gender: editUser.gender === 'Giới tính' ? undefined : editUser.gender,
      address: editUser.address,
      ...(editUser.password ? { password: editUser.password } : {}),
    };
    if (!userData.name || !userData.email || !userData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    try {
      await adminApi.updateUser(editUser._id, userData);
      const data = await adminApi.getAllUsers();
      const normalizedData = data.map((user: any) => ({
        _id: user._id,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'patient',
        gender: user.gender || 'Giới tính',
        address:
          user.address && typeof user.address === 'object'
            ? `${user.address.street}, ${user.address.district}, ${user.address.city}, ${user.address.country}`
            : user.address || '',
        isActive: user.isActive ?? true,
      }));
      setUsers(normalizedData || []);
      setShowEditForm(false);
      setEditUser(null);
      toast.success('Cập nhật người dùng thành công!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi cập nhật');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await adminApi.deleteUser(id);
        setUsers((prev) => prev.filter((user) => user._id !== id));
        toast.success('Xóa người dùng thành công!');
      } catch (err: any) {
        toast.error('Lỗi khi xóa người dùng: ' + err.message);
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const statusText = user.isActive ? 'hoạt động' : 'không hoạt động';
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phone.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      user.gender.toLowerCase().includes(searchLower) ||
      (user.address && user.address.toLowerCase().includes(searchLower)) ||
      statusText.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Người Dùng</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm Người Dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-1/3"
          />
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm Người Dùng
          </button>
        </div>

        {showAddForm && (
          <UserForm
            user={newUser}
            onSave={handleAddUser}
            onCancel={() => setShowAddForm(false)}
            onChange={setNewUser}
            checkDuplicate={checkDuplicate}
            isDuplicate={isDuplicate}
          />
        )}
        {showEditForm && editUser && (
          <UserForm
            user={editUser}
            onSave={handleUpdateUser}
            onCancel={() => setShowEditForm(false)}
            onChange={setEditUser}
            checkDuplicate={checkDuplicate}
            isDuplicate={isDuplicate}
          />
        )}

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">SĐT</th>
              <th className="p-3 text-left">Giới tính</th>
              <th className="p-3 text-left">Địa chỉ</th>
              <th className="p-3 text-left">Vai trò</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone}</td>
                <td className="p-3">{user.gender}</td>
                <td className="p-3">{user.address || 'Chưa có địa chỉ'}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  <span className={user.isActive ? 'text-green-600' : 'text-red-600'}>
                    {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
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

export default UserManagement;