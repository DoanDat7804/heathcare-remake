import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import { newsApi } from '@/apis/newsApi';


// Định nghĩa interface cho NewsItem, thêm isPublished
interface NewsItem {
  _id: string;
  title: string;
  summary: string;
  thumbnail: string;
  publishDate: string;
  author: { id: string; name: string; role?: string; _id?: string };
  isPublished: boolean; // Thêm thuộc tính này
}

const NewsPreview = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsApi.getAllNews();
        const newsData = Array.isArray(response.data) ? response.data : [];
        // Lấy 3 tin tức đầu tiên đã được xuất bản
        const previewNews = newsData
          .filter((item: NewsItem) => item.isPublished)
          .slice(0, 3);
        setNews(previewNews);
      } catch (error: any) {
        console.error('Lỗi khi tải tin tức:', error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-10 text-center">
        <p className="text-gray-600">Đang tải tin tức...</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10">
      {/* Tiêu đề phần */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Tin Tức Nổi Bật</h2>
        <p className="text-gray-600">Cập nhật những thông tin mới nhất từ bệnh viện</p>
      </div>

      {/* Danh sách tin tức rút gọn */}
      {news.length === 0 ? (
        <div className="text-center text-gray-600">Không có tin tức nào để hiển thị.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-soft overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src={item.thumbnail || 'https://placehold.co/600x400?text=No+Image'}
                alt={item.title}
                className="w-full h-40 object-cover"
                onError={(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image')}
              />
              <div className="p-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  <span>{new Date(item.publishDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">{item.summary}</p>
              </div>
            </div>
          ))}
        </div>
      )}

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