import React from "react";
import Pagination from "../Pagination";
import { format } from "date-fns";
import "../../assets/user/UserList.css";

const UserListSection = ({
  users,
  loading,
  searchTerm,
  currentPage,
  setCurrentPage,
  usersPerPage,
  onEdit,
  onDelete,
  setShowEditForm,
}) => {
  // Lọc người dùng theo searchTerm
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Phân trang
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleEditClick = (user) => {
    onEdit({
      ...user,
      healthInfo: {
        ...user.healthInfo,
        allergies: user.healthInfo.allergies || "",
        chronicDiseases: user.healthInfo.chronicDiseases || "",
        currentMedications: user.healthInfo.currentMedications || "",
      },
    });
    setShowEditForm(true);
  };

  // Hàm định dạng ngày sinh
  const formatDate = (date) => {
    if (!date) return "Chưa cung cấp";
    try {
      return format(new Date(date), "dd/MM/yyyy");
    } catch (error) {
      console.error("Lỗi định dạng ngày:", error);
      return "Chưa cung cấp";
    }
  };

  // Hàm định dạng địa chỉ
  const formatAddress = (address) => {
    if (!address || Object.keys(address).length === 0) return "Chưa cung cấp";
    const { street, district, city, country } = address;
    return [street, district, city, country]
      .filter((part) => part && part.trim().length > 0)
      .join(", ")
      .trim() || "Chưa cung cấp";
  };

  // Hàm định dạng mảng (dùng cho allergies, chronicDiseases, currentMedications)
  const formatArray = (arr) => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return "Không có";
    return arr.join(", ");
  };

  return (
    <div className="user-table-container">
      <h2>Danh sách người dùng</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Hình ảnh</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Địa chỉ</th>
            <th>Nhóm máu</th>
            <th>Dị ứng</th>
            <th>Bệnh mãn tính</th>
            <th>Thuốc đang dùng</th>
            <th>Mật khẩu</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="17">⏳ Đang tải dữ liệu...</td>
            </tr>
          ) : currentUsers.length > 0 ? (
            currentUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1 + (currentPage - 1) * usersPerPage}</td>
                <td>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="user-avatar" />
                  ) : (
                    "Không có ảnh"
                  )}
                </td>
                <td>{user.name || "Chưa cung cấp"}</td>
                <td>{user.email || "Chưa cung cấp"}</td>
                <td>{user.phone || "Chưa cung cấp"}</td>
                <td>{formatDate(user.dateOfBirth)}</td>
                <td>{user.gender || "Chưa cung cấp"}</td>
                <td>{formatAddress(user.address)}</td>
                <td>{user.healthInfo?.bloodType || "Chưa cung cấp"}</td>
                <td>{formatArray(user.healthInfo?.allergies)}</td>
                <td>{formatArray(user.healthInfo?.chronicDiseases)}</td>
                <td>{formatArray(user.healthInfo?.currentMedications)}</td>
                <td>{user.password || "Chưa đặt"}</td> {/* Hiển thị mật khẩu gốc */}
                <td>{user.role || "Chưa cung cấp"}</td>
                <td>{user.isActive ? "Hoạt động" : "Không hoạt động"}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(user)}>
                    Sửa
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(user._id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="17">Không có người dùng nào.</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        totalItems={filteredUsers.length}
        itemsPerPage={usersPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default UserListSection;