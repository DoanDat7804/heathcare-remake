import React from "react";
import "../../assets/doctor/AvatarInput.css";

const AvatarInput = ({ imagePreview, handleImageChange }) => {
  return (
    <div className="avatar-section">
      <h4>Hình ảnh bác sĩ</h4>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
    </div>
  );
};

export default AvatarInput;