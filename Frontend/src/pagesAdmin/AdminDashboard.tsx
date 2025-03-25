import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, FileText, DollarSign, Settings, LogOut } from 'lucide-react';
import UserManagement from './UserManagement';
import AppointmentManagement from './AdminAppointments';
import DoctorManagement from './DoctorManagement';
import NewsManagement from './NewsManagement';
import SystemSettings from './SystemSettings';

// Định nghĩa kiểu cho props của SidebarItem
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const AdminDashboard: React.FC = () => {
  // Định nghĩa kiểu cho activeTab
  const [activeTab, setActiveTab] = useState<'users' | 'appointments' | 'doctors' | 'news' | 'settings'>('users');
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
          <SidebarItem icon={<Users />} label="Quản lý Người Dùng" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <SidebarItem icon={<Calendar />} label="Quản lý Lịch Hẹn" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
          <SidebarItem icon={<Users />} label="Quản lý Bác Sĩ" active={activeTab === 'doctors'} onClick={() => setActiveTab('doctors')} />
          <SidebarItem icon={<FileText />} label="Quản lý Tin Tức" active={activeTab === 'news'} onClick={() => setActiveTab('news')} />
          <SidebarItem icon={<Settings />} label="Hệ Thống & Bảo Mật" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          <SidebarItem icon={<LogOut />} label="Đăng Xuất" active={false} onClick={handleLogout} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'appointments' && <AppointmentManagement />}
        {activeTab === 'doctors' && <DoctorManagement />}
        {activeTab === 'news' && <NewsManagement />}
        {activeTab === 'settings' && <SystemSettings />}
      </div>
    </div>
  );
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
  <button
    className={`w-full flex items-center p-4 text-gray-700 hover:bg-blue-50 ${active ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}`}
    onClick={onClick}
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </button>
);

export default AdminDashboard;