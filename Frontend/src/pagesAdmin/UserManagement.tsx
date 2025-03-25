import React, { useState, useEffect } from 'react';
import { adminApi } from '../apis/adminApi';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', phone: '', role: 'patient' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminApi.getAllUsers();
        setUsers(response.data);
      } catch (err) {
        toast.error('Lỗi khi tải danh sách người dùng: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      await adminApi.createUser(newUser);
      const response = await adminApi.getAllUsers();
      setUsers(response.data);
      setNewUser({ name: '', email: '', password: '', phone: '', role: 'patient' });
      setShowAddForm(false);
      toast.success('Thêm người dùng thành công!');
    } catch (err) {
      toast.error('Lỗi khi thêm người dùng: ' + err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await adminApi.deleteUser(id);
        setUsers(users.filter(user => user._id !== id));
        toast.success('Xóa người dùng thành công!');
      } catch (err) {
        toast.error('Lỗi khi xóa người dùng: ' + err.message);
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Người Dùng</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-1/3"
          />
          <button onClick={() => setShowAddForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Thêm Người Dùng
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4 p-4 border rounded">
            <input type="text" placeholder="Tên" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="border p-2 rounded mb-2 w-full" />
            <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="border p-2 rounded mb-2 w-full" />
            <input type="password" placeholder="Mật khẩu" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="border p-2 rounded mb-2 w-full" />
            <input type="text" placeholder="SĐT" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} className="border p-2 rounded mb-2 w-full" />
            <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="border p-2 rounded mb-2 w-full">
              <option value="patient">Bệnh nhân</option>
              <option value="doctor">Bác sĩ</option>
              <option value="staff">Nhân viên</option>
            </select>
            <button onClick={handleAddUser} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Lưu</button>
            <button onClick={() => setShowAddForm(false)} className="ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Hủy</button>
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">SĐT</th>
              <th className="p-3 text-left">Vai trò</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3"><span className={user.isActive ? "text-green-600" : "text-red-600"}>{user.isActive ? "Hoạt động" : "Không hoạt động"}</span></td>
                <td className="p-3">
                  <button className="text-blue-600 mr-2">Sửa</button>
                  <button onClick={() => handleDeleteUser(user._id)} className="text-red-600">Xóa</button>
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