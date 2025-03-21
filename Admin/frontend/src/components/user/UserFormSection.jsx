import React, { useState, useEffect } from "react";
import AddressInput from "./AddressInput";
import HealthInfoInput from "./HealthInfoInput";
import AvatarInput from "./AvatarInput";
import "../../assets/user/UserForm.css";

const UserFormSection = ({ user, onSave, onCancel, isEdit }) => {
  const [formUser, setFormUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: { street: "", district: "", city: "", country: "" },
    healthInfo: { bloodType: "", allergies: "", chronicDiseases: "", currentMedications: "" },
    avatar: "",
    role: "patient",
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [addressInput, setAddressInput] = useState({ street: "", district: "", city: "", country: "" });
  const [healthInfoInput, setHealthInfoInput] = useState({
    bloodType: "",
    allergies: "",
    chronicDiseases: "",
    currentMedications: "",
  });

  useEffect(() => {
    if (isEdit && user) {
      setFormUser({
        ...user,
        address: user.address || { street: "", district: "", city: "", country: "" },
        healthInfo: user.healthInfo || { bloodType: "", allergies: "", chronicDiseases: "", currentMedications: "" },
      });
      setImagePreview(user.avatar || null);
      setAddressInput(user.address || { street: "", district: "", city: "", country: "" });
      setHealthInfoInput(user.healthInfo || { bloodType: "", allergies: "", chronicDiseases: "", currentMedications: "" });
    }
  }, [isEdit, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormUser((prev) => ({ ...prev, avatar: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addAddress = () => {
    if (addressInput.street || addressInput.district || addressInput.city || addressInput.country) {
      setFormUser((prev) => ({
        ...prev,
        address: { ...addressInput },
      }));
      setAddressInput({ street: "", district: "", city: "", country: "" });
    }
  };

  const addHealthInfo = () => {
    if (healthInfoInput.bloodType || healthInfoInput.allergies || healthInfoInput.chronicDiseases || healthInfoInput.currentMedications) {
      setFormUser((prev) => ({
        ...prev,
        healthInfo: { ...healthInfoInput },
      }));
      setHealthInfoInput({ bloodType: "", allergies: "", chronicDiseases: "", currentMedications: "" });
    }
  };

  const handleSave = () => {
    const requiredFields = isEdit
      ? ["name", "email", "phone", "gender"]
      : ["name", "email", "password", "phone", "gender"];
    const missingFields = requiredFields.filter((field) => !formUser[field]);
    if (missingFields.length > 0) {
      alert(`❌ Vui lòng điền đầy đủ các trường bắt buộc: ${missingFields.join(", ")}`);
      return;
    }

    const userData = {
      name: formUser.name,
      email: formUser.email,
      ...(isEdit ? {} : { password: formUser.password }),
      phone: formUser.phone,
      dateOfBirth: formUser.dateOfBirth,
      gender: formUser.gender,
      address: formUser.address || {},
      healthInfo: formUser.healthInfo || {},
      avatar: formUser.avatar || "",
      role: formUser.role || "patient",
      isActive: formUser.isActive || true,
      ...(isEdit ? { _id: formUser._id } : {}),
    };

    onSave(userData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{isEdit ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng mới"}</h3>
        <input type="text" name="name" placeholder="Họ và tên *" value={formUser.name} onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email *" value={formUser.email} onChange={handleInputChange} required />
        {!isEdit && (
          <input type="password" name="password" placeholder="Mật khẩu *" value={formUser.password} onChange={handleInputChange} required />
        )}
        <input type="text" name="phone" placeholder="Số điện thoại *" value={formUser.phone} onChange={handleInputChange} required />
        <input
          type="date"
          name="dateOfBirth"
          placeholder="Ngày sinh"
          value={formUser.dateOfBirth || ""}
          onChange={handleInputChange}
        />
        <select name="gender" value={formUser.gender} onChange={handleInputChange} required>
          <option value="">Chọn giới tính *</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
        <select name="role" value={formUser.role} onChange={handleInputChange}>
          <option value="patient">Bệnh nhân</option>
          <option value="admin">Quản trị viên</option>
        </select>

        <AddressInput
          address={addressInput}
          setAddressInput={setAddressInput}
          addAddress={addAddress}
        />
        <HealthInfoInput
          healthInfo={healthInfoInput}
          setHealthInfoInput={setHealthInfoInput}
          addHealthInfo={addHealthInfo}
        />
        <AvatarInput imagePreview={imagePreview} handleImageChange={handleImageChange} />

        <div className="button-group">
          <button onClick={handleSave} className="save-user-btn">
            {isEdit ? "Lưu thay đổi" : "Lưu"}
          </button>
          <button onClick={onCancel} className="close-modal-btn">Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default UserFormSection;