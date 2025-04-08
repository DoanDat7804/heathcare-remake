import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  gender: string;
  role: string;
  isActive: boolean;
  avatar?: string;
}

const DoctorsDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor: Doctor = location.state?.doctor;

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-hospital-700 mb-4">Không tìm thấy thông tin bác sĩ</h2>
            <Button
              variant="outline"
              className="border-hospital-500 text-hospital-500 hover:bg-hospital-50"
              onClick={() => navigate('/doctors')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách bác sĩ
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleContactDoctor = () => {
    window.location.href = `mailto:${doctor.email}?subject=Liên hệ với ${doctor.name}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-grow section-container bg-hospital-60 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-soft p-8 animate-fade-in">
          <Button
            variant="outline"
            className="mb-6 border-hospital-500 text-hospital-500 hover:bg-hospital-50"
            onClick={() => navigate('/doctors')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>

          <div className="flex flex-col items-center gap-6">
            <img
              src={doctor.avatar || 'https://via.placeholder.com/150'}
              alt={doctor.name}
              className="w-48 h-48 rounded-full object-cover shadow-md"
            />
            <h1 className="text-3xl font-bold text-hospital-700">{doctor.name}</h1>
            <p className="text-hospital-500 font-medium text-lg">{doctor.specialty}</p>
            <div className="text-gray-700 text-center leading-relaxed">
              <p><strong>Email:</strong> {doctor.email}</p>
              <p><strong>Số điện thoại:</strong> {doctor.phone}</p>
              <p><strong>Giới tính:</strong> {doctor.gender}</p>
              <p><strong>Vai trò:</strong> {doctor.role}</p>
              <p><strong>Trạng thái:</strong> {doctor.isActive ? 'Hoạt động' : 'Không hoạt động'}</p>
            </div>
            <Button
              variant="default"
              className="mt-4 bg-hospital-500 text-white hover:bg-hospital-600"
              onClick={handleContactDoctor}
            >
              <Mail className="mr-2 h-4 w-4" />
              Liên hệ với bác sĩ
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default DoctorsDetail;