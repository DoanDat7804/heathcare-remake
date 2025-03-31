import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, FileText, DollarSign, Settings, LogOut, Shield } from 'lucide-react';
import UserManagement from './UserManagement';
import AppointmentManagement from './AdminAppointments';
import DoctorManagement from './DoctorManagement';
import NewsManagement from './NewsManagement';
import SystemSettings from './SystemSettings';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'appointments' | 'doctors' | 'news' | 'settings'>('users');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-2xl font-display font-semibold text-gray-900 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-hospital-500" /> Healthcare Admin
          </h2>
        </div>
        <nav className="mt-4">
          <SidebarItem icon={<Users className="h-5 w-5" />} label="Quản lý Người Dùng" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <SidebarItem icon={<Calendar className="h-5 w-5" />} label="Quản lý Lịch Hẹn" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
          <SidebarItem icon={<Users className="h-5 w-5" />} label="Quản lý Bác Sĩ" active={activeTab === 'doctors'} onClick={() => setActiveTab('doctors')} />
          <SidebarItem icon={<FileText className="h-5 w-5" />} label="Quản lý Tin Tức" active={activeTab === 'news'} onClick={() => setActiveTab('news')} />
          <SidebarItem icon={<Settings className="h-5 w-5" />} label="Hệ Thống & Bảo Mật" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          <SidebarItem icon={<LogOut className="h-5 w-5" />} label="Đăng Xuất" active={false} onClick={handleLogout} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'appointments' && <AppointmentManagement />}
          {activeTab === 'doctors' && <DoctorManagement />}
          {activeTab === 'news' && <NewsManagement />}
          {activeTab === 'settings' && <SystemSettings />}
        </div>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
  <button
    className={`w-full flex items-center p-4 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors ${
      active ? 'bg-gray-50 text-gray-900 border-r-4 border-hospital-500' : ''
    }`}
    onClick={onClick}
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </button>
);

export default AdminDashboard;