import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../components/AdminHeader";
import DoctorList from "../components/doctor/DoctorList";
import DoctorForm from "../components/doctor/DoctorForm";
import SearchBar from "../components/SearchBar";
import "../assets/doctor/DoctorManagement.css";

const API_URL = "http://localhost:5000/api/doctors";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    specialty: "",
    subSpecialties: "",
    experience: "",
    languages: "",
    bio: "",
    hospitalName: "",
    hospitalAddress: "",
    department: "",
    avatar: "",
    qualifications: [],
    workingHours: [],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qualificationInput, setQualificationInput] = useState({ degree: "", institution: "", year: "" });
  const [workingHourInput, setWorkingHourInput] = useState({ day: "", startTime: "", endTime: "", available: true });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setDoctors(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách bác sĩ:", error);
      alert("❌ Không thể tải danh sách bác sĩ! Vui lòng kiểm tra kết nối hoặc server.");
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setNewDoctor({
      name: "",
      email: "",
      password: "",
      phone: "",
      gender: "",
      specialty: "",
      subSpecialties: "",
      experience: "",
      languages: "",
      bio: "",
      hospitalName: "",
      hospitalAddress: "",
      department: "",
      avatar: "",
      qualifications: [],
      workingHours: [],
    });
    setQualificationInput({ degree: "", institution: "", year: "" });
    setWorkingHourInput({ day: "", startTime: "", endTime: "", available: true });
    setImagePreview(null);
  };

  const saveDoctor = async (doctorData) => {
    try {
      const response = await axios.post(API_URL, doctorData);
      console.log("Thêm bác sĩ thành công:", response.data);
      fetchDoctors();
      toggleForm();
    } catch (error) {
      console.error("❌ Lỗi khi thêm bác sĩ:", error);
      if (error.response) {
        const errorMessage = error.response.data.message || "Lỗi không xác định";
        const errorDetails = error.response.data.errors ? error.response.data.errors.join(", ") : "";
        alert(`❌ ${errorMessage}${errorDetails ? `: ${errorDetails}` : ""}`);
      } else {
        alert("❌ Lỗi kết nối đến server! Vui lòng thử lại.");
      }
    }
  };

  const saveEditedDoctor = async (doctorData) => {
    try {
      const response = await axios.put(`${API_URL}/${doctorData._id}`, doctorData);
      console.log("Cập nhật bác sĩ thành công:", response.data);
      fetchDoctors();
      setShowEditForm(false);
      setEditingDoctor(null);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật bác sĩ:", error);
      if (error.response) {
        const errorMessage = error.response.data.message || "Lỗi không xác định";
        const errorDetails = error.response.data.errors ? error.response.data.errors.join(", ") : "";
        alert(`❌ ${errorMessage}${errorDetails ? `: ${errorDetails}` : ""}`);
      } else {
        alert("❌ Lỗi kết nối đến server! Vui lòng thử lại.");
      }
    }
  };

  const deleteDoctor = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bác sĩ này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchDoctors();
      } catch (error) {
        console.error("❌ Lỗi khi xóa bác sĩ:", error);
        alert("❌ Không thể xóa bác sĩ! Vui lòng thử lại.");
      }
    }
  };

  return (
    <div>
      <AdminHeader />
      <div className="doctor-management">
        <div className="button-container">
          <button onClick={toggleForm} className="add-doctor-btn">
            {showForm ? "Đóng" : "Thêm bác sĩ"}
          </button>
        </div>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Tìm kiếm theo tên, email, số điện thoại hoặc chuyên khoa..."
        />
        {showForm && (
          <DoctorForm
            doctor={newDoctor}
            setDoctor={setNewDoctor}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            qualificationInput={qualificationInput}
            setQualificationInput={setQualificationInput}
            workingHourInput={workingHourInput}
            setWorkingHourInput={setWorkingHourInput}
            onSave={saveDoctor}
            onCancel={toggleForm}
            isEdit={false}
          />
        )}
        {showEditForm && editingDoctor && (
          <DoctorForm
            doctor={editingDoctor}
            setDoctor={setEditingDoctor}
            imagePreview={editingDoctor.avatar}
            setImagePreview={setImagePreview}
            qualificationInput={qualificationInput}
            setQualificationInput={setQualificationInput}
            workingHourInput={workingHourInput}
            setWorkingHourInput={setWorkingHourInput}
            onSave={saveEditedDoctor}
            onCancel={() => setShowEditForm(false)}
            isEdit={true}
          />
        )}
        <DoctorList
          doctors={doctors}
          loading={loading}
          searchTerm={searchTerm}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          doctorsPerPage={doctorsPerPage}
          onEdit={setEditingDoctor}
          onDelete={deleteDoctor}
          setShowEditForm={setShowEditForm}
        />
      </div>
    </div>
  );
};

export default DoctorManagement;