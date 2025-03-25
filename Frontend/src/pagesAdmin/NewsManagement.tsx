import React, { useState, useEffect } from 'react';
import { adminApi } from '../apis/adminApi'; // Đảm bảo đường dẫn đúng
import { toast } from 'react-toastify';

// Định nghĩa interface cho News dựa trên schema backend
interface Author {
  id: string;
  name: string;
  role: string;
}

interface News {
  _id: string;
  title: string;
  content: string;
  summary: string;
  author: Author;
}

const NewsManagement: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newNews, setNewNews] = useState<News>({
    _id: '',
    title: '',
    content: '',
    summary: '',
    author: { id: '', name: '', role: '' },
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await adminApi.getAllNews();
        setNews(response.data as News[]);
      } catch (err: any) {
        toast.error('Lỗi khi tải danh sách tin tức: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleAddNews = async () => {
    try {
      await adminApi.createNews(newNews);
      const response = await adminApi.getAllNews();
      setNews(response.data as News[]);
      setNewNews({ _id: '', title: '', content: '', summary: '', author: { id: '', name: '', role: '' } });
      setShowAddForm(false);
      toast.success('Thêm tin tức thành công!');
    } catch (err: any) {
      toast.error('Lỗi khi thêm tin tức: ' + err.message);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa tin tức này?')) {
      try {
        await adminApi.deleteNews(id);
        setNews(news.filter(item => item._id !== id));
        toast.success('Xóa tin tức thành công!');
      } catch (err: any) {
        toast.error('Lỗi khi xóa tin tức: ' + err.message);
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Tin Tức</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-1/3"
          />
          <button onClick={() => setShowAddForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Thêm Tin Tức
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4 p-4 border rounded">
            <input
              type="text"
              placeholder="Tiêu đề"
              value={newNews.title}
              onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <textarea
              placeholder="Tóm tắt"
              value={newNews.summary}
              onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <textarea
              placeholder="Nội dung"
              value={newNews.content}
              onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Tên tác giả"
              value={newNews.author.name}
              onChange={(e) => setNewNews({ ...newNews, author: { ...newNews.author, name: e.target.value } })}
              className="border p-2 rounded mb-2 w-full"
            />
            <button onClick={handleAddNews} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Lưu</button>
            <button onClick={() => setShowAddForm(false)} className="ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Hủy</button>
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">Tiêu đề</th>
              <th className="p-3 text-left">Tác giả</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredNews.map(item => (
              <tr key={item._id} className="border-t">
                <td className="p-3">{item.title}</td>
                <td className="p-3">{item.author.name}</td>
                <td className="p-3">
                  <button className="text-blue-600 mr-2">Sửa</button>
                  <button onClick={() => handleDeleteNews(item._id)} className="text-red-600">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsManagement;