import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react"; // Thêm import này

const ServiceCard = ({ 
  title, 
  description, 
  icon, 
  className = "", 
  delay = "",
  onViewDetails
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  className?: string;
  delay?: string;
  onViewDetails: () => void;
}) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-2xl p-6 shadow-soft transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]",
        `animate-fade-in ${delay}`,
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-hospital-100 text-hospital-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button 
        variant="ghost" 
        className="p-0 h-auto hover:bg-transparent hover:text-hospital-600 group"
        onClick={onViewDetails}
      >
        Tìm hiểu thêm
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
};

const Services = () => {
  const [selectedService, setSelectedService] = useState(null); // Sử dụng useState đã import

  const services = [
    {
      title: "Khám Chuyên Khoa",
      description: "Đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm, trang thiết bị hiện đại.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-stethoscope"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>,
      details: "Dịch vụ khám chuyên khoa bao gồm các lĩnh vực như tim mạch, nội tiết, tiêu hóa, thần kinh, và nhiều chuyên khoa khác. Chúng tôi sử dụng các thiết bị y tế tiên tiến để đảm bảo chẩn đoán chính xác và điều trị hiệu quả."
    },
    {
      title: "Cấp Cứu 24/7",
      description: "Dịch vụ cấp cứu 24/7 với đội ngũ y bác sĩ luôn sẵn sàng xử lý mọi tình huống.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4 .5-1h6.78"/></svg>,
      details: "Đội ngũ cấp cứu của chúng tôi hoạt động 24/7, sẵn sàng tiếp nhận và xử lý các trường hợp khẩn cấp như tai nạn, đột quỵ, nhồi máu cơ tim với xe cứu thương hiện đại và quy trình nhanh chóng."
    },
    {
      title: "Khám Sức Khỏe Tổng Quát",
      description: "Gói khám sức khỏe tổng quát giúp phát hiện sớm các vấn đề sức khỏe tiềm ẩn.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>,
      details: "Gói khám sức khỏe tổng quát bao gồm xét nghiệm máu, siêu âm, X-quang và tư vấn từ các chuyên gia để đánh giá toàn diện tình trạng sức khỏe của bạn."
    },
    {
      title: "Xét Nghiệm & Chẩn Đoán Hình Ảnh",
      description: "Hệ thống xét nghiệm và chẩn đoán hình ảnh hiện đại, kết quả nhanh chóng, chính xác.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-microscope"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>,
      details: "Chúng tôi cung cấp các dịch vụ xét nghiệm máu, nước tiểu, sinh hóa và chẩn đoán hình ảnh như MRI, CT, siêu âm với công nghệ tiên tiến nhất."
    },
    {
      title: "Phẫu Thuật",
      description: "Đội ngũ bác sĩ phẫu thuật giàu kinh nghiệm, áp dụng các kỹ thuật hiện đại.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scissors"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg>,
      details: "Dịch vụ phẫu thuật bao gồm phẫu thuật nội soi, phẫu thuật tim mạch, chỉnh hình và các ca phẫu thuật phức tạp khác, đảm bảo an toàn và hiệu quả cao."
    },
    {
      title: "Tư Vấn Dinh Dưỡng",
      description: "Tư vấn chế độ dinh dưỡng phù hợp với tình trạng sức khỏe của từng bệnh nhân.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>,
      details: "Chuyên gia dinh dưỡng sẽ xây dựng chế độ ăn uống cá nhân hóa dựa trên tình trạng sức khỏe, độ tuổi và nhu cầu cụ thể của bạn."
    },
  ];

  const handleViewDetails = (service) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  return (
    <>
      <Navbar />
      <section id="services" className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <span className="inline-block px-4 py-1 rounded-full bg-hospital-100 text-hospital-700 font-medium text-sm mb-4">Dịch Vụ Y Tế</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Các Dịch Vụ Chăm Sóc Sức Khỏe</h2>
          <p className="text-gray-600">
            Chúng tôi cung cấp các dịch vụ y tế chất lượng cao, đáp ứng mọi nhu cầu chăm sóc sức khỏe của bạn và gia đình.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              delay={`animate-delay-${Math.min(index * 100, 500)}`}
              onViewDetails={() => handleViewDetails(service)}
            />
          ))}
        </div>

        {/* Modal hiển thị thông tin chi tiết */}
        {selectedService && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 relative animate-fade-in">
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-hospital-100 text-hospital-600 flex items-center justify-center">
                  {selectedService.icon}
                </div>
                <h3 className="text-2xl font-bold text-hospital-700">{selectedService.title}</h3>
                <p className="text-gray-600 text-center">{selectedService.details || "Chưa có thông tin chi tiết."}</p>
                <Button 
                  variant="outline" 
                  className="mt-4 border-hospital-500 text-hospital-500 hover:bg-hospital-50"
                  onClick={handleCloseModal}
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer /> 
    </>
  );
};

export default Services;