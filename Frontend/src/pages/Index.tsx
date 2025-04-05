import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesPreview from "@/components/Preview/ServicesPreview";
import DoctorsPreview from "@/components/Preview/DoctorsPreview";
import NewsPreview from "@/components/Preview/NewsPreview";
import AppointmentForm from "@/components/AppointmentForm";
import Chatbot from "@/pages/Chatbot"; // Sửa lỗi đánh máy từ Chabtbot thành Chatbot
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ServicesPreview />
      <DoctorsPreview />
      <NewsPreview />
      <AppointmentForm />
      <div className="container mx-auto px-4 py-10 text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Cổng Truy Cập Nội Bộ</h3>
        <div className="flex items-center justify-center space-x-6">
          <Link
            to="/doctor/login"
            className="flex flex-col items-center px-5 py-3 rounded-lg border border-gray-200 hover:bg-hospital-50 transition-colors"
          >
            <span className="text-hospital-600 font-medium">Cổng Bác Sĩ</span>
            <span className="text-xs text-gray-500 mt-1">Dành cho nhân viên y tế</span>
          </Link>
          <Link
            to="/admin/login"
            className="flex flex-col items-center px-5 py-3 rounded-lg border border-gray-200 hover:bg-gray-900 hover:text-white transition-colors"
          >
            <span className="text-gray-700 font-medium">Hệ Thống Quản Trị</span>
            <span className="text-xs text-gray-500 mt-1">Chỉ dành cho quản trị viên</span>
          </Link>
        </div>
      </div>
      {/* Thêm Chatbot vào đây */}
      <Chatbot />
      <Footer />
    </div>
  );
};

export default Index;