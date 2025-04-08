import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CalendarDays, X } from "lucide-react";
import Footer from "@/components/Footer";
import { newsApi } from "../apis/newsApi";
import { toast } from "react-toastify";

interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  thumbnail: string;
  publishDate: string; // Đổi từ date thành publishDate để khớp backend
  author: { id: string; name: string; role?: string; _id?: string };
  content?: string;
  isPublished: boolean;
}

const News = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsApi.getAllNews();
        const newsData = Array.isArray(response.data) ? response.data : [];
        setNews(newsData.filter((item: NewsItem) => item.isPublished));
      } catch (error: any) {
        console.error("Error fetching news:", error);
        toast.error(error.response?.data?.message || "Không thể tải tin tức!");
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleViewDetails = (item: NewsItem) => {
    if (!selectedNews.some((newsItem) => newsItem._id === item._id)) {
      setSelectedNews((prev) => [...prev, item]);
    }
  };

  const handleCloseSidebar = () => {
    setSelectedNews([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang tải tin tức...</p>
      </div>
    );
  }

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

          {news.length === 0 ? (
            <p className="text-center text-gray-500">Hiện tại không có tin tức nào.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-soft overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  <img
                    src={item.thumbnail || "https://placehold.co/600x400?text=No+Image"}
                    alt={item.title}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      <span>{new Date(item.publishDate).toLocaleDateString("vi-VN")}</span>
                      <span className="mx-2">•</span>
                      <span>{item.author.name}</span>
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
          )}
        </div>
      </div>

      {selectedNews.length > 0 && (
        <div className="fixed inset-0 flex justify-center items-center z-50 animate-fade-in">
          <div
            className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-black/80 backdrop-blur-sm"
            onClick={handleCloseSidebar}
          ></div>
          <div className="relative w-[85%] h-[95vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
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
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-8">
              {selectedNews.map((item) => (
                <article key={item._id} className="space-y-6">
                  <h1 className="text-4xl font-serif font-bold text-gray-900 leading-tight">
                    {item.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{new Date(item.publishDate).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="font-medium text-gray-600">{item.author.name}</span>
                  </div>
                  <figure className="relative">
                    <img
                      src={item.thumbnail || "https://placehold.co/600x400?text=No+Image"}
                      alt={item.title}
                      className="w-full h-96 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-[1.02]"
                    />
                    <figcaption className="mt-2 text-sm text-gray-500 italic">
                      {item.title}
                    </figcaption>
                  </figure>
                  <p className="text-lg text-gray-700 font-sans leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                    {item.summary}
                  </p>
                  <div className="prose prose-lg max-w-none text-gray-800 font-sans leading-8">
                    <p>{item.content || "Chưa có thông tin chi tiết."}</p>
                  </div>
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