import React from "react";
import "../../assets/user/HealthInfoInput.css";

const HealthInfoInput = ({ healthInfo, setHealthInfoInput, addHealthInfo }) => {
  return (
    <div className="health-info-section">
      <h4>Thông tin sức khỏe</h4>
      <input
        type="text"
        placeholder="Nhóm máu"
        value={healthInfo.bloodType}
        onChange={(e) => setHealthInfoInput({ ...healthInfo, bloodType: e.target.value })}
      />
      <input
        type="text"
        placeholder="Dị ứng (cách nhau bằng dấu phẩy)"
        value={healthInfo.allergies}
        onChange={(e) => setHealthInfoInput({ ...healthInfo, allergies: e.target.value })}
      />
      <input
        type="text"
        placeholder="Bệnh mãn tính (cách nhau bằng dấu phẩy)"
        value={healthInfo.chronicDiseases}
        onChange={(e) => setHealthInfoInput({ ...healthInfo, chronicDiseases: e.target.value })}
      />
      <input
        type="text"
        placeholder="Thuốc đang dùng (cách nhau bằng dấu phẩy)"
        value={healthInfo.currentMedications}
        onChange={(e) => setHealthInfoInput({ ...healthInfo, currentMedications: e.target.value })}
      />
      <button type="button" onClick={addHealthInfo}>Thêm thông tin</button>
      <ul>
        {(healthInfo.bloodType || healthInfo.allergies || healthInfo.chronicDiseases || healthInfo.currentMedications) ? (
          <li>
            {`Nhóm máu: ${healthInfo.bloodType || "Chưa có"}, Dị ứng: ${healthInfo.allergies || "Không có"}, 
             Bệnh mãn tính: ${healthInfo.chronicDiseases || "Không có"}, Thuốc: ${healthInfo.currentMedications || "Không có"}`}
          </li>
        ) : (
          <li>Chưa có thông tin</li>
        )}
      </ul>
    </div>
  );
};

export default HealthInfoInput;