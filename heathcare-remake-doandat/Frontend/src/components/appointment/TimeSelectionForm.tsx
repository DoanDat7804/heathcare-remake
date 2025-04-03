import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import DayItem from "./DayItem";
import TimeSlot from "./TimeSlot";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { format, addDays } from "date-fns";

interface TimeInfo {
  selectedDate: string | null;
  selectedTime: string | null;
  selectedDoctor: string | null;
}

interface TimeSelectionFormProps {
  onSubmit: (data: TimeInfo) => void;
  initialData: TimeInfo;
}

const TimeSelectionForm = ({ onSubmit, initialData }: TimeSelectionFormProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(initialData.selectedDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(initialData.selectedTime);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(initialData.selectedDoctor);

  const generateDaysArray = () => {
    const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return Array.from({ length: 9 }).map((_, i) => {
      const date = addDays(new Date(), i);
      const dayLabel = daysOfWeek[date.getDay()];
      const dateStr = format(date, "dd");
      const dateValue = format(date, "yyyy-MM-dd");
      const available = ![0, 6].includes(date.getDay());
      return { day: dayLabel, date: dateStr, dateValue, available };
    });
  };

  const days = generateDaysArray();

  const { data: doctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: api.getDoctors,
  });

  const { data: timeSlots, isLoading: timeSlotsLoading } = useQuery({
    queryKey: ["timeslots", selectedDate, selectedDoctor],
    queryFn: () =>
      selectedDate
        ? api.getAvailableTimeslots(selectedDate, selectedDoctor ? Number(selectedDoctor) : undefined)
        : Promise.resolve([]),
    enabled: !!selectedDate,
  });

  const handleConfirmAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Vui lòng chọn thời gian khám");
      return;
    }
    onSubmit({ selectedDate, selectedTime, selectedDoctor });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Chọn ngày</Label>
        <div className="flex overflow-x-auto pb-2 gap-2">
          {days.map((day, i) => (
            <DayItem
              key={i}
              day={day.day}
              date={day.date}
              available={day.available}
              selected={selectedDate === day.dateValue}
              onClick={() => day.available && setSelectedDate(day.dateValue)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Chọn giờ</Label>
        {selectedDate ? (
          timeSlotsLoading ? (
            <div className="grid grid-cols-4 gap-2 h-12 items-center">
              <div className="col-span-4 text-center text-gray-500">Đang tải...</div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {timeSlots?.map((slot, i) => (
                <TimeSlot
                  key={i}
                  time={slot.time}
                  available={slot.available}
                  selected={selectedTime === slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="grid grid-cols-4 gap-2 h-12 items-center">
            <div className="col-span-4 text-center text-gray-500">Vui lòng chọn ngày khám trước</div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="doctor">Chọn Bác sĩ (tùy chọn)</Label>
        <Select value={selectedDoctor || "any"} onValueChange={setSelectedDoctor}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn bác sĩ khám" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Bất kỳ</SelectItem>
            {doctors?.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id.toString()}>
                {doctor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full bg-hospital-500 hover:bg-hospital-600 text-white"
        disabled={!selectedDate || !selectedTime}
        onClick={handleConfirmAppointment}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Xác Nhận Lịch Hẹn
      </Button>
    </div>
  );
};

export default TimeSelectionForm;