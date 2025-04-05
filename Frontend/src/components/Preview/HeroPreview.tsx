import { Link } from "react-router-dom";

const HeroPreview = () => {
  return (
    <section className="bg-hospital-500 text-white py-16 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">Chào Mừng Đến Với Bệnh Viện Của Sự Chăm Sóc</h1>
        <p className="text-lg mb-6">Chúng tôi mang đến dịch vụ y tế tốt nhất cho bạn và gia đình.</p>
        <Link
          to="/about"
          className="inline-block px-6 py-3 bg-white text-hospital-500 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Tìm Hiểu Thêm
        </Link>
      </div>
    </section>
  );
};

export default HeroPreview;