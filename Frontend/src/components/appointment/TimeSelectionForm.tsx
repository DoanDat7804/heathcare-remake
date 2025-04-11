import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DoctorResponseDto } from "@/apis/DoctorAPi";
import DayItem from "./DayItem";
import TimeSlot from "./TimeSlot";

interface TimeInfo {
  selectedDate: string | null;
  selectedTime: string | null;
  selectedDoctor: string | null;
}

interface TimeSelectionFormProps {
  onSubmit: (data: TimeInfo) => void;
  initialData: TimeInfo;
  doctors: DoctorResponseDto[] | undefined; // Cho phép undefined
}

const TimeSelectionForm = ({ onSubmit, initialData, doctors }: TimeSelectionFormProps) => {
  const [selectedDate, setSelectedDate] = useState(initialData.selectedDate);
  const [selectedTime, setSelectedTime] = useState(initialData.selectedTime);
  const [selectedDoctor, setSelectedDoctor] = useState(initialData.selectedDoctor);

  const days = [
    { day: "Mon", date: "10", fullDate: "2025-04-10" },
    { day: "Tue", date: "11", fullDate: "2025-04-11" },
    { day: "Wed", date: "12", fullDate: "2025-04-12" },
  ];
  const timeSlots = ["09:00-10:00", "10:00-11:00", "14:00-15:00"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      selectedDate,
      selectedTime,
      selectedDoctor,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Chọn ngày</label>
        <div className="flex gap-2 mt-1">
          {days.map((d) => (
            <DayItem
              key={d.fullDate}
              day={d.day}
              date={d.date}
              available={true}
              selected={selectedDate === d.fullDate}
              onClick={() => setSelectedDate(d.fullDate)}
            />
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Chọn giờ</label>
        <div className="flex gap-2 mt-1 flex-wrap">
          {timeSlots.map((time) => (
            <TimeSlot
              key={time}
              time={time}
              available={true}
              selected={selectedTime === time}
              onClick={() => setSelectedTime(time)}
            />
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Chọn bác sĩ</label>
        <select
          value={selectedDoctor || ""}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="mt-1 block w-full border rounded-md p-2"
          required
        >
          <option value="" disabled>
            Chọn bác sĩ
          </option>
          {Array.isArray(doctors) && doctors.length > 0 ? (
            doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialty}
              </option>
            ))
          ) : (
            <option value="" disabled>
              Không có bác sĩ nào
            </option>
          )}
        </select>
      </div>
      <Button type="submit" className="w-full bg-hospital-500 hover:bg-hospital-600 text-white">
        Đặt lịch
      </Button>
    </form>
  );
};

export default TimeSelectionForm;