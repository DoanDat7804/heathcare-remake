import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Admin from "./pages/Admin.jsx";
import DoctorManagement from "./pages/DoctorManagement.jsx";
import AppointmentManagement from "./pages/AppointmentManagement.jsx";
import UserManagement from "./pages/UserManagement.jsx";
import MedicalRecordManagement from "./pages/MedicalRecordManagement.jsx";
import AdminManagement from "./pages/AdminManagement.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/doctors" element={<DoctorManagement />} />
        <Route path="/admin/appointments" element={<AppointmentManagement />} />
        <Route path="/admin/medical-records" element={<MedicalRecordManagement />} />
        <Route path="/admin/admins" element={<AdminManagement />} />
        <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
      </Routes>
    </Router>
  );
}

export default App;