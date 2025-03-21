import React from "react";
import "../../assets/doctor/QualificationsInput.css";

const QualificationsInput = ({ qualifications, qualificationInput, setQualificationInput, addQualification }) => {
  return (
    <div className="qualifications-section">
      <h4>Trình độ học vấn</h4>
      <input
        type="text"
        placeholder="Bằng cấp (BS, TS,...)"
        value={qualificationInput.degree}
        onChange={(e) => setQualificationInput({ ...qualificationInput, degree: e.target.value })}
      />
      <input
        type="text"
        placeholder="Trường/Viện"
        value={qualificationInput.institution}
        onChange={(e) => setQualificationInput({ ...qualificationInput, institution: e.target.value })}
      />
      <input
        type="number"
        placeholder="Năm tốt nghiệp"
        value={qualificationInput.year}
        onChange={(e) => setQualificationInput({ ...qualificationInput, year: e.target.value })}
      />
      <button type="button" onClick={addQualification}>Thêm trình độ</button>
      <ul>
        {qualifications?.map((q, index) => (
          <li key={index}>{`${q.degree} - ${q.institution} (${q.year})`}</li>
        ))}
      </ul>
    </div>
  );
};

export default QualificationsInput;