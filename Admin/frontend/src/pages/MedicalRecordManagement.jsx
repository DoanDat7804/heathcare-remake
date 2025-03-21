import React, { useState, useEffect } from "react";
import AdminHeader from "../components/AdminHeader";
import "./MedicalRecordManagement.css";

// Dữ liệu giả lập (thay vì gọi API)
const mockMedicalRecords = [
  {
    _id: "1",
    patientId: "patient1",
    patientName: "Nguyễn Văn A", // Thêm thông tin giả lập để hiển thị
    doctorId: "doctor1",
    doctorName: "BS. Trần Văn B", // Thêm thông tin giả lập để hiển thị
    appointmentId: "appointment1",
    date: "2023-11-15",
    diagnosis: ["Cao huyết áp", "Tiểu đường"],
    symptoms: ["Đau đầu", "Mệt mỏi"],
    bloodPressure: "130/85 mmHg",
    heartRate: 80,
    temperature: 36.5,
    weight: 70,
    height: 170,
    treatmentPlan: "Theo dõi huyết áp hàng ngày, uống thuốc theo toa",
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "2 lần/ngày", duration: "1 tháng", note: "Uống sau ăn" },
      { name: "Amlodipine", dosage: "5mg", frequency: "1 lần/ngày", duration: "1 tháng", note: "Uống buổi sáng" },
    ],
    labResults: [
      { type: "Xét nghiệm máu", results: "Đường huyết: 6.5 mmol/L", date: "2023-11-15" },
      { type: "Xét nghiệm nước tiểu", results: "Bình thường", date: "2023-11-15" },
    ],
  },
  {
    _id: "2",
    patientId: "patient2",
    patientName: "Trần Thị B",
    doctorId: "doctor2",
    doctorName: "BS. Lê Thị C",
    appointmentId: "appointment2",
    date: "2023-11-16",
    diagnosis: ["Viêm họng"],
    symptoms: ["Sốt", "Đau rát cổ họng"],
    bloodPressure: "120/80 mmHg",
    heartRate: 75,
    temperature: 38.0,
    weight: 55,
    height: 160,
    treatmentPlan: "Nghỉ ngơi, uống nhiều nước, dùng kháng sinh",
    medications: [
      { name: "Amoxicillin", dosage: "500mg", frequency: "3 lần/ngày", duration: "5 ngày", note: "Uống trước ăn" },
    ],
    labResults: [
      { type: "Xét nghiệm máu", results: "Bạch cầu tăng nhẹ", date: "2023-11-16" },
    ],
  },
];

const MedicalRecordManagement = () => {
  const [medicalRecords, setMedicalRecords] = useState(mockMedicalRecords);
  const [newMedicalRecord, setNewMedicalRecord] = useState({
    patientId: "",
    patientName: "",
    doctorId: "",
    doctorName: "",
    appointmentId: "",
    date: "",
    diagnosis: "",
    symptoms: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
    height: "",
    treatmentPlan: "",
    medications: [],
    labResults: [],
  });
  const [medicationInput, setMedicationInput] = useState({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    note: "",
  });
  const [labResultInput, setLabResultInput] = useState({
    type: "",
    results: "",
    date: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingMedicalRecord, setEditingMedicalRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  // State cho tìm kiếm và phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5; // Số hồ sơ trên mỗi trang

  useEffect(() => {
    // Giả lập gọi API
    setLoading(true);
    setTimeout(() => {
      setMedicalRecords(mockMedicalRecords);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedicalRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedicationInputChange = (e) => {
    const { name, value } = e.target;
    setMedicationInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleLabResultInputChange = (e) => {
    const { name, value } = e.target;
    setLabResultInput((prev) => ({ ...prev, [name]: value }));
  };

  const addMedication = () => {
    if (medicationInput.name && medicationInput.dosage && medicationInput.frequency) {
      setNewMedicalRecord((prev) => ({
        ...prev,
        medications: [...prev.medications, { ...medicationInput }],
      }));
      setMedicationInput({ name: "", dosage: "", frequency: "", duration: "", note: "" });
    }
  };

  const addLabResult = () => {
    if (labResultInput.type && labResultInput.results && labResultInput.date) {
      setNewMedicalRecord((prev) => ({
        ...prev,
        labResults: [...prev.labResults, { ...labResultInput }],
      }));
      setLabResultInput({ type: "", results: "", date: "" });
    }
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setNewMedicalRecord({
      patientId: "",
      patientName: "",
      doctorId: "",
      doctorName: "",
      appointmentId: "",
      date: "",
      diagnosis: "",
      symptoms: "",
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      weight: "",
      height: "",
      treatmentPlan: "",
      medications: [],
      labResults: [],
    });
    setMedicationInput({ name: "", dosage: "", frequency: "", duration: "", note: "" });
    setLabResultInput({ type: "", results: "", date: "" });
  };

  const saveMedicalRecord = () => {
    const requiredFields = ["patientId", "doctorId", "appointmentId", "date"];
    const missingFields = requiredFields.filter((field) => !newMedicalRecord[field]);
    if (missingFields.length > 0) {
      alert(`❌ Vui lòng điền đầy đủ các trường bắt buộc: ${missingFields.join(", ")}`);
      return;
    }

    const recordData = {
      _id: String(medicalRecords.length + 1),
      ...newMedicalRecord,
      diagnosis: newMedicalRecord.diagnosis ? newMedicalRecord.diagnosis.split(", ") : [],
      symptoms: newMedicalRecord.symptoms ? newMedicalRecord.symptoms.split(", ") : [],
      heartRate: parseInt(newMedicalRecord.heartRate) || 0,
      temperature: parseFloat(newMedicalRecord.temperature) || 0,
      weight: parseFloat(newMedicalRecord.weight) || 0,
      height: parseFloat(newMedicalRecord.height) || 0,
    };

    setMedicalRecords((prev) => [...prev, recordData]);
    toggleForm();
  };

  const deleteMedicalRecord = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa hồ sơ bệnh án này?")) {
      setMedicalRecords((prev) => prev.filter((record) => record._id !== id));
    }
  };

  const handleEditClick = (record) => {
    setEditingMedicalRecord({
      ...record,
      diagnosis: record.diagnosis?.join(", ") || "",
      symptoms: record.symptoms?.join(", ") || "",
    });
    setShowEditForm(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingMedicalRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditMedicationInputChange = (e) => {
    const { name, value } = e.target;
    setMedicationInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditLabResultInputChange = (e) => {
    const { name, value } = e.target;
    setLabResultInput((prev) => ({ ...prev, [name]: value }));
  };

  const addEditMedication = () => {
    if (medicationInput.name && medicationInput.dosage && medicationInput.frequency) {
      setEditingMedicalRecord((prev) => ({
        ...prev,
        medications: [...(prev.medications || []), { ...medicationInput }],
      }));
      setMedicationInput({ name: "", dosage: "", frequency: "", duration: "", note: "" });
    }
  };

  const addEditLabResult = () => {
    if (labResultInput.type && labResultInput.results && labResultInput.date) {
      setEditingMedicalRecord((prev) => ({
        ...prev,
        labResults: [...(prev.labResults || []), { ...labResultInput }],
      }));
      setLabResultInput({ type: "", results: "", date: "" });
    }
  };

  const saveEditedMedicalRecord = () => {
    const requiredFields = ["patientId", "doctorId", "appointmentId", "date"];
    const missingFields = requiredFields.filter((field) => !editingMedicalRecord[field]);
    if (missingFields.length > 0) {
      alert(`❌ Vui lòng điền đầy đủ các trường bắt buộc: ${missingFields.join(", ")}`);
      return;
    }

    const recordData = {
      ...editingMedicalRecord,
      diagnosis: editingMedicalRecord.diagnosis ? editingMedicalRecord.diagnosis.split(", ") : [],
      symptoms: editingMedicalRecord.symptoms ? editingMedicalRecord.symptoms.split(", ") : [],
      heartRate: parseInt(editingMedicalRecord.heartRate) || 0,
      temperature: parseFloat(editingMedicalRecord.temperature) || 0,
      weight: parseFloat(editingMedicalRecord.weight) || 0,
      height: parseFloat(editingMedicalRecord.height) || 0,
    };

    setMedicalRecords((prev) =>
      prev.map((record) => (record._id === editingMedicalRecord._id ? recordData : record))
    );
    setShowEditForm(false);
    setEditingMedicalRecord(null);
  };

  // Lọc danh sách hồ sơ bệnh án theo từ khóa tìm kiếm
  const filteredMedicalRecords = medicalRecords.filter(
    (record) =>
      record.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredMedicalRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredMedicalRecords.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <AdminHeader />
      <div className="medical-record-management">
        {/* Nút Thêm hồ sơ bệnh án ở góc trái */}
        <div className="button-container">
          <button onClick={toggleForm} className="add-medical-record-btn">
            {showForm ? "Đóng" : "Thêm hồ sơ bệnh án"}
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên bệnh nhân hoặc bác sĩ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h3>Thêm hồ sơ bệnh án mới</h3>
              <input
                type="text"
                name="patientId"
                placeholder="ID bệnh nhân *"
                value={newMedicalRecord.patientId}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="patientName"
                placeholder="Tên bệnh nhân *"
                value={newMedicalRecord.patientName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="doctorId"
                placeholder="ID bác sĩ *"
                value={newMedicalRecord.doctorId}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="doctorName"
                placeholder="Tên bác sĩ *"
                value={newMedicalRecord.doctorName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="appointmentId"
                placeholder="ID cuộc hẹn *"
                value={newMedicalRecord.appointmentId}
                onChange={handleInputChange}
                required
              />
              <input
                type="date"
                name="date"
                value={newMedicalRecord.date}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="diagnosis"
                placeholder="Chẩn đoán (cách nhau bằng dấu phẩy)"
                value={newMedicalRecord.diagnosis}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="symptoms"
                placeholder="Triệu chứng (cách nhau bằng dấu phẩy)"
                value={newMedicalRecord.symptoms}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="bloodPressure"
                placeholder="Huyết áp (VD: 120/80 mmHg)"
                value={newMedicalRecord.bloodPressure}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="heartRate"
                placeholder="Nhịp tim (lần/phút)"
                value={newMedicalRecord.heartRate}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="temperature"
                placeholder="Nhiệt độ cơ thể (°C)"
                value={newMedicalRecord.temperature}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="weight"
                placeholder="Cân nặng (kg)"
                value={newMedicalRecord.weight}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="height"
                placeholder="Chiều cao (cm)"
                value={newMedicalRecord.height}
                onChange={handleInputChange}
              />
              <textarea
                name="treatmentPlan"
                placeholder="Kế hoạch điều trị"
                value={newMedicalRecord.treatmentPlan}
                onChange={handleInputChange}
              />

              <div className="medications-section">
                <h4>Thuốc kê đơn</h4>
                <input
                  type="text"
                  name="name"
                  placeholder="Tên thuốc"
                  value={medicationInput.name}
                  onChange={handleMedicationInputChange}
                />
                <input
                  type="text"
                  name="dosage"
                  placeholder="Liều lượng (VD: 500mg)"
                  value={medicationInput.dosage}
                  onChange={handleMedicationInputChange}
                />
                <input
                  type="text"
                  name="frequency"
                  placeholder="Tần suất (VD: 2 lần/ngày)"
                  value={medicationInput.frequency}
                  onChange={handleMedicationInputChange}
                />
                <input
                  type="text"
                  name="duration"
                  placeholder="Thời gian dùng (VD: 1 tháng)"
                  value={medicationInput.duration}
                  onChange={handleMedicationInputChange}
                />
                <input
                  type="text"
                  name="note"
                  placeholder="Ghi chú (VD: Uống sau ăn)"
                  value={medicationInput.note}
                  onChange={handleMedicationInputChange}
                />
                <button type="button" onClick={addMedication}>Thêm thuốc</button>
                <ul>
                  {newMedicalRecord.medications.map((med, index) => (
                    <li key={index}>{`${med.name}: ${med.dosage}, ${med.frequency}, ${med.duration} (${med.note})`}</li>
                  ))}
                </ul>
              </div>

              <div className="lab-results-section">
                <h4>Kết quả xét nghiệm</h4>
                <input
                  type="text"
                  name="type"
                  placeholder="Loại xét nghiệm"
                  value={labResultInput.type}
                  onChange={handleLabResultInputChange}
                />
                <input
                  type="text"
                  name="results"
                  placeholder="Kết quả"
                  value={labResultInput.results}
                  onChange={handleLabResultInputChange}
                />
                <input
                  type="date"
                  name="date"
                  value={labResultInput.date}
                  onChange={handleLabResultInputChange}
                />
                <button type="button" onClick={addLabResult}>Thêm kết quả xét nghiệm</button>
                <ul>
                  {newMedicalRecord.labResults.map((result, index) => (
                    <li key={index}>{`${result.type}: ${result.results} (${result.date})`}</li>
                  ))}
                </ul>
              </div>

              <div className="button-group">
                <button onClick={saveMedicalRecord} className="save-medical-record-btn">Lưu</button>
                <button onClick={toggleForm} className="close-modal-btn">Hủy</button>
              </div>
            </div>
          </div>
        )}

        {showEditForm && editingMedicalRecord && (
          <div className="modal">
            <div className="modal-content">
              <h3>Chỉnh sửa hồ sơ bệnh án</h3>
              <input
                type="text"
                name="patientId"
                placeholder="ID bệnh nhân *"
                value={editingMedicalRecord.patientId}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="text"
                name="patientName"
                placeholder="Tên bệnh nhân *"
                value={editingMedicalRecord.patientName}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="text"
                name="doctorId"
                placeholder="ID bác sĩ *"
                value={editingMedicalRecord.doctorId}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="text"
                name="doctorName"
                placeholder="Tên bác sĩ *"
                value={editingMedicalRecord.doctorName}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="text"
                name="appointmentId"
                placeholder="ID cuộc hẹn *"
                value={editingMedicalRecord.appointmentId}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="date"
                name="date"
                value={editingMedicalRecord.date}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="text"
                name="diagnosis"
                placeholder="Chẩn đoán (cách nhau bằng dấu phẩy)"
                value={editingMedicalRecord.diagnosis}
                onChange={handleEditInputChange}
              />
              <input
                type="text"
                name="symptoms"
                placeholder="Triệu chứng (cách nhau bằng dấu phẩy)"
                value={editingMedicalRecord.symptoms}
                onChange={handleEditInputChange}
              />
              <input
                type="text"
                name="bloodPressure"
                placeholder="Huyết áp (VD: 120/80 mmHg)"
                value={editingMedicalRecord.bloodPressure}
                onChange={handleEditInputChange}
              />
              <input
                type="number"
                name="heartRate"
                placeholder="Nhịp tim (lần/phút)"
                value={editingMedicalRecord.heartRate}
                onChange={handleEditInputChange}
              />
              <input
                type="number"
                name="temperature"
                placeholder="Nhiệt độ cơ thể (°C)"
                value={editingMedicalRecord.temperature}
                onChange={handleEditInputChange}
              />
              <input
                type="number"
                name="weight"
                placeholder="Cân nặng (kg)"
                value={editingMedicalRecord.weight}
                onChange={handleEditInputChange}
              />
              <input
                type="number"
                name="height"
                placeholder="Chiều cao (cm)"
                value={editingMedicalRecord.height}
                onChange={handleEditInputChange}
              />
              <textarea
                name="treatmentPlan"
                placeholder="Kế hoạch điều trị"
                value={editingMedicalRecord.treatmentPlan}
                onChange={handleEditInputChange}
              />

              <div className="medications-section">
                <h4>Thuốc kê đơn</h4>
                <input
                  type="text"
                  name="name"
                  placeholder="Tên thuốc"
                  value={medicationInput.name}
                  onChange={handleEditMedicationInputChange}
                />
                <input
                  type="text"
                  name="dosage"
                  placeholder="Liều lượng (VD: 500mg)"
                  value={medicationInput.dosage}
                  onChange={handleEditMedicationInputChange}
                />
                <input
                  type="text"
                  name="frequency"
                  placeholder="Tần suất (VD: 2 lần/ngày)"
                  value={medicationInput.frequency}
                  onChange={handleEditMedicationInputChange}
                />
                <input
                  type="text"
                  name="duration"
                  placeholder="Thời gian dùng (VD: 1 tháng)"
                  value={medicationInput.duration}
                  onChange={handleEditMedicationInputChange}
                />
                <input
                  type="text"
                  name="note"
                  placeholder="Ghi chú (VD: Uống sau ăn)"
                  value={medicationInput.note}
                  onChange={handleEditMedicationInputChange}
                />
                <button type="button" onClick={addEditMedication}>Thêm thuốc</button>
                <ul>
                  {editingMedicalRecord.medications?.map((med, index) => (
                    <li key={index}>{`${med.name}: ${med.dosage}, ${med.frequency}, ${med.duration} (${med.note})`}</li>
                  ))}
                </ul>
              </div>

              <div className="lab-results-section">
                <h4>Kết quả xét nghiệm</h4>
                <input
                  type="text"
                  name="type"
                  placeholder="Loại xét nghiệm"
                  value={labResultInput.type}
                  onChange={handleEditLabResultInputChange}
                />
                <input
                  type="text"
                  name="results"
                  placeholder="Kết quả"
                  value={labResultInput.results}
                  onChange={handleEditLabResultInputChange}
                />
                <input
                  type="date"
                  name="date"
                  value={labResultInput.date}
                  onChange={handleEditLabResultInputChange}
                />
                <button type="button" onClick={addEditLabResult}>Thêm kết quả xét nghiệm</button>
                <ul>
                  {editingMedicalRecord.labResults?.map((result, index) => (
                    <li key={index}>{`${result.type}: ${result.results} (${result.date})`}</li>
                  ))}
                </ul>
              </div>

              <div className="button-group">
                <button onClick={saveEditedMedicalRecord} className="save-medical-record-btn">Lưu thay đổi</button>
                <button onClick={() => setShowEditForm(false)} className="close-modal-btn">Hủy</button>
              </div>
            </div>
          </div>
        )}

        <div className="medical-record-table-container">
          <h2>Danh sách hồ sơ bệnh án</h2>
          <table className="medical-record-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Bệnh nhân</th>
                <th>Bác sĩ</th>
                <th>Cuộc hẹn</th>
                <th>Ngày khám</th>
                <th>Chẩn đoán</th>
                <th>Triệu chứng</th>
                <th>Huyết áp</th>
                <th>Nhịp tim</th>
                <th>Nhiệt độ</th>
                <th>Cân nặng</th>
                <th>Chiều cao</th>
                <th>Kế hoạch điều trị</th>
                <th>Thuốc kê đơn</th>
                <th>Kết quả xét nghiệm</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="16">⏳ Đang tải dữ liệu...</td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((record, index) => (
                  <tr key={record._id}>
                    <td>{index + 1 + (currentPage - 1) * recordsPerPage}</td>
                    <td>{record.patientName} (ID: {record.patientId})</td>
                    <td>{record.doctorName} (ID: {record.doctorId})</td>
                    <td>ID: {record.appointmentId}</td>
                    <td>{record.date ? new Date(record.date).toLocaleDateString() : "Chưa cung cấp"}</td>
                    <td>{record.diagnosis?.join(", ") || "Chưa cung cấp"}</td>
                    <td>{record.symptoms?.join(", ") || "Chưa cung cấp"}</td>
                    <td>{record.bloodPressure || "Chưa cung cấp"}</td>
                    <td>{record.heartRate || "Chưa cung cấp"}</td>
                    <td>{record.temperature || "Chưa cung cấp"}</td>
                    <td>{record.weight || "Chưa cung cấp"}</td>
                    <td>{record.height || "Chưa cung cấp"}</td>
                    <td>{record.treatmentPlan || "Chưa cung cấp"}</td>
                    <td>
                      {record.medications?.length > 0 ? (
                        record.medications.map((med, i) => (
                          <div key={i}>{`${med.name}: ${med.dosage}, ${med.frequency}`}</div>
                        ))
                      ) : (
                        "Chưa có"
                      )}
                    </td>
                    <td>
                      {record.labResults?.length > 0 ? (
                        record.labResults.map((result, i) => (
                          <div key={i}>{`${result.type}: ${result.results}`}</div>
                        ))
                      ) : (
                        "Chưa có"
                      )}
                    </td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEditClick(record)}>Sửa</button>
                      <button className="delete-btn" onClick={() => deleteMedicalRecord(record._id)}>Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16">Không có hồ sơ bệnh án nào.</td>
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

export default MedicalRecordManagement;