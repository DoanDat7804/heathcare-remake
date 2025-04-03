import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Introduce = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Section chính */}
      <section className="flex-grow bg-hospital-60 py-16 pt-20 md:pt-24">
        {/* Tăng padding-top từ mặc định lên pt-20 (80px) hoặc pt-24 (96px) */}
        <div className="container mx-auto px-4">
          {/* Tiêu đề */}
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            <span className="inline-block px-4 py-1 rounded-full bg-hospital-100 text-hospital-700 font-medium text-sm mb-4">
              Giới Thiệu
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Về HealthCare
            </h1>
            <p className="text-gray-600">
              Chào mừng bạn đến với HealthCare - nơi mang đến dịch vụ y tế chất lượng cao và sự chăm sóc tận tâm.
            </p>
          </div>

          {/* Nội dung giới thiệu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Phần văn bản */}
            <div className="space-y-6 animate-fade-in animate-delay-200">
              <h2 className="text-2xl font-semibold text-gray-900">
                Chúng Tôi Là Ai?
              </h2>
              <p className="text-gray-600">
                HealthCare là một hệ thống y tế hiện đại, được xây dựng với mục tiêu cung cấp các dịch vụ chăm sóc sức khỏe toàn diện cho cộng đồng. Chúng tôi tự hào sở hữu đội ngũ y bác sĩ giàu kinh nghiệm, trang thiết bị tiên tiến và cam kết đặt sức khỏe của bạn lên hàng đầu.
              </p>
              <p className="text-gray-600">
                Website của chúng tôi không chỉ là nơi để bạn đặt lịch khám bệnh mà còn là nguồn thông tin đáng tin cậy về sức khỏe, tin tức y tế và các dịch vụ chuyên sâu.
              </p>
              <div className="flex space-x-4">
                <Link to="/services">
                  <Button className="bg-hospital-500 hover:bg-hospital-600 text-white">
                    Khám Phá Dịch Vụ
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button variant="outline" className="border-hospital-500 text-hospital-500 hover:bg-hospital-50">
                    Gặp Đội Ngũ Bác Sĩ
                  </Button>
                </Link>
              </div>
            </div>

            {/* Phần hình ảnh */}
            <div className="animate-fade-in animate-delay-400">
              <img
                src="src/img/team heal.jpg"
                alt="HealthCare Team"
                className="w-full h-auto rounded-xl shadow-soft object-cover"
              />
            </div>
          </div>

          {/* Đặc điểm nổi bật */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">
              Điều Gì Làm Nên HealthCare?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-soft text-center animate-fade-in animate-delay-200">
                <div className="w-12 h-12 rounded-full bg-hospital-100 text-hospital-600 flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-heart"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chăm Sóc Tận Tâm
                </h3>
                <p className="text-gray-600 text-sm">
                  Chúng tôi luôn đặt bệnh nhân làm trung tâm, mang đến sự chăm sóc tận tình và chu đáo.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-soft text-center animate-fade-in animate-delay-400">
                <div className="w-12 h-12 rounded-full bg-hospital-100 text-hospital-600 flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-shield"
                  >
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Công Nghệ Hiện Đại
                </h3>
                <p className="text-gray-600 text-sm">
                  Trang thiết bị y tế tiên tiến giúp chẩn đoán chính xác và điều trị hiệu quả.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-soft text-center animate-fade-in animate-delay-600">
                <div className="w-12 h-12 rounded-full bg-hospital-100 text-hospital-600 flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-users"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Đội Ngũ Chuyên Gia
                </h3>
                <p className="text-gray-600 text-sm">
                  Đội ngũ bác sĩ hàng đầu với chuyên môn cao và nhiều năm kinh nghiệm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Introduce;