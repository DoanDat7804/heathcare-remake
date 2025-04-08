import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DoctorResponseDto } from "@/apis/DoctorAPi"; // Đảm bảo import đúng
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
  doctors: DoctorResponseDto[] | undefined;
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

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("TimeSelectionForm data:", { selectedDate, selectedTime, selectedDoctor });
    onSubmit({ selectedDate, selectedTime, selectedDoctor });
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
              <option key={doctor._id} value={doctor._id}> {/* Sửa id thành _id */}
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