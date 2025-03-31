import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Định nghĩa interface cho ServiceItem (tái sử dụng từ Services.tsx)
interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Dữ liệu mẫu cho preview (chọn 3 dịch vụ nổi bật)
const previewServices: ServiceItem[] = [
  {
    title: "Khám Chuyên Khoa",
    description: "Đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm, trang thiết bị hiện đại.",
    icon: (
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
        className="lucide lucide-stethoscope"
      >
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    ),
  },
  {
    title: "Cấp Cứu 24/7",
    description: "Dịch vụ cấp cứu 24/7 với đội ngũ y bác sĩ luôn sẵn sàng.",
    icon: (
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
        className="lucide lucide-heart-pulse"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M3.22 12H9.5l.5-1 2 4 .5-1h6.78" />
      </svg>
    ),
  },
  {
    title: "Khám Sức Khỏe Tổng Quát",
    description: "Phát hiện sớm các vấn đề sức khỏe tiềm ẩn với gói khám tổng quát.",
    icon: (
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
        className="lucide lucide-clipboard-check"
      >
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="m9 14 2 2 4-4" />
      </svg>
    ),
  },
];

// Component ServiceCard đơn giản hóa cho Preview
const ServiceCardPreview = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-soft transition-transform hover:-translate-y-1 hover:shadow-md">
      <div className="w-10 h-10 rounded-lg bg-hospital-100 text-hospital-600 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
    </div>
  );
};

const ServicesPreview = () => {
  return (
    <section className="container mx-auto px-4 py-10">
      {/* Tiêu đề phần */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Dịch Vụ Của Chúng Tôi
        </h2>
        <p className="text-gray-600">
          Khám phá các dịch vụ y tế chất lượng cao mà chúng tôi cung cấp.
        </p>
      </div>

      {/* Danh sách dịch vụ rút gọn */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {previewServices.map((service, index) => (
          <ServiceCardPreview
            key={index}
            title={service.title}
            description={service.description}
            icon={service.icon}
          />
        ))}
      </div>

      {/* Nút dẫn đến trang Services chi tiết */}
      <div className="mt-8 text-center">
        <Link to="/services">
          <Button className="bg-hospital-500 hover:bg-hospital-600 text-white">
            Xem Tất Cả Dịch Vụ
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default ServicesPreview;