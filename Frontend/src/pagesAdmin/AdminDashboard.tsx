import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  FileText, 
  DollarSign, 
  Settings,
  LogOut 
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-blue-600">Healthcare Admin</h2>
        </div>
        <nav className="mt-4">
          <SidebarItem 
            icon={<Users />}
            label="Quản lý Người Dùng"
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          />
          <SidebarItem 
            icon={<Calendar />}
            label="Quản lý Lịch Hẹn"
            active={activeTab === 'appointments'}
            onClick={() => setActiveTab('appointments')}
          />
          <SidebarItem 
            icon={<FileText />}
            label="Quản lý Bệnh Án"
            active={activeTab === 'records'}
            onClick={() => setActiveTab('records')}
          />
          <SidebarItem 
            icon={<DollarSign />}
            label="Quản lý Dịch Vụ"
            active={activeTab === 'services'}
            onClick={() => setActiveTab('services')}
          />
          <SidebarItem 
            icon={<Settings />}
            label="Hệ Thống & Bảo Mật"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
          <SidebarItem 
            icon={<LogOut />}
            label="Đăng Xuất"
            active={false}
            onClick={handleLogout}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'appointments' && <AppointmentManagement />}
        {activeTab === 'records' && <MedicalRecords />}
        {activeTab === 'services' && <ServiceManagement />}
        {activeTab === 'settings' && <SystemSettings />}
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void 
}) => (
  <button
    className={`w-full flex items-center p-4 text-gray-700 hover:bg-blue-50 ${
      active ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
    }`}
    onClick={onClick}
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </button>
);

// Quản lý Người Dùng
const UserManagement = () => {
  const [users, setUsers] = useState([{
    _id: { $oid: "60f7b1b2c3b4a1b2c3b4a1b2" },
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    role: "patient",
    isActive: true,
  }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: 'patient' });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setUsers([...users, { ...newUser, _id: { $oid: Date.now().toString() }, isActive: true }]);
    setNewUser({ name: '', email: '', phone: '', role: 'patient' });
    setShowAddForm(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user._id.$oid !== id));
  };

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
          <button 
            onClick={() => setShowAddForm(true)} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm Người Dùng
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4 p-4 border rounded">
            <input 
              type="text" 
              placeholder="Tên" 
              value={newUser.name} 
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={newUser.email} 
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input 
              type="text" 
              placeholder="SĐT" 
              value={newUser.phone} 
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <select 
              value={newUser.role} 
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            >
              <option value="patient">Bệnh nhân</option>
              <option value="doctor">Bác sĩ</option>
              <option value="staff">Nhân viên</option>
            </select>
            <button 
              onClick={handleAddUser} 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
              <tr key={user._id.$oid} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  <span className={user.isActive ? "text-green-600" : "text-red-600"}>
                    {user.isActive ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>
                <td className="p-3">
                  <button className="text-blue-600 mr-2">Sửa</button>
                  <button 
                    onClick={() => handleDeleteUser(user._id.$oid)} 
                    className="text-red-600"
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

// Quản lý Lịch Hẹn
const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([{
    _id: { $oid: "60f7b1b2c3b4a1b2c3b4a1b5" },
    patientId: { $oid: "60f7b1b2c3b4a1b2c3b4a1b2" },
    doctorId: { $oid: "60f7b1b2c3b4a1b2c3b4a1b3" },
    serviceType: "Khám tổng quát",
    date: { $date: "2023-10-05T00:00:00.000Z" },
    timeSlot: "09:00-09:30",
    status: "pending",
    note: "Khám sức khỏe định kỳ",
  }]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAppointments = appointments.filter(appointment => 
    appointment.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(appointment.date.$date).toLocaleDateString().includes(searchTerm)
  );

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(appointment => appointment._id.$oid !== id));
  };

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
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Tạo Lịch Hẹn
          </button>
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
              <tr key={appointment._id.$oid} className="border-t">
                <td className="p-3">{new Date(appointment.date.$date).toLocaleDateString()}</td>
                <td className="p-3">{appointment.timeSlot}</td>
                <td className="p-3">{appointment.serviceType}</td>
                <td className="p-3">
                  <span className={appointment.status === 'pending' ? "text-yellow-600" : "text-green-600"}>
                    {appointment.status === 'pending' ? "Đang chờ" : "Hoàn thành"}
                  </span>
                </td>
                <td className="p-3">{appointment.note}</td>
                <td className="p-3">
                  <button className="text-blue-600 mr-2">Sửa</button>
                  <button 
                    onClick={() => handleDeleteAppointment(appointment._id.$oid)} 
                    className="text-red-600"
                  >
                    Hủy
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

// Quản lý Bệnh Án
const MedicalRecords = () => {
  const [records, setRecords] = useState([{
    _id: { $oid: "60f7b1b2c3b4a1b2c3b4a1b6" },
    patientId: { $oid: "60f7b1b2c3b4a1b2c3b4a1b2" },
    date: { $date: "2023-10-05T00:00:00.000Z" },
    diagnosis: ["Cảm cúm"],
    symptoms: ["Sốt", "Ho"],
    medications: [{ name: "Paracetamol", dosage: "500mg", frequency: "2 lần/ngày", duration: "3 ngày" }],
    followUpDate: { $date: "2023-10-12T00:00:00.000Z" },
  }]);

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(record => record._id.$oid !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Bệnh Án</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">Ngày</th>
              <th className="p-3 text-left">Chẩn đoán</th>
              <th className="p-3 text-left">Triệu chứng</th>
              <th className="p-3 text-left">Thuốc</th>
              <th className="p-3 text-left">Tái khám</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record._id.$oid} className="border-t">
                <td className="p-3">{new Date(record.date.$date).toLocaleDateString()}</td>
                <td className="p-3">{record.diagnosis.join(", ")}</td>
                <td className="p-3">{record.symptoms.join(", ")}</td>
                <td className="p-3">{record.medications[0].name} ({record.medications[0].dosage})</td>
                <td className="p-3">{new Date(record.followUpDate.$date).toLocaleDateString()}</td>
                <td className="p-3">
                  <button className="text-blue-600 mr-2">Sửa</button>
                  <button 
                    onClick={() => handleDeleteRecord(record._id.$oid)} 
                    className="text-red-600"
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

// Quản lý Dịch Vụ
const ServiceManagement = () => {
  const [services, setServices] = useState([{
    _id: { $oid: "60f7b1b2c3b4a1b2c3b4a1b9" },
    name: "Khám tổng quát",
    description: "Dịch vụ khám sức khỏe tổng quát",
    price: 500000,
    currency: "VND",
    duration: 30,
    isActive: true,
  }]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({ name: '', description: '', price: 0, duration: 0 });

  const handleAddService = () => {
    setServices([...services, { ...newService, _id: { $oid: Date.now().toString() }, isActive: true, currency: "VND" }]);
    setNewService({ name: '', description: '', price: 0, duration: 0 });
    setShowAddForm(false);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(service => service._id.$oid !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Dịch Vụ</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setShowAddForm(true)} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm Dịch Vụ
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4 p-4 border rounded">
            <input 
              type="text" 
              placeholder="Tên dịch vụ" 
              value={newService.name} 
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input 
              type="text" 
              placeholder="Mô tả" 
              value={newService.description} 
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input 
              type="number" 
              placeholder="Giá (VND)" 
              value={newService.price} 
              onChange={(e) => setNewService({ ...newService, price: parseInt(e.target.value) })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input 
              type="number" 
              placeholder="Thời gian (phút)" 
              value={newService.duration} 
              onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) })}
              className="border p-2 rounded mb-2 w-full"
            />
            <button 
              onClick={handleAddService} 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Mô tả</th>
              <th className="p-3 text-left">Giá</th>
              <th className="p-3 text-left">Thời gian (phút)</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service._id.$oid} className="border-t">
                <td className="p-3">{service.name}</td>
                <td className="p-3">{service.description}</td>
                <td className="p-3">{service.price.toLocaleString()} {service.currency}</td>
                <td className="p-3">{service.duration}</td>
                <td className="p-3">
                  <span className={service.isActive ? "text-green-600" : "text-red-600"}>
                    {service.isActive ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>
                <td className="p-3">
                  <button className="text-blue-600 mr-2">Sửa</button>
                  <button 
                    onClick={() => handleDeleteService(service._id.$oid)} 
                    className="text-red-600"
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

// Hệ Thống & Bảo Mật (Placeholder)
const SystemSettings = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Hệ Thống & Bảo Mật</h1>
    <div className="bg-white p-6 rounded-lg shadow">
      <p>Cấu hình hệ thống (email, SMS, v.v.) sẽ được thêm sau.</p>
    </div>
  </div>
);

export default AdminDashboard;