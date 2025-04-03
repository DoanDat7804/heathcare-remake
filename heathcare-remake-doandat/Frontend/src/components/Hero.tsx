import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import MinhAnh from "@/img/Minh anh.jpg";
import Tieutiennu from "@/img/Tieu-tien-nu.jpg";

const Hero = () => {
  const images = [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1470&auto=format&fit=crop",
    "https://i.pinimg.com/736x/d5/5e/84/d55e84801da45b86853616b144ed0fab.jpg",
  ];

  return (
    <section id="home" className="relative min-h-screen pt-20 flex items-center">
      {/* Background decor */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-3/4 h-screen bg-hospital-50 rounded-bl-[100px] opacity-70"></div>
        <div className="appointment-blob absolute top-40 right-20 w-32 h-32 bg-hospital-100 opacity-60"></div>
        <div className="appointment-blob absolute top-1/3 right-40 w-24 h-24 bg-hospital-200 opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 pt-16 md:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="inline-block px-4 py-1 rounded-full bg-hospital-100 text-hospital-700 font-medium text-sm mb-6 animate-scale-in">
              Trung tâm Y tế Chất lượng Cao
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 animate-slide-in">
              Chăm Sóc <span className="text-hospital-600">Sức Khỏe</span> Uy Tín và Chuyên Nghiệp
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-xl animate-slide-in animate-delay-100">
              Đội ngũ y bác sĩ giàu kinh nghiệm cùng trang thiết bị hiện đại, mang đến dịch vụ y tế tốt nhất cho bạn và gia đình.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-in animate-delay-200">
            <Link to="/booking">
              <Button className="bg-hospital-500 hover:bg-hospital-600 text-white rounded-full px-8 py-6" size="lg">
                <Calendar className="mr-2 h-5 w-5" />
                  Đặt Lịch Khám Ngay
              </Button>
            </Link>
              {/* Bọc Button trong Link để điều hướng sang /introduce */}
              <Link to="/introduce">
                <Button variant="outline" className="rounded-full px-8 py-6 hover:bg-hospital-50" size="lg">
                  Tìm Hiểu Thêm
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-12 animate-slide-in animate-delay-300">
              <div className="flex -space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-sm font-medium">
                  +
                </div>
                <img
                  src={MinhAnh}
                  alt="Minh Anh"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
                <img
                  src={Tieutiennu}
                  alt="Tieu Tien Nu"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
                <img
                  src={Tieutiennu}
                  alt="Tieu Tien Nu"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              </div>
              <div>
                <div className="font-semibold">2,000+ Bệnh nhân hài lòng</div>
                <div className="text-sm text-gray-500">Trong năm qua</div>
              </div>
            </div>
          </div>

          {/* Right Content - Slider */}
          <div className="order-1 lg:order-2 animate-fade-in animate-delay-200">
            <div className="relative">
              <div className="absolute -top-5 -left-5 w-24 h-24 bg-hospital-100 rounded-2xl -z-10 animate-float"></div>

              {/* Swiper Slider */}
              <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-soft">
                <Swiper
                  modules={[Pagination, Autoplay]}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3000 }}
                  loop={true}
                  className="w-full h-full"
                >
                  {images.map((src, index) => (
                    <SwiperSlide key={index}>
                      <img src={src} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="absolute bottom-[-10%] right-[5%] z-20 bg-white/40 backdrop-blur-lg rounded-xl p-4 max-w-xs shadow-soft animate-float animate-delay-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-hospital-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">TS</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">TS. Nguyễn Văn A</p>
                    <p className="text-xs text-gray-500">Trưởng khoa Nội</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  "Chúng tôi cam kết mang đến dịch vụ y tế chất lượng cao với sự tận tâm."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;