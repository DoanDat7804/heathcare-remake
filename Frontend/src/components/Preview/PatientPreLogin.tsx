import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/NavbarPreLogin';
import Footer from '@/components/Footer';
import DoctorsPreview from './DoctorsPreview'; // Đảm bảo đường dẫn đúng
import NewsPreview from './NewsPreview'; // Đảm bảo đường dẫn đúng

const PatientPreLogin = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Hàm xử lý khi người dùng nhấn nút yêu cầu đăng nhập
  const handleRequireLogin = (destination: string) => {
    if (!isAuthenticated) {
      navigate('/auth'); // Chuyển hướng đến trang Auth
    } else {
      navigate(destination); // Chuyển hướng đến trang mong muốn nếu đã đăng nhập
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Chào mừng đến với HealthCare
            </h1>
            <p className="text-gray-600">
              Vui lòng đăng nhập để sử dụng các dịch vụ dành cho bệnh nhân.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Nút Đặt lịch khám */}
            <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Đặt lịch khám</h2>
              <p className="text-gray-600 mb-4">
                Đặt lịch với bác sĩ dễ dàng và nhanh chóng.
              </p>
              <Button
                className="w-full bg-hospital-500 hover:bg-hospital-600 text-white"
                onClick={() => handleRequireLogin('/appointment')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Đặt lịch ngay
              </Button>
            </div>

            {/* Nút Xem hồ sơ sức khỏe */}
            <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Hồ sơ sức khỏe</h2>
              <p className="text-gray-600 mb-4">
                Theo dõi thông tin sức khỏe cá nhân của bạn.
              </p>
              <Button
                className="w-full bg-hospital-500 hover:bg-hospital-600 text-white"
                onClick={() => handleRequireLogin('/profile')}
              >
                <User className="mr-2 h-4 w-4" />
                Xem hồ sơ
              </Button>
            </div>
          </div>
        </section>

        {/* Doctors Preview */}
        <DoctorsPreview />

        {/* News Preview */}
        <NewsPreview />
      </main>
      <Footer />
    </div>
  );
};

export default PatientPreLogin;