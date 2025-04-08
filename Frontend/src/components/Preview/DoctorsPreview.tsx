import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { doctorApi } from '@/apis/doctorApi';

const BASE_URL = 'http://localhost:3000';

// Định nghĩa interface cho DoctorItem, làm _id tùy chọn
interface DoctorItem {
  _id?: string; // Thay đổi thành tùy chọn vì không dùng trong DoctorCardPreview
  name: string;
  specialty: string;
  avatar?: string;
}

// Component DoctorCardPreview
const DoctorCardPreview = ({ name, specialty, avatar }: DoctorItem) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-soft transition-transform hover:-translate-y-1 hover:shadow-md flex flex-col items-center">
      <img
        src={avatar ? `${BASE_URL}${avatar}` : 'https://via.placeholder.com/150'}
        alt={name}
        className="w-32 h-32 rounded-full object-cover mb-3"
        onError={(e) => ((e.target as HTMLImageElement).src = 'https://via.placeholder.com/150')}
      />
      <h3 className="text-lg font-semibold text-gray-900 text-center">{name}</h3>
      <p className="text-gray-600 text-sm text-center">{specialty}</p>
    </div>
  );
};

const DoctorsPreview = () => {
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorApi.getAllDoctors();
        const data = response.data || response;
        const doctorList = Array.isArray(data) ? data : [];
        // Lấy 3 bác sĩ đầu tiên
        const previewDoctors = doctorList.slice(0, 3).map((doctor: any) => ({
          _id: doctor._id,
          name: doctor.name,
          specialty: doctor.specialty,
          avatar: doctor.avatar || null,
        }));
        setDoctors(previewDoctors);
      } catch (err) {
        console.error('Lỗi khi tải danh sách bác sĩ:', err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-10 text-center">
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10">
      {/* Tiêu đề phần */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Đội Ngũ Bác Sĩ
        </h2>
        <p className="text-gray-600">
          Gặp gỡ đội ngũ bác sĩ giàu kinh nghiệm của chúng tôi.
        </p>
      </div>

      {/* Danh sách bác sĩ rút gọn */}
      {doctors.length === 0 ? (
        <div className="text-center text-gray-600">Không có bác sĩ nào để hiển thị.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCardPreview
              key={doctor._id} // Dùng _id làm key
              name={doctor.name}
              specialty={doctor.specialty}
              avatar={doctor.avatar}
            />
          ))}
        </div>
      )}

      {/* Nút dẫn đến trang Doctors chi tiết */}
      <div className="mt-8 text-center">
        <Link to="/doctors">
          <Button className="bg-hospital-500 hover:bg-hospital-600 text-white">
            Xem Tất Cả Bác Sĩ
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default DoctorsPreview;