import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/AdminHeader.css";

const AdminHeader = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    try {
      console.log("Đăng xuất thành công");
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <img src="/assets/logoyete.png" alt="Logo Công Ty" className="header-logo" />
      </div>
      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>
      <nav className={`header-nav ${isMenuOpen ? "active" : ""}`}>
        <ul>
          <li>
            <button className="nav-btn" onClick={() => navigate("/admin/users")}>
              Quản lý người dùng
            </button>
          </li>
          <li>
            <button className="nav-btn" onClick={() => navigate("/admin/doctors")}>
              Quản lý bác sĩ
            </button>
          </li>
          <li>
            <button className="nav-btn" onClick={() => navigate("/admin/appointments")}>
              Quản lý lịch hẹn
            </button>
          </li>
          <li>
            <button className="nav-btn" onClick={() => navigate("/admin/medical-records")}>
              Quản lý hồ sơ bệnh án
            </button>
          </li>
          <li>
            <button className="nav-btn" onClick={() => navigate("/admin/admins")}>
              Quản lý quản trị viên
            </button>
          </li>
        </ul>
      </nav>
      <div className="header-right">
        <button className="logout-button" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;