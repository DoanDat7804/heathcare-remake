import React, { useState, useEffect } from 'react';
import { adminApi } from '../apis/adminApi';
import { toast } from 'react-toastify';

interface Author {
  id: string;
  name: string;
  role?: string;
}

interface News {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: Author;
  thumbnail?: string;
  isPublished: boolean;
  publishDate?: Date | string;
}

const NewsManagement: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [newNews, setNewNews] = useState<News>({
    _id: '',
    title: '',
    slug: '',
    summary: '',
    content: '',
    author: { id: '', name: '', role: 'author' },
    thumbnail: '',
    isPublished: false,
    publishDate: '',
  });
  const [editNews, setEditNews] = useState<News | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await adminApi.getAllNews();
        setNews(data || []);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Không thể kết nối đến server';
        console.error('Lỗi khi tải danh sách tin tức:', err);
        toast.error('Lỗi khi tải danh sách tin tức: ' + errorMessage);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleAddNews = async () => {
    if (
      !newNews.title ||
      !newNews.summary ||
      !newNews.content ||
      !newNews.author.id ||
      !newNews.author.name
    ) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc: tiêu đề, tóm tắt, nội dung, ID và tên tác giả');
      return;
    }

    const newsData = {
      title: newNews.title,
      slug: newNews.slug || newNews.title.toLowerCase().replace(/ /g, '-'), // Tạo slug nếu không nhập
      summary: newNews.summary,
      content: newNews.content,
      author: {
        id: newNews.author.id,
        name: newNews.author.name,
        role: newNews.author.role || 'author', // Mặc định role
      },
      thumbnail: newNews.thumbnail || '',
      isPublished: newNews.isPublished,
      publishDate: newNews.publishDate ? new Date(newNews.publishDate).toISOString() : new Date().toISOString(),
    };

    try {
      console.log('Dữ liệu gửi đi (POST):', newsData); // Log để debug
      await adminApi.createNews(newsData);
      const data = await adminApi.getAllNews();
      setNews(data || []);
      setNewNews({
        _id: '',
        title: '',
        slug: '',
        summary: '',
        content: '',
        author: { id: '', name: '', role: 'author' },
        thumbnail: '',
        isPublished: false,
        publishDate: '',
      });
      setShowAddForm(false);
      toast.success('Thêm tin tức thành công!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Không thể kết nối đến server';
      console.error('Lỗi từ server (POST):', err);
      toast.error('Lỗi khi thêm tin tức: ' + errorMessage);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa tin tức này?')) {
      try {
        await adminApi.deleteNews(id);
        setNews(news.filter((item) => item._id !== id));
        toast.success('Xóa tin tức thành công!');
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Không thể kết nối đến server';
        toast.error('Lỗi khi xóa tin tức: ' + errorMessage);
      }
    }
  };

  const handleEditNews = (newsItem: News) => {
    setEditNews(newsItem);
    setShowEditForm(true);
  };

  const handleUpdateNews = async () => {
    if (!editNews) return;
    if (!editNews.title || !editNews.summary || !editNews.content) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc: tiêu đề, tóm tắt, nội dung');
      return;
    }
  
    const updateData = {
      title: editNews.title,
      slug: editNews.slug,
      summary: editNews.summary,
      content: editNews.content,
      author: editNews.author, // Thêm author từ editNews
      thumbnail: editNews.thumbnail,
      isPublished: editNews.isPublished,
      publishDate: editNews.publishDate ? new Date(editNews.publishDate).toISOString() : undefined,
    };
  
    try {
      console.log('Dữ liệu gửi đi (PATCH):', updateData); // Log để debug
      await adminApi.updateNews(editNews._id, updateData);
      const data = await adminApi.getAllNews();
      setNews(data || []);
      setShowEditForm(false);
      setEditNews(null);
      toast.success('Cập nhật tin tức thành công!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Không thể kết nối đến server';
      console.error('Lỗi từ server (PATCH):', err.response?.data); // Log chi tiết
      toast.error('Lỗi khi cập nhật tin tức: ' + errorMessage);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  const filteredNews = Array.isArray(news)
    ? news.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

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
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm Tin Tức
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4 p-4 border rounded">
            <input
              type="text"
              placeholder="Tiêu đề *"
              value={newNews.title}
              onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Slug * (để trống sẽ tự tạo)"
              value={newNews.slug}
              onChange={(e) => setNewNews({ ...newNews, slug: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <textarea
              placeholder="Tóm tắt *"
              value={newNews.summary}
              onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <textarea
              placeholder="Nội dung *"
              value={newNews.content}
              onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="ID tác giả *"
              value={newNews.author.id}
              onChange={(e) =>
                setNewNews({ ...newNews, author: { ...newNews.author, id: e.target.value } })
              }
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Tên tác giả *"
              value={newNews.author.name}
              onChange={(e) =>
                setNewNews({ ...newNews, author: { ...newNews.author, name: e.target.value } })
              }
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Vai trò tác giả (mặc định: author)"
              value={newNews.author.role}
              onChange={(e) =>
                setNewNews({ ...newNews, author: { ...newNews.author, role: e.target.value } })
              }
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Thumbnail URL"
              value={newNews.thumbnail}
              onChange={(e) => setNewNews({ ...newNews, thumbnail: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={newNews.isPublished}
                onChange={(e) => setNewNews({ ...newNews, isPublished: e.target.checked })}
              />
              <span className="ml-2">Công khai</span>
            </label>
            <input
              type="date"
              value={
                newNews.publishDate instanceof Date
                  ? newNews.publishDate.toISOString().split('T')[0]
                  : newNews.publishDate || ''
              }
              onChange={(e) => setNewNews({ ...newNews, publishDate: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <button
              onClick={handleAddNews}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Lưu
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Hủy
            </button>
          </div>
        )}

        {showEditForm && editNews && (
          <div className="mb-4 p-4 border rounded">
            <input
              type="text"
              placeholder="Tiêu đề *"
              value={editNews.title}
              onChange={(e) => setEditNews({ ...editNews, title: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Slug *"
              value={editNews.slug}
              onChange={(e) => setEditNews({ ...editNews, slug: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <textarea
              placeholder="Tóm tắt *"
              value={editNews.summary}
              onChange={(e) => setEditNews({ ...editNews, summary: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <textarea
              placeholder="Nội dung *"
              value={editNews.content}
              onChange={(e) => setEditNews({ ...editNews, content: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Thumbnail URL"
              value={editNews.thumbnail}
              onChange={(e) => setEditNews({ ...editNews, thumbnail: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={editNews.isPublished}
                onChange={(e) => setEditNews({ ...editNews, isPublished: e.target.checked })}
              />
              <span className="ml-2">Công khai</span>
            </label>
            <button
              onClick={handleUpdateNews}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Lưu
            </button>
            <button
              onClick={() => setShowEditForm(false)}
              className="ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Hủy
            </button>
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
            {filteredNews.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-3">{item.title}</td>
                <td className="p-3">{item.author.name}</td>
                <td className="p-3">
                  <button onClick={() => handleEditNews(item)} className="text-blue-600 mr-2">
                    Sửa
                  </button>
                  <button onClick={() => handleDeleteNews(item._id)} className="text-red-600">
                    Xóa
                  </button>
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