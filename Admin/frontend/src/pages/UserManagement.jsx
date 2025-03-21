import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../components/AdminHeader";
import UserHeader from "../components/user/UserHeader";
import UserListSection from "../components/user/UserListSection";
import UserFormSection from "../components/user/UserFormSection";
import "../assets/user/UserManagement.css";

const API_URL = "http://localhost:5000/api/users";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Fetch dữ liệu người dùng khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const res = await axios.get(API_URL); // Bỏ header Authorization
      setUsers(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách người dùng!", error);
      const message = error.response?.data?.message || "Không thể tải danh sách người dùng! Vui lòng thử lại sau.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setShowEditForm(false);
    setEditingUser(null);
  };

  const saveUser = async (userData, isEdit) => {
    // Kiểm tra dữ liệu trước khi gửi
    if (!userData.name || !userData.email || !userData.phone || !userData.gender || (!isEdit && !userData.password)) {
      setErrorMessage("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    console.log("Dữ liệu gửi lên server:", userData); // In dữ liệu để kiểm tra

    try {
      const response = await axios.post(API_URL, userData); // Bỏ header Authorization
      console.log("Thêm người dùng thành công:", response.data);
      fetchUsers();
      toggleForm();
    } catch (error) {
      console.error("❌ Lỗi khi thêm người dùng!", error);
      console.log("Chi tiết lỗi:", error.response); // In chi tiết lỗi
      const errorMessage = error.response?.data?.message || "Lỗi không xác định";
      const errorDetails = error.response?.data?.errors?.join(", ") || "";
      setErrorMessage(`❌ ${errorMessage}${errorDetails ? `: ${errorDetails}` : ""}`);
    }
  };

  const saveEditedUser = async (userData, isEdit) => {
    if (!userData.name || !userData.email || !userData.phone || !userData.gender) {
      setErrorMessage("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    try {
      await axios.put(`${API_URL}/${userData._id}`, userData); // Bỏ header Authorization
      console.log("Cập nhật người dùng thành công!");
      fetchUsers();
      setShowEditForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật người dùng!", error);
      const message = error.response?.data?.message || "Không thể cập nhật người dùng!";
      setErrorMessage(message);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`); // Bỏ header Authorization
      console.log("Xóa người dùng thành công!");
      fetchUsers();
    } catch (error) {
      console.error("❌ Lỗi khi xóa người dùng!", error);
      const message = error.response?.data?.message || "Không thể xóa người dùng!";
      setErrorMessage(message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEditForm(true);
    setShowForm(false);
  };

  return (
    <div>
      <AdminHeader />
      <div className="user-management">
        <UserHeader
          showForm={showForm}
          toggleForm={toggleForm}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {(showForm || showEditForm) && (
          <UserFormSection
            user={showEditForm ? editingUser : null}
            onSave={(userData, isEdit) => (showEditForm ? saveEditedUser(userData, isEdit) : saveUser(userData, isEdit))}
            onCancel={toggleForm}
            isEdit={showEditForm}
          />
        )}
        <UserListSection
          users={users}
          loading={loading}
          searchTerm={searchTerm}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          usersPerPage={usersPerPage}
          onEdit={handleEdit}
          onDelete={deleteUser}
          setShowEditForm={setShowEditForm}
        />
      </div>
    </div>
  );
};

export default UserManagement;