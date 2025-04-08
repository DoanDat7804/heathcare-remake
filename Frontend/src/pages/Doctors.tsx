import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorApi } from '../apis/doctorApi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

// Base URL của backend (thay đổi nếu cần)
const BASE_URL = 'http://localhost:3000'; // Đảm bảo khớp với port backend

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Tất cả các khoa');
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null); // Ép kiểu ref cho TypeScript

  const token = 'your-jwt-token'; // Thay bằng token thực tế

  const specialties = [
    'Tất cả các khoa',
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
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await doctorApi.getAllDoctors(config);
        const data = response.data || response;
        const doctorList = Array.isArray(data) ? data : [];
        const normalizedDoctors = doctorList.map((doctor) => ({
          ...doctor,
          avatar: doctor.avatar ? `${BASE_URL}${doctor.avatar}` : null,
        }));
        setDoctors(normalizedDoctors);
        setFilteredDoctors(normalizedDoctors);
      } catch (err) {
        console.error('Lỗi khi tải danh sách bác sĩ:', err);
        setDoctors([]);
        setFilteredDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    let filtered = doctors;
    if (selectedSpecialty !== 'Tất cả các khoa') {
      filtered = filtered.filter((doctor) => doctor.specialty === selectedSpecialty);
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((doctor) =>
        [
          doctor.name,
          doctor.specialty,
          doctor.email,
          doctor.phone,
          doctor.gender,
          doctor.isActive ? 'hoạt động' : 'không hoạt động',
        ]
          .filter(Boolean)
          .some((field) => field?.toLowerCase().includes(searchLower))
      );
    }
    setFilteredDoctors(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedSpecialty, doctors]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleViewDetails = (doctor: any) => {
    navigate('/doctors/detail', { state: { doctor } });
  };

  const totalItems = filteredDoctors.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDoctors = filteredDoctors.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-grow section-container bg-hospital-60 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-hospital-700 mb-8 text-center">Danh sách bác sĩ</h1>

          {/* Thanh tìm kiếm và dropdown */}
          <div className="mb-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm bác sĩ (tên, chuyên khoa, email, v.v.)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-[65%] p-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />
            <div className="relative w-full sm:max-w-[320px]" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full p-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition"
              >
                {selectedSpecialty}
              </button>
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto transition-all duration-300 ease-in-out">
                  {specialties.map((spec) => (
                    <div
                      key={spec}
                      onClick={() => {
                        setSelectedSpecialty(spec);
                        setShowDropdown(false);
                      }}
                      className="p-2 text-gray-700 hover:bg-blue-50 cursor-pointer transition"
                    >
                      {spec}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="text-center text-gray-600">Không tìm thấy bác sĩ nào</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {currentDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-soft hover:bg-hospital-100 transition"
                  >
                    <img
                      src={doctor.avatar || 'https://via.placeholder.com/100'}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-full object-cover"
                      onError={(e) => ((e.target as HTMLImageElement).src = 'https://via.placeholder.com/100')}
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

              {totalItems > ITEMS_PER_PAGE && (
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-gray-600">
                    Hiển thị {startIndex + 1} - {Math.min(endIndex, totalItems)} trong tổng số {totalItems} bác sĩ
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-hospital-500 text-white hover:bg-hospital-600'}`}
                    >
                      Trước
                    </Button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 ${currentPage === page ? 'bg-hospital-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-hospital-500 text-white hover:bg-hospital-600'}`}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Doctors;