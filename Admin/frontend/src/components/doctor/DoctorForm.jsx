import React from "react";
import QualificationsInput from "./QualificationsInput";
import WorkingHoursInput from "./WorkingHoursInput";
import AvatarInput from "./AvatarInput";
import "../../assets/doctor/DoctorForm.css";

const DoctorForm = ({
  doctor,
  setDoctor,
  imagePreview,
  setImagePreview,
  qualificationInput,
  setQualificationInput,
  workingHourInput,
  setWorkingHourInput,
  onSave,
  onCancel,
  isEdit,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDoctor((prev) => ({ ...prev, avatar: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addQualification = () => {
    if (qualificationInput.degree && qualificationInput.institution && qualificationInput.year) {
      setDoctor((prev) => ({
        ...prev,
        qualifications: [...(prev.qualifications || []), { ...qualificationInput, year: parseInt(qualificationInput.year) }],
      }));
      setQualificationInput({ degree: "", institution: "", year: "" });
    }
  };

  const addWorkingHour = () => {
    if (workingHourInput.day && workingHourInput.startTime && workingHourInput.endTime) {
      setDoctor((prev) => ({
        ...prev,
        workingHours: [...(prev.workingHours || []), { ...workingHourInput }],
      }));
      setWorkingHourInput({ day: "", startTime: "", endTime: "", available: true });
    }
  };

  const handleSave = () => {
    const requiredFields = isEdit
      ? ["name", "email", "phone", "gender", "specialty", "experience"]
      : ["name", "email", "password", "phone", "gender", "specialty", "experience"];
    const missingFields = requiredFields.filter((field) => !doctor[field]);
    if (missingFields.length > 0) {
      alert(`❌ Vui lòng điền đầy đủ các trường bắt buộc: ${missingFields.join(", ")}`);
      return;
    }

    const doctorData = {
      name: doctor.name,
      email: doctor.email,
      password: doctor.password, // Gửi password gốc
      phone: doctor.phone,
      gender: doctor.gender,
      specialty: doctor.specialty,
      subSpecialties: typeof doctor.subSpecialties === "string" ? doctor.subSpecialties.split(", ").filter(Boolean) : doctor.subSpecialties || [],
      experience: parseInt(doctor.experience) || 0,
      qualifications: doctor.qualifications || [],
      languages: typeof doctor.languages === "string" ? doctor.languages.split(", ").filter(Boolean) : doctor.languages || [],
      bio: doctor.bio,
      hospital: {
        name: doctor.hospitalName || "",
        address: doctor.hospitalAddress || "",
        department: doctor.department || "",
      },
      workingHours: doctor.workingHours || [],
      avatar: doctor.avatar || "",
      ...(isEdit ? { isActive: doctor.isActive, _id: doctor._id } : { role: "doctor", isActive: true }),
    };

    onSave(doctorData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{isEdit ? "Chỉnh sửa thông tin bác sĩ" : "Thêm bác sĩ mới"}</h3>
        <input type="text" name="name" placeholder="Tên bác sĩ *" value={doctor.name} onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email *" value={doctor.email} onChange={handleInputChange} required />
        <input
          type="text" // Đổi type từ "password" thành "text" để hiển thị mật khẩu gốc
          name="password"
          placeholder={isEdit ? "Mật khẩu hiện tại hoặc nhập mới" : "Mật khẩu *"}
          value={doctor.password || ""}
          onChange={handleInputChange}
          required={!isEdit}
        />
        <input type="text" name="phone" placeholder="Số điện thoại *" value={doctor.phone} onChange={handleInputChange} required />
        <select name="gender" value={doctor.gender} onChange={handleInputChange} required>
          <option value="">Chọn giới tính *</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
        <input type="text" name="specialty" placeholder="Chuyên khoa *" value={doctor.specialty} onChange={handleInputChange} required />
        <input
          type="text"
          name="subSpecialties"
          placeholder="Chuyên khoa phụ (cách nhau bằng dấu phẩy)"
          value={doctor.subSpecialties || ""}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="experience"
          placeholder="Số năm kinh nghiệm *"
          value={doctor.experience}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="languages"
          placeholder="Ngôn ngữ (cách nhau bằng dấu phẩy)"
          value={doctor.languages || ""}
          onChange={handleInputChange}
        />
        <textarea name="bio" placeholder="Tiểu sử" value={doctor.bio || ""} onChange={handleInputChange} />
        <input type="text" name="hospitalName" placeholder="Tên bệnh viện" value={doctor.hospitalName || ""} onChange={handleInputChange} />
        <input
          type="text"
          name="hospitalAddress"
          placeholder="Địa chỉ bệnh viện"
          value={doctor.hospitalAddress || ""}
          onChange={handleInputChange}
        />
        <input type="text" name="department" placeholder="Khoa" value={doctor.department || ""} onChange={handleInputChange} />

        <QualificationsInput
          qualifications={doctor.qualifications}
          qualificationInput={qualificationInput}
          setQualificationInput={setQualificationInput}
          addQualification={addQualification}
        />
        <WorkingHoursInput
          workingHours={doctor.workingHours}
          workingHourInput={workingHourInput}
          setWorkingHourInput={setWorkingHourInput}
          addWorkingHour={addWorkingHour}
        />
        <AvatarInput imagePreview={imagePreview} handleImageChange={handleImageChange} />

        <div className="button-group">
          <button onClick={handleSave} className="save-doctor-btn">
            {isEdit ? "Lưu thay đổi" : "Lưu"}
          </button>
          <button onClick={onCancel} className="close-modal-btn">Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorForm;