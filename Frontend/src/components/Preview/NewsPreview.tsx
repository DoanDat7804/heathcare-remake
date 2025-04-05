import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

// Định nghĩa interface cho NewsItem (tái sử dụng từ News.tsx)
interface NewsItem {
  id: number;
  title: string;
  summary: string;
  image: string;
  date: string;
  author: string;
}

// Dữ liệu mẫu (giới hạn 3 tin tức để hiển thị trên trang chủ)
const newsPreviewData: NewsItem[] = [
  {
    id: 1,
    title: "Kỹ thuật mới trong phẫu thuật tim mạch",
    summary: "Bệnh viện vừa triển khai kỹ thuật mới trong phẫu thuật tim mạch giúp rút ngắn thời gian hồi phục.",
    image: "https://placehold.co/600x400/e4f1fe/0ea5e9?text=Tin+tức+y+tế&font=playfair",
    date: "28/02/2023",
    author: "TS. BS. Nguyễn Văn A",
  },
  {
    id: 2,
    title: "Chương trình khám sức khỏe miễn phí cho người cao tuổi",
    summary: "Trong tháng 3, bệnh viện tổ chức chương trình khám sức khỏe miễn phí cho người cao tuổi.",
    image: "https://placehold.co/600x400/e4f1fe/0ea5e9?text=Sức+khỏe&font=playfair",
    date: "25/02/2023",
    author: "ThS. BS. Trần Thị B",
  },
  {
    id: 3,
    title: "Hội thảo dinh dưỡng cho bà mẹ mang thai",
    summary: "Hội thảo chia sẻ kiến thức và tư vấn chế độ ăn uống hợp lý cho bà mẹ mang thai.",
    image: "https://placehold.co/600x400/e4f1fe/0ea5e9?text=Dinh+dưỡng&font=playfair",
    date: "20/02/2023",
    author: "PGS. TS. Phạm Văn C",
  },
];

const NewsPreview = () => {
  return (
    <section className="container mx-auto px-4 py-10">
      {/* Tiêu đề phần */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Tin Tức Nổi Bật</h2>
        <p className="text-gray-600">Cập nhật những thông tin mới nhất từ bệnh viện</p>
      </div>

      {/* Danh sách tin tức rút gọn */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsPreviewData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-soft overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md"
          >
            <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <CalendarDays className="h-4 w-4 mr-1" />
                <span>{item.date}</span>
              </div>
              <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">{item.summary}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Nút dẫn đến trang News chi tiết */}
      <div className="mt-10 text-center">
        <Link to="/news">
          <Button className="bg-hospital-500 hover:bg-hospital-600 text-white">
            Xem Tất Cả Tin Tức
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default NewsPreview;