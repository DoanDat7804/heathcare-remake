import React, { useState } from "react";
import AdminHeader from "../components/AdminHeader"; 
import DoctorManagement from "./DoctorManagement";
import "./Admin.css";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="admin-container">
      <AdminHeader setActiveTab={setActiveTab} />

      <div className="admin-content">
        {activeTab === "home" && <h1 className="welcome-message">Chọn chức năng để quản lý</h1>}
        {activeTab === "doctors" && <DoctorManagement />}
      </div>
    </div>
  );
};

export default Admin;
