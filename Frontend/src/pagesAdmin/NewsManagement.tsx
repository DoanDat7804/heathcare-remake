import React, { useState, useEffect } from 'react';
import { adminApi } from '../apis/adminApi';
import { toast } from 'react-toastify';

interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  thumbnail: string;
  date: string;
  author: { id: string; name: string; role?: string; _id?: string };
  content?: string;
  isPublished: boolean;
}

const NewsManagement: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [newNews, setNewNews] = useState<NewsItem & { file?: File | null }>({
    _id: '',
    title: '',
    slug: '',
    summary: '',
    thumbnail: '',
    date: '',
    author: { id: 'default-id', name: '' },
    content: '',
    isPublished: false,
    file: null,
  });
  const [editNews, setEditNews] = useState<NewsItem & { file?: File | null } | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Token không tồn tại. Vui lòng đăng nhập.');
        }
        const data = await adminApi.getAllNews(token);
        setNews(data || []);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Không thể kết nối đến server';
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
      !newNews.slug ||
      !newNews.summary ||
      !newNews.content ||
      !newNews.author.name ||
      !newNews.author.id
    ) {
      toast.error(
        'Vui lòng điền đầy đủ các trường bắt buộc: tiêu đề, slug, tóm tắt, nội dung, ID tác giả, tên tác giả'
      );
      return;
    }

    const formData = new FormData();
    formData.append('title', newNews.title);
    formData.append('slug', newNews.slug);
    formData.append('summary', newNews.summary);
    formData.append('content', newNews.content);
    formData.append('author', JSON.stringify(newNews.author));
    formData.append('isPublished', String(newNews.isPublished));
    formData.append(
      'publishDate',
      newNews.date ? new Date(newNews.date).toISOString() : new Date().toISOString()
    );
    if (newNews.file) {
      formData.append('thumbnail', newNews.file);
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Token không tồn tại. Vui lòng đăng nhập.');
      }
      await adminApi.createNews(formData, token);
      const data = await adminApi.getAllNews(token);
      setNews(data || []);
      setNewNews({
        _id: '',
        title: '',
        slug: '',
        summary: '',
        thumbnail: '',
        date: '',
        author: { id: 'default-id', name: '' },
        content: '',
        isPublished: false,
        file: null,
      });
      setShowAddForm(false);
      toast.success('Thêm tin tức thành công!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Không thể kết nối đến server';
      toast.error('Lỗi khi thêm tin tức: ' + errorMessage);
    }
  };

  const handleUpdateNews = async () => {
    if (!editNews || !editNews._id) {
      toast.error('Không có tin tức để cập nhật hoặc ID không hợp lệ');
      return;
    }
    if (!editNews.title || !editNews.slug || !editNews.summary || !editNews.content) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc: tiêu đề, slug, tóm tắt, nội dung');
      return;
    }

    const formData = new FormData();
    formData.append('title', editNews.title);
    const originalNews = news.find((item) => item._id === editNews._id);
    if (editNews.slug !== originalNews?.slug) {
      formData.append('slug', editNews.slug);
    }
    formData.append('summary', editNews.summary);
    formData.append('content', editNews.content);
    formData.append('author', JSON.stringify(editNews.author));
    formData.append('isPublished', String(editNews.isPublished));
    if (editNews.date) {
      formData.append('publishDate', new Date(editNews.date).toISOString());
    }
    if (editNews.file) {
      formData.append('thumbnail', editNews.file);
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Token không tồn tại. Vui lòng đăng nhập.');
      }
      await adminApi.updateNews(editNews._id, formData, token);
      const data = await adminApi.getAllNews(token);
      setNews(data || []);
      setShowEditForm(false);
      setEditNews(null);
      toast.success('Cập nhật tin tức thành công!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Không thể kết nối đến server';
      toast.error('Lỗi khi cập nhật tin tức: ' + errorMessage);
    }
  };

  const handleEditNews = (newsItem: NewsItem) => {
    setEditNews({ ...newsItem, file: null });
    setShowEditForm(true);
  };

  const handleDeleteNews = async (id: string) => {
    if (!id || !confirm('Bạn có chắc chắn muốn xóa tin tức này không?')) {
      toast.error('ID tin tức không hợp lệ hoặc hành động bị hủy');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Token không tồn tại. Vui lòng đăng nhập.');
      }
      await adminApi.deleteNews(id, token);
      const data = await adminApi.getAllNews(token);
      setNews(data || []);
      toast.success('Xóa tin tức thành công!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Không thể xóa tin tức';
      toast.error('Lỗi khi xóa tin tức: ' + errorMessage);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  // Logic tìm kiếm theo tiêu đề, tên tác giả và ID tác giả
  const filteredNews = Array.isArray(news)
    ? news.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Tin Tức</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề, tên tác giả, ID tác giả..."
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
              placeholder="Slug *"
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
              type="file"
              accept="image/*"
              onChange={(e) => setNewNews({ ...newNews, file: e.target.files?.[0] || null })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="date"
              value={newNews.date || ''}
              onChange={(e) => setNewNews({ ...newNews, date: e.target.value })}
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
              placeholder="ID tác giả *"
              value={editNews.author.id}
              onChange={(e) =>
                setEditNews({ ...editNews, author: { ...editNews.author, id: e.target.value } })
              }
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Tên tác giả *"
              value={editNews.author.name}
              onChange={(e) =>
                setEditNews({ ...editNews, author: { ...editNews.author, name: e.target.value } })
              }
              className="border p-2 rounded mb-2 w-full"
            />
            <div className="mb-2">
              {editNews.thumbnail && (
                <img src={editNews.thumbnail} alt="Current" className="h-20 w-auto mb-2" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditNews({ ...editNews, file: e.target.files?.[0] || null })}
                className="border p-2 rounded w-full"
              />
            </div>
            <input
              type="date"
              value={editNews.date || ''}
              onChange={(e) => setEditNews({ ...editNews, date: e.target.value })}
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

        {/* Bảng danh sách tin tức */}
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">ID Tin Tức</th>
              <th className="p-3 text-left">Tiêu đề</th>
              <th className="p-3 text-left">Tác giả</th>
              <th className="p-3 text-left">ID Tác Giả</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredNews.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-3">{item._id}</td>
                <td className="p-3">{item.title}</td>
                <td className="p-3">{item.author.name}</td>
                <td className="p-3">{item.author.id}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEditNews(item)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteNews(item._id)}
                    className="text-red-600 hover:underline"
                  >
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