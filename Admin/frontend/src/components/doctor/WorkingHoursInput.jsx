import React from "react";
import "../../assets/doctor/WorkingHoursInput.css";

const WorkingHoursInput = ({ workingHours, workingHourInput, setWorkingHourInput, addWorkingHour }) => {
  return (
    <div className="working-hours-section">
      <h4>Giờ làm việc</h4>
      <select
        value={workingHourInput.day}
        onChange={(e) => setWorkingHourInput({ ...workingHourInput, day: e.target.value })}
      >
        <option value="">Chọn ngày</option>
        <option value="Thứ 2">Thứ 2</option>
        <option value="Thứ 3">Thứ 3</option>
        <option value="Thứ 4">Thứ 4</option>
        <option value="Thứ 5">Thứ 5</option>
        <option value="Thứ 6">Thứ 6</option>
        <option value="Thứ 7">Thứ 7</option>
        <option value="Chủ nhật">Chủ nhật</option>
      </select>
      <input
        type="time"
        value={workingHourInput.startTime}
        onChange={(e) => setWorkingHourInput({ ...workingHourInput, startTime: e.target.value })}
      />
      <input
        type="time"
        value={workingHourInput.endTime}
        onChange={(e) => setWorkingHourInput({ ...workingHourInput, endTime: e.target.value })}
      />
      <label>
        <input
          type="checkbox"
          checked={workingHourInput.available}
          onChange={(e) => setWorkingHourInput({ ...workingHourInput, available: e.target.checked })}
        />
        Có làm việc
      </label>
      <button type="button" onClick={addWorkingHour}>Thêm giờ làm</button>
      <ul>
        {workingHours?.map((wh, index) => (
          <li key={index}>{`${wh.day}: ${wh.startTime} - ${wh.endTime} (${wh.available ? "Có" : "Không"})`}</li>
        ))}
      </ul>
    </div>
  );
};

export default WorkingHoursInput;