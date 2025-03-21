import React from "react";
import Pagination from "../Pagination";
import "../../assets/doctor/DoctorList.css";

const DoctorList = ({
  doctors,
  loading,
  searchTerm,
  currentPage,
  setCurrentPage,
  doctorsPerPage,
  onEdit,
  onDelete,
  setShowEditForm,
}) => {
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const handleEditClick = (doctor) => {
    onEdit({
      ...doctor,
      subSpecialties: doctor.subSpecialties?.join(", ") || "",
      languages: doctor.languages?.join(", ") || "",
      hospitalName: doctor.hospital?.name || "",
      hospitalAddress: doctor.hospital?.address || "",
      department: doctor.hospital?.department || "",
    });
    setShowEditForm(true);
  };

  return (
    <div className="doctor-table-container">
      <h2>Danh sách bác sĩ</h2>
      <table className="doctor-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Hình ảnh</th>
            <th>Tên bác sĩ</th>
            <th>Email</th>
            <th>Mật khẩu</th>
            <th>Số điện thoại</th>
            <th>Giới tính</th>
            <th>Chuyên khoa</th>
            <th>Chuyên khoa phụ</th>
            <th>Kinh nghiệm</th>
            <th>Ngôn ngữ</th>
            <th>Tiểu sử</th>
            <th>Trình độ học vấn</th>
            <th>Giờ làm việc</th>
            <th>Bệnh viện</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="17">⏳ Đang tải dữ liệu...</td>
            </tr>
          ) : currentDoctors.length > 0 ? (
            currentDoctors.map((doctor, index) => (
              <tr key={doctor._id}>
                <td>{index + 1 + (currentPage - 1) * doctorsPerPage}</td>
                <td>
                  {doctor.avatar ? (
                    <img src={doctor.avatar} alt={doctor.name} className="doctor-avatar" />
                  ) : (
                    "Không có ảnh"
                  )}
                </td>
                <td>{doctor.name}</td>
                <td>{doctor.email}</td>
                <td>{doctor.password || "Chưa cung cấp"}</td> {/* Hiển thị mật khẩu gốc */}
                <td>{doctor.phone || "Chưa cung cấp"}</td>
                <td>{doctor.gender || "Chưa cung cấp"}</td>
                <td>{doctor.specialty || "Chưa cung cấp"}</td>
                <td>{doctor.subSpecialties?.join(", ") || "Không có"}</td>
                <td>{doctor.experience ? `${doctor.experience} năm` : "Chưa cung cấp"}</td>
                <td>{doctor.languages?.join(", ") || "Chưa cung cấp"}</td>
                <td>{doctor.bio || "Chưa có thông tin"}</td>
                <td>
                  {doctor.qualifications?.length > 0 ? (
                    doctor.qualifications.map((q, i) => (
                      <div key={i}>{`${q.degree} - ${q.institution} (${q.year})`}</div>
                    ))
                  ) : (
                    "Chưa có thông tin"
                  )}
                </td>
                <td>
                  {doctor.workingHours?.length > 0 ? (
                    doctor.workingHours.map((wh, i) => (
                      <div key={i}>{`${wh.day}: ${wh.startTime} - ${wh.endTime} (${wh.available ? "Có" : "Không"})`}</div>
                    ))
                  ) : (
                    "Chưa có thông tin"
                  )}
                </td>
                <td>
                  {doctor.hospital?.name
                    ? `${doctor.hospital.name} - ${doctor.hospital.address || ""} (${doctor.hospital.department || ""})`
                    : "Chưa cung cấp"}
                </td>
                <td>{doctor.isActive ? "Hoạt động" : "Không hoạt động"}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(doctor)}>
                    Sửa
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(doctor._id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="17">Không có bác sĩ nào.</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        totalItems={filteredDoctors.length}
        itemsPerPage={doctorsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default DoctorList;