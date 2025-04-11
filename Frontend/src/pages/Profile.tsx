import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import TimeSelectionForm from "@/components/appointment/TimeSelectionForm";
import PatientInfoForm from "@/components/appointment/PatientInfoForm";
import { useAvatar } from "@/pages/AvatarContext";
import { appointmentApi } from "@/apis/appointmentsAPI";

interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: string;
  service: string;
}

const initialUserData = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "0123-456-789",
  birthDate: "1990-05-15",
  avatar: "src/img/Tieu-tien-nu.jpg",
};

const Profile: React.FC = () => {
  const [userData] = useState(initialUserData);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [step, setStep] = useState<"info" | "time">("info");
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    note: "",
  });
  const { avatar, setAvatar } = useAvatar();

  // Fetch lịch hẹn từ API khi component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const data = await appointmentApi.getMyAppointments(token);
        const formattedData = data.map((item: any, index: number) => ({
          id: index + 1,
          date: item.date || "Chưa rõ",
          time: item.timeSlot || "Chưa rõ",
          doctor: item.doctorId?.name || "Bác sĩ chưa xác định",
          service: item.serviceType || "Chưa rõ dịch vụ",
        }));

        setAppointments(formattedData);
      } catch (error) {
        console.error("Lỗi khi lấy lịch hẹn:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast.success("Cập nhật ảnh đại diện thành công!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePatientInfoSubmit = (data: any) => {
    setPatientInfo(data);
    setStep("time");
  };

  const handleTimeSubmit = (data: any) => {
    const newAppointment: Appointment = {
      id: appointments.length + 1,
      date: data.selectedDate || "",
      time: data.selectedTime || "",
      doctor: data.selectedDoctor ? `Dr. ${data.selectedDoctor}` : "Bác sĩ chưa xác định",
      service: patientInfo.service,
    };
    setAppointments([...appointments, newAppointment]);
    toast.success("Đặt lịch khám thành công!");
    setShowBookingForm(false);
    setStep("info");
    setPatientInfo({ name: "", phone: "", email: "", service: "", note: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Hồ Sơ Cá Nhân
          </h1>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Thông Tin Cá Nhân</h2>
          <div className="flex flex-col items-center mb-6">
            <img
              src={avatar || userData.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <span className="text-blue-600 hover:underline">Cập nhật ảnh đại diện</span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Họ và tên</Label>
              <p className="text-gray-700">{userData.name}</p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-gray-700">{userData.email}</p>
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <p className="text-gray-700">{userData.phone}</p>
            </div>
            <div className="space-y-2">
              <Label>Ngày tháng năm sinh</Label>
              <p className="text-gray-700">{userData.birthDate}</p>
            </div>
          </div>
          <Button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
            Chỉnh sửa thông tin
          </Button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Lịch Khám Đã Đặt</h2>
            <Button
              onClick={() => setShowBookingForm(true)}
              className="bg-hospital-500 hover:bg-hospital-600 text-white"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Đặt lịch mới
            </Button>
          </div>
          {appointments.length === 0 ? (
            <p className="text-gray-600">Bạn chưa có lịch khám nào.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {appointment.date} - {appointment.time}
                    </p>
                    <p className="text-gray-600">Bác sĩ: {appointment.doctor}</p>
                    <p className="text-gray-600">Dịch vụ: {appointment.service}</p>
                  </div>
                  <Button variant="outline" className="text-red-600 hover:text-red-700">
                    Hủy lịch
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {step === "info" ? "Thông Tin Bệnh Nhân" : "Chọn Thời Gian Khám"}
              </h2>
              {step === "info" ? (
                <PatientInfoForm
                  onSubmit={handlePatientInfoSubmit}
                  initialData={patientInfo}
                />
              ) : (
                <TimeSelectionForm
                  onSubmit={handleTimeSubmit}
                  initialData={{ selectedDate: null, selectedTime: null, selectedDoctor: null }}
                />
              )}
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => setShowBookingForm(false)}
              >
                Đóng
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
