import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorApi } from '../apis/doctorApi'; // API để lấy danh sách bác sĩ
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]); // Danh sách bác sĩ từ API
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Thay bằng token thực tế từ hệ thống xác thực (có thể lấy từ context hoặc localStorage)
  const token = 'your-jwt-token'; 

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await doctorApi.getAllDoctors(config);
        console.log('Full API response:', response); // Log toàn bộ response
        console.log('Data extracted:', response.data); // Log dữ liệu cụ thể
        // Giả sử response.data chứa danh sách bác sĩ
        const data = response.data || response; // Điều chỉnh tùy backend
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách bác sĩ:', err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleViewDetails = (doctor) => {
    navigate('/doctors/detail', { state: { doctor } });
  };

  if (loading) return <div>Đang tải...</div>;

  if (!Array.isArray(doctors) || doctors.length === 0) {
    return <div>Không có dữ liệu bác sĩ để hiển thị</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-grow section-container bg-hospital-60 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-hospital-700 mb-8 text-center">Danh sách bác sĩ</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-soft hover:bg-hospital-100 transition"
              >
                <img
                  src={doctor.avatar || 'https://via.placeholder.com/100'} // Ảnh từ API hoặc placeholder
                  alt={doctor.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <p className="text-hospital-700 font-semibold">{doctor.name}</p>
                <p className="text-gray-600 text-sm">{doctor.specialty}</p>
                <Button
                  variant="outline"
                  className="text-hospital-500 border-hospital-500 hover:bg-hospital-50"
                  onClick={() => handleViewDetails(doctor)}
                >
                  Xem chi tiết
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Doctors;