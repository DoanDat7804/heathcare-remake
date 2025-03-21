import React, { useState, useEffect } from "react";
import AdminHeader from "../components/AdminHeader";
import "./AppointmentManagement.css";

// Dữ liệu giả lập (thay vì gọi API)
const mockAppointments = [
  {
    _id: "1",
    patientId: "patient1",
    patientName: "Nguyễn Văn A", // Thêm thông tin giả lập để hiển thị
    doctorId: "doctor1",
    doctorName: "BS. Trần Văn B", // Thêm thông tin giả lập để hiển thị
    serviceType: "Khám tổng quát",
    date: "2023-11-15",
    timeSlot: "09:00-09:30",
    status: "confirmed",
    note: "Cần kiểm tra huyết áp",
    symptoms: ["Đau đầu", "Mệt mỏi"],
    priority: 3,
    isPrepaid: true,
    createdAt: "2023-11-10",
    updatedAt: "2023-11-12",
    confirmationDate: "2023-11-12",
    rejectionReason: "",
    doctorNote: "Kê đơn thuốc giảm đau",
    notificationSent: true,
  },
  {
    _id: "2",
    patientId: "patient2",
    patientName: "Trần Thị B",
    doctorId: "doctor2",
    doctorName: "BS. Lê Thị C",
    serviceType: "Khám nội khoa",
    date: "2023-11-16",
    timeSlot: "14:00-14:30",
    status: "pending",
    note: "Đã có tiền sử tiểu đường",
    symptoms: ["Khát nước", "Tê tay"],
    priority: 4,
    isPrepaid: false,
    createdAt: "2023-11-11",
    updatedAt: "2023-11-11",
    confirmationDate: null,
    rejectionReason: "",
    doctorNote: "",
    notificationSent: false,
  },
];

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    patientName: "",
    doctorId: "",
    doctorName: "",
    serviceType: "",
    date: "",
    timeSlot: "",
    status: "pending",
    note: "",
    symptoms: "",
    priority: 1,
    isPrepaid: false,
    rejectionReason: "",
    doctorNote: "",
    notificationSent: false,
  });
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [loading, setLoading] = useState(false);

  // State cho tìm kiếm và phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5; // Số lịch hẹn trên mỗi trang

  useEffect(() => {
    // Giả lập gọi API
    setLoading(true);
    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAppointment((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setNewAppointment({
      patientId: "",
      patientName: "",
      doctorId: "",
      doctorName: "",
      serviceType: "",
      date: "",
      timeSlot: "",
      status: "pending",
      note: "",
      symptoms: "",
      priority: 1,
      isPrepaid: false,
      rejectionReason: "",
      doctorNote: "",
      notificationSent: false,
    });
  };

  const saveAppointment = () => {
    const requiredFields = ["patientId", "doctorId", "serviceType", "date", "timeSlot", "status"];
    const missingFields = requiredFields.filter((field) => !newAppointment[field]);
    if (missingFields.length > 0) {
      alert(`❌ Vui lòng điền đầy đủ các trường bắt buộc: ${missingFields.join(", ")}`);
      return;
    }

    const appointmentData = {
      _id: String(appointments.length + 1),
      ...newAppointment,
      symptoms: newAppointment.symptoms ? newAppointment.symptoms.split(", ") : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      confirmationDate: newAppointment.status === "confirmed" ? new Date().toISOString() : null,
    };

    setAppointments((prev) => [...prev, appointmentData]);
    toggleForm();
  };

  const deleteAppointment = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa lịch hẹn này?")) {
      setAppointments((prev) => prev.filter((appointment) => appointment._id !== id));
    }
  };

  const handleEditClick = (appointment) => {
    setEditingAppointment({
      ...appointment,
      symptoms: appointment.symptoms?.join(", ") || "",
    });
    setShowEditForm(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingAppointment((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveEditedAppointment = () => {
    const requiredFields = ["patientId", "doctorId", "serviceType", "date", "timeSlot", "status"];
    const missingFields = requiredFields.filter((field) => !editingAppointment[field]);
    if (missingFields.length > 0) {
      alert(`❌ Vui lòng điền đầy đủ các trường bắt buộc: ${missingFields.join(", ")}`);
      return;
    }

    const appointmentData = {
      ...editingAppointment,
      symptoms: editingAppointment.symptoms ? editingAppointment.symptoms.split(", ") : [],
      updatedAt: new Date().toISOString(),
      confirmationDate: editingAppointment.status === "confirmed" ? new Date().toISOString() : editingAppointment.confirmationDate,
    };

    setAppointments((prev) =>
      prev.map((appointment) => (appointment._id === editingAppointment._id ? appointmentData : appointment))
    );
    setShowEditForm(false);
    setEditingAppointment(null);
  };

  // Lọc danh sách lịch hẹn theo từ khóa tìm kiếm
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.serviceType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <AdminHeader />
      <div className="appointment-management">
        {/* Nút Thêm lịch hẹn ở góc trái */}
        <div className="button-container">
          <button onClick={toggleForm} className="add-appointment-btn">
            {showForm ? "Đóng" : "Thêm lịch hẹn"}
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên bệnh nhân, bác sĩ hoặc loại dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h3>Thêm lịch hẹn mới</h3>
              <input
                type="text"
                name="patientId"
                placeholder="ID bệnh nhân *"
                value={newAppointment.patientId}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="patientName"
                placeholder="Tên bệnh nhân *"
                value={newAppointment.patientName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="doctorId"
                placeholder="ID bác sĩ *"
                value={newAppointment.doctorId}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="doctorName"
                placeholder="Tên bác sĩ *"
                value={newAppointment.doctorName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="serviceType"
                placeholder="Loại dịch vụ khám *"
                value={newAppointment.serviceType}
                onChange={handleInputChange}
                required
              />
              <input
                type="date"
                name="date"
                value={newAppointment.date}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="timeSlot"
                placeholder="Khung giờ (VD: 09:00-09:30) *"
                value={newAppointment.timeSlot}
                onChange={handleInputChange}
                required
              />
              <select name="status" value={newAppointment.status} onChange={handleInputChange} required>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Hủy</option>
                <option value="rejected">Từ chối</option>
              </select>
              <textarea name="note" placeholder="Ghi chú từ bệnh nhân" value={newAppointment.note} onChange={handleInputChange} />
              <input
                type="text"
                name="symptoms"
                placeholder="Triệu chứng (cách nhau bằng dấu phẩy)"
                value={newAppointment.symptoms}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="priority"
                placeholder="Mức độ ưu tiên (1-5)"
                value={newAppointment.priority}
                onChange={handleInputChange}
                min="1"
                max="5"
              />
              <label>
                <input
                  type="checkbox"
                  name="isPrepaid"
                  checked={newAppointment.isPrepaid}
                  onChange={handleInputChange}
                />
                Đã thanh toán trước 20%
              </label>
              <textarea
                name="rejectionReason"
                placeholder="Lý do từ chối (nếu có)"
                value={newAppointment.rejectionReason}
                onChange={handleInputChange}
              />
              <textarea
                name="doctorNote"
                placeholder="Ghi chú từ bác sĩ"
                value={newAppointment.doctorNote}
                onChange={handleInputChange}
              />
              <label>
                <input
                  type="checkbox"
                  name="notificationSent"
                  checked={newAppointment.notificationSent}
                  onChange={handleInputChange}
                />
                Đã gửi thông báo
              </label>
              <div className="button-group">
                <button onClick={saveAppointment} className="save-appointment-btn">Lưu</button>
                <button onClick={toggleForm} className="close-modal-btn">Hủy</button>
              </div>
            </div>
          </div>
        )}

        {showEditForm && editingAppointment && (
          <div className="modal">
            <div className="modal-content">
              <h3>Chỉnh sửa lịch hẹn</h3>
              <input
                type="text"
                name="patientId"
                placeholder="ID bệnh nhân *"
                value={editingAppointment.patientId}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="text"
                name="patientName"
                placeholder="Tên bệnh nhân *"
                value={editingAppointment.patientName}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="text"
                name="doctorId"
                placeholder="ID bác sĩ *"
                value={editingAppointment.doctorId}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="text"
                name="doctorName"
                placeholder="Tên bác sĩ *"
                value={editingAppointment.doctorName}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="text"
                name="serviceType"
                placeholder="Loại dịch vụ khám *"
                value={editingAppointment.serviceType}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="date"
                name="date"
                value={editingAppointment.date}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="text"
                name="timeSlot"
                placeholder="Khung giờ (VD: 09:00-09:30) *"
                value={editingAppointment.timeSlot}
                onChange={handleEditInputChange}
                required
              />
              <select name="status" value={editingAppointment.status} onChange={handleEditInputChange} required>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Hủy</option>
                <option value="rejected">Từ chối</option>
              </select>
              <textarea name="note" placeholder="Ghi chú từ bệnh nhân" value={editingAppointment.note} onChange={handleEditInputChange} />
              <input
                type="text"
                name="symptoms"
                placeholder="Triệu chứng (cách nhau bằng dấu phẩy)"
                value={editingAppointment.symptoms}
                onChange={handleEditInputChange}
              />
              <input
                type="number"
                name="priority"
                placeholder="Mức độ ưu tiên (1-5)"
                value={editingAppointment.priority}
                onChange={handleEditInputChange}
                min="1"
                max="5"
              />
              <label>
                <input
                  type="checkbox"
                  name="isPrepaid"
                  checked={editingAppointment.isPrepaid}
                  onChange={handleEditInputChange}
                />
                Đã thanh toán trước 20%
              </label>
              <textarea
                name="rejectionReason"
                placeholder="Lý do từ chối (nếu có)"
                value={editingAppointment.rejectionReason}
                onChange={handleEditInputChange}
              />
              <textarea
                name="doctorNote"
                placeholder="Ghi chú từ bác sĩ"
                value={editingAppointment.doctorNote}
                onChange={handleEditInputChange}
              />
              <label>
                <input
                  type="checkbox"
                  name="notificationSent"
                  checked={editingAppointment.notificationSent}
                  onChange={handleEditInputChange}
                />
                Đã gửi thông báo
              </label>
              <div className="button-group">
                <button onClick={saveEditedAppointment} className="save-appointment-btn">Lưu thay đổi</button>
                <button onClick={() => setShowEditForm(false)} className="close-modal-btn">Hủy</button>
              </div>
            </div>
          </div>
        )}

        <div className="appointment-table-container">
          <h2>Danh sách lịch hẹn</h2>
          <table className="appointment-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Bệnh nhân</th>
                <th>Bác sĩ</th>
                <th>Loại dịch vụ</th>
                <th>Ngày hẹn</th>
                <th>Khung giờ</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
                <th>Triệu chứng</th>
                <th>Ưu tiên</th>
                <th>Thanh toán trước</th>
                <th>Lý do từ chối</th>
                <th>Ghi chú bác sĩ</th>
                <th>Thông báo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="15">⏳ Đang tải dữ liệu...</td>
                </tr>
              ) : currentAppointments.length > 0 ? (
                currentAppointments.map((appointment, index) => (
                  <tr key={appointment._id}>
                    <td>{index + 1 + (currentPage - 1) * appointmentsPerPage}</td>
                    <td>{appointment.patientName} (ID: {appointment.patientId})</td>
                    <td>{appointment.doctorName} (ID: {appointment.doctorId})</td>
                    <td>{appointment.serviceType || "Chưa cung cấp"}</td>
                    <td>{appointment.date ? new Date(appointment.date).toLocaleDateString() : "Chưa cung cấp"}</td>
                    <td>{appointment.timeSlot || "Chưa cung cấp"}</td>
                    <td>{appointment.status || "Chưa cung cấp"}</td>
                    <td>{appointment.note || "Không có"}</td>
                    <td>{appointment.symptoms?.join(", ") || "Không có"}</td>
                    <td>{appointment.priority || "Chưa cung cấp"}</td>
                    <td>{appointment.isPrepaid ? "Có" : "Không"}</td>
                    <td>{appointment.rejectionReason || "Không có"}</td>
                    <td>{appointment.doctorNote || "Không có"}</td>
                    <td>{appointment.notificationSent ? "Đã gửi" : "Chưa gửi"}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEditClick(appointment)}>Sửa</button>
                      <button className="delete-btn" onClick={() => deleteAppointment(appointment._id)}>Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="15">Không có lịch hẹn nào.</td>
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

export default AppointmentManagement;