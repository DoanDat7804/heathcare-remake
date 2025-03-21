import React from "react";
import "../../assets/user/UserManagement.css"; // Sử dụng CSS từ UserManagement

const UserHeader = ({ showForm, toggleForm, searchTerm, setSearchTerm }) => {
  return (
    <div className="user-header-container">
      <div className="button-container">
        <button onClick={toggleForm} className="add-user-btn">
          {showForm ? "Đóng" : "Thêm người dùng"}
        </button>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
    </div>
  );
};

export default UserHeader;