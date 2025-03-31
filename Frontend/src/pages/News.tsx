import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CalendarDays, X } from "lucide-react";
import Footer from "@/components/Footer";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  image: string;
  date: string;
  author: string;
  content?: string;
}

const News = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem[]>([]); // State để lưu danh sách tin tức được chọn

  const news: NewsItem[] = [
    {
      id: 1,
      title: "Kỹ thuật mới trong phẫu thuật tim mạch",
      summary: "Bệnh viện vừa triển khai kỹ thuật mới trong phẫu thuật tim mạch giúp rút ngắn thời gian hồi phục của bệnh nhân.",
      image: "https://placehold.co/600x400/e4f1fe/0ea5e9?text=Tin+tức+y+tế&font=playfair",
      date: "28/02/2023",
      author: "TS. BS. Nguyễn Văn A",
      content: "Bệnh viện chúng tôi vừa áp dụng một kỹ thuật phẫu thuật tim mạch tiên tiến, cho phép bệnh nhân phục hồi nhanh hơn tới 30% so với các phương pháp truyền thống. Kỹ thuật này sử dụng thiết bị nội soi hiện đại và được thực hiện bởi đội ngũ bác sĩ giàu kinh nghiệm. Trong tháng đầu tiên áp dụng, đã có 15 ca phẫu thuật thành công với tỷ lệ biến chứng gần như bằng 0."
    },
    {
      id: 2,
      title: "Chương trình khám sức khỏe miễn phí cho người cao tuổi",
      summary: "Trong tháng 3, bệnh viện tổ chức chương trình khám sức khỏe miễn phí cho người cao tuổi trong khu vực.",
      image: "https://placehold.co/600x400/e4f1fe/0ea5e9?text=Sức+khỏe&font=playfair",
      date: "25/02/2023",
      author: "ThS. BS. Trần Thị B",
      content: "Chương trình khám sức khỏe miễn phí diễn ra từ ngày 1/3 đến 31/3, dành cho người trên 60 tuổi. Các dịch vụ bao gồm kiểm tra huyết áp, đường huyết, siêu âm và tư vấn sức khỏe. Dự kiến sẽ có hơn 500 người cao tuổi được hưởng lợi từ chương trình này. Đăng ký ngay tại quầy lễ tân bệnh viện hoặc qua hotline 1234-5678."
    },
    {
      id: 3,
      title: "Hội thảo dinh dưỡng cho bà mẹ mang thai",
      summary: "Bệnh viện tổ chức hội thảo về dinh dưỡng cho bà mẹ mang thai, chia sẻ kiến thức và tư vấn chế độ ăn uống hợp lý.",
      image: "https://placehold.co/600x400/e4f1fe/0ea5e9?text=Dinh+dưỡng&font=playfair",
      date: "20/02/2023",
      author: "PGS. TS. Phạm Văn C",
      content: "Hội thảo diễn ra vào ngày 25/3 tại hội trường bệnh viện, với sự tham gia của các chuyên gia dinh dưỡng hàng đầu. Nội dung bao gồm hướng dẫn chế độ ăn uống cho từng giai đoạn thai kỳ, cách bổ sung vi chất và giải đáp thắc mắc của các bà mẹ. Sự kiện miễn phí và mở cửa cho tất cả phụ nữ mang thai."
    },
    {
      id: 4,
      title: "Phòng ngừa các bệnh hô hấp trong mùa lạnh",
      summary: "Bác sĩ chuyên khoa hô hấp chia sẻ các biện pháp phòng ngừa các bệnh hô hấp thường gặp trong mùa lạnh.",
      image: "https://placehold.co/600x400/e4f1fe/0ea5e9?text=Phòng+bệnh&font=playfair",
      date: "15/02/2023",
      author: "BS. CKI. Lê Thị D",
      content: "Mùa lạnh là thời điểm dễ bùng phát các bệnh hô hấp như viêm phổi, cảm cúm. Bác sĩ khuyến cáo giữ ấm cơ thể, đeo khẩu trang khi ra ngoài, rửa tay thường xuyên và bổ sung vitamin C. Nếu có triệu chứng sốt cao hoặc khó thở, cần đến bệnh viện ngay lập tức để được thăm khám kịp thời."
    },
    {
      id: 5,
      title: "Trang thiết bị y tế mới được đưa vào sử dụng",
      summary: "Bệnh viện vừa đầu tư một số trang thiết bị y tế hiện đại, nâng cao chất lượng chẩn đoán và điều trị bệnh.",
      image: "https://placehold.co/600x400/e4f1fe/0ea5e9?text=Công+nghệ+y+tế&font=playfair",
      date: "10/02/2023",
      author: "PGS. TS. Hoàng Văn E",
      content: "Các thiết bị mới bao gồm máy MRI 3.0 Tesla, máy siêu âm 4D và hệ thống xét nghiệm tự động. Những thiết bị này giúp tăng độ chính xác trong chẩn đoán lên tới 95% và giảm thời gian chờ đợi của bệnh nhân. Dự kiến, hệ thống sẽ chính thức hoạt động từ tháng 4/2023."
    },
    {
      id: 6,
      title: "Kỹ thuật nội soi dạ dày không đau",
      summary: "Bệnh viện triển khai kỹ thuật nội soi dạ dày không đau, giúp bệnh nhân thoải mái hơn trong quá trình thăm khám.",
      image: "https://placehold.co/600x400/e4f1fe/0ea5e9?text=Nội+soi&font=playfair",
      date: "05/02/2023",
      author: "TS. BS. Vũ Thị F",
      content: "Kỹ thuật nội soi dạ dày không đau sử dụng thuốc gây tê nhẹ và ống nội soi siêu nhỏ, giúp bệnh nhân không còn cảm giác khó chịu. Thời gian thực hiện chỉ khoảng 10-15 phút, và bệnh nhân có thể về nhà ngay sau đó. Đây là bước tiến lớn trong việc nâng cao trải nghiệm khám chữa bệnh."
    }
  ];

  const handleViewDetails = (item: NewsItem) => {
    if (!selectedNews.some((newsItem) => newsItem.id === item.id)) {
      setSelectedNews((prev) => [...prev, item]);
    }
  };

  const handleCloseSidebar = () => {
    setSelectedNews([]); // Đóng khung bằng cách xóa danh sách
  };

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <div className="pt-20 bg-gradient-to-b from-hospital-60 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold mb-4">Tin Tức Y Tế</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cập nhật những thông tin mới nhất về y tế, sức khỏe và các hoạt động của bệnh viện
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-soft overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md"
              >
                <img src={item.image} alt={item.title} className="w-full h-52 object-cover" />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    <span>{item.date}</span>
                    <span className="mx-2">•</span>
                    <span>{item.author}</span>
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.summary}</p>
                  <Button
                    variant="outline"
                    className="text-hospital-600 border-hospital-200 hover:bg-hospital-50 hover:text-hospital-700"
                    onClick={() => handleViewDetails(item)}
                  >
                    Đọc thêm
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Khung ở giữa màn hình kiểu feed */}
      {selectedNews.length > 0 && (
        <div className="fixed inset-0 flex justify-center items-center z-50 animate-fade-in">
          {/* Nền mờ với hiệu ứng chuyển động nhẹ */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-black/80 backdrop-blur-sm"
            onClick={handleCloseSidebar}
          ></div>

          {/* Khung feed chính */}
          <div className="relative w-[85%] h-[95vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
            {/* Header cố định */}
            <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200 z-10 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">
                  Tin Tức Nổi Bật
                </h2>
                <button
                  onClick={handleCloseSidebar}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                  aria-label="Đóng"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Nội dung bài báo */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-8">
              {selectedNews.map((item) => (
                <article key={item.id} className="space-y-6">
                  {/* Tiêu đề bài viết */}
                  <h1 className="text-4xl font-serif font-bold text-gray-900 leading-tight">
                    {item.title}
                  </h1>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{item.date}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="font-medium text-gray-600">{item.author}</span>
                  </div>

                  {/* Hình ảnh nổi bật */}
                  <figure className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-96 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-[1.02]"
                    />
                    <figcaption className="mt-2 text-sm text-gray-500 italic">
                      {item.title}
                    </figcaption>
                  </figure>

                  {/* Tóm tắt */}
                  <p className="text-lg text-gray-700 font-sans leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                    {item.summary}
                  </p>

                  {/* Nội dung chi tiết */}
                  <div className="prose prose-lg max-w-none text-gray-800 font-sans leading-8">
                    <p>{item.content || "Chưa có thông tin chi tiết."}</p>
                  </div>

                  {/* Đường phân cách */}
                  <hr className="border-gray-200 my-8" />
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default News;