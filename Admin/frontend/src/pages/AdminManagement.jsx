import React, { useState, useEffect } from "react";
import AdminHeader from "../components/AdminHeader";
import "./AdminManagement.css";

// Dữ liệu giả lập (thay vì gọi API)
const mockAdmins = [
  {
    _id: "1",
    name: "Nguyễn Văn Admin",
    email: "admin1@example.com",
    password: "hashed_password_1",
    phone: "0901234567",
    role: "admin",
    permissions: ["manage_doctors", "manage_patients", "view_reports"],
    avatar: "https://via.placeholder.com/50", // URL ảnh giả lập
    createdAt: "2023-01-01",
    updatedAt: "2023-10-01",
    isActive: true,
    lastLogin: "2023-10-01",
  },
  {
    _id: "2",
    name: "Trần Thị Admin",
    email: "admin2@example.com",
    password: "hashed_password_2",
    phone: "0909876543",
    role: "admin",
    permissions: ["manage_doctors", "view_reports"],
    avatar: "https://via.placeholder.com/50",
    createdAt: "2023-02-01",
    updatedAt: "2023-09-15",
    isActive: false,
    lastLogin: "2023-09-15",
  },
];

const AdminManagement = () => {
  const [admins, setAdmins] = useState(mockAdmins);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "admin",
    permissions: "",
    avatar: "",
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  // State cho tìm kiếm và phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const adminsPerPage = 5; // Số quản trị viên trên mỗi trang

  useEffect(() => {
    // Giả lập gọi API
    setLoading(true);
    setTimeout(() => {
      setAdmins(mockAdmins);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAdmin((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAdmin((prev) => ({ ...prev, avatar: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setNewAdmin({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "admin",
      permissions: "",
      avatar: "",
      isActive: true,
    });
    setImagePreview(null);
  };

  const saveAdmin = () => {
    const requiredFields = ["name", "email", "password", "phone"];
    const missingFields = requiredFields.filter((field) => !newAdmin[field]);
    if (missingFields.length > 0) {
      alert(`❌ Vui lòng điền đầy đủ các trường bắt buộc: ${missingFields.join(", ")}`);
      return;
    }

    const adminData = {
      _id: String(admins.length + 1),
      ...newAdmin,
      permissions: newAdmin.permissions ? newAdmin.permissions.split(", ") : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    setAdmins((prev) => [...prev, adminData]);
    toggleForm();
  };

  const deleteAdmin = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa quản trị viên này?")) {
      setAdmins((prev) => prev.filter((admin) => admin._id !== id));
    }
  };

  const handleEditClick = (admin) => {
    setEditingAdmin({
      ...admin,
      permissions: admin.permissions?.join(", ") || "",
    });
    setShowEditForm(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingAdmin((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingAdmin((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveEditedAdmin = () => {
    const requiredFields = ["name", "email", "phone"];
    const missingFields = requiredFields.filter((field) => !editingAdmin[field]);
    if (missingFields.length > 0) {
      alert(`❌ Vui lòng điền đầy đủ các trường bắt buộc: ${missingFields.join(", ")}`);
      return;
    }

    const adminData = {
      ...editingAdmin,
      permissions: editingAdmin.permissions ? editingAdmin.permissions.split(", ") : [],
      updatedAt: new Date().toISOString(),
    };

    setAdmins((prev) => prev.map((admin) => (admin._id === editingAdmin._id ? adminData : admin)));
    setShowEditForm(false);
    setEditingAdmin(null);
  };

  // Lọc danh sách quản trị viên theo từ khóa tìm kiếm
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <AdminHeader />
      <div className="admin-management">
        {/* Nút Thêm quản trị viên ở góc trái */}
        <div className="button-container">
          <button onClick={toggleForm} className="add-admin-btn">
            {showForm ? "Đóng" : "Thêm quản trị viên"}
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h3>Thêm quản trị viên mới</h3>
              <input type="text" name="name" placeholder="Tên quản trị viên *" value={newAdmin.name} onChange={handleInputChange} required />
              <input type="email" name="email" placeholder="Email *" value={newAdmin.email} onChange={handleInputChange} required />
              <input type="password" name="password" placeholder="Mật khẩu *" value={newAdmin.password} onChange={handleInputChange} required />
              <input type="text" name="phone" placeholder="Số điện thoại *" value={newAdmin.phone} onChange={handleInputChange} required />
              <input
                type="text"
                name="permissions"
                placeholder="Quyền (cách nhau bằng dấu phẩy, VD: manage_doctors, view_reports)"
                value={newAdmin.permissions}
                onChange={handleInputChange}
              />
              <div className="avatar-section">
                <h4>Hình ảnh đại diện</h4>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
              </div>
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={newAdmin.isActive}
                  onChange={handleInputChange}
                />
                Trạng thái tài khoản (Hoạt động)
              </label>
              <div className="button-group">
                <button onClick={saveAdmin} className="save-admin-btn">Lưu</button>
                <button onClick={toggleForm} className="close-modal-btn">Hủy</button>
              </div>
            </div>
          </div>
        )}

        {showEditForm && editingAdmin && (
          <div className="modal">
            <div className="modal-content">
              <h3>Chỉnh sửa thông tin quản trị viên</h3>
              <input type="text" name="name" placeholder="Tên quản trị viên *" value={editingAdmin.name} onChange={handleEditInputChange} required />
              <input type="email" name="email" placeholder="Email *" value={editingAdmin.email} onChange={handleEditInputChange} required />
              <input type="text" name="phone" placeholder="Số điện thoại *" value={editingAdmin.phone} onChange={handleEditInputChange} required />
              <input
                type="text"
                name="permissions"
                placeholder="Quyền (cách nhau bằng dấu phẩy, VD: manage_doctors, view_reports)"
                value={editingAdmin.permissions}
                onChange={handleEditInputChange}
              />
              <div className="avatar-section">
                <h4>Hình ảnh đại diện</h4>
                <input type="file" accept="image/*" onChange={handleEditImageChange} />
                {editingAdmin.avatar && <img src={editingAdmin.avatar} alt="Preview" className="image-preview" />}
              </div>
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={editingAdmin.isActive}
                  onChange={handleEditInputChange}
                />
                Trạng thái tài khoản (Hoạt động)
              </label>
              <div className="button-group">
                <button onClick={saveEditedAdmin} className="save-admin-btn">Lưu thay đổi</button>
                <button onClick={() => setShowEditForm(false)} className="close-modal-btn">Hủy</button>
              </div>
            </div>
          </div>
        )}

        <div className="admin-table-container">
          <h2>Danh sách quản trị viên</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Hình ảnh</th>
                <th>Tên quản trị viên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Quyền</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Ngày đăng nhập cuối</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10">⏳ Đang tải dữ liệu...</td>
                </tr>
              ) : currentAdmins.length > 0 ? (
                currentAdmins.map((admin, index) => (
                  <tr key={admin._id}>
                    <td>{index + 1 + (currentPage - 1) * adminsPerPage}</td>
                    <td>
                      {admin.avatar ? (
                        <img src={admin.avatar} alt={admin.name} className="admin-avatar" />
                      ) : (
                        "Không có ảnh"
                      )}
                    </td>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.phone || "Chưa cung cấp"}</td>
                    <td>{admin.permissions?.join(", ") || "Không có"}</td>
                    <td>{admin.isActive ? "Hoạt động" : "Không hoạt động"}</td>
                    <td>{admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "Chưa cung cấp"}</td>
                    <td>{admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : "Chưa đăng nhập"}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEditClick(admin)}>Sửa</button>
                      <button className="delete-btn" onClick={() => deleteAdmin(admin._id)}>Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">Không có quản trị viên nào.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={currentPage === number ? "active" : ""}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;