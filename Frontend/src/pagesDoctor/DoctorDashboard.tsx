import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, User, LogOut, Clock, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { getDoctor } from "@/apis/DoctorAPi"; // Import trực tiếp hàm
import { DoctorResponseDto } from "@/apis/DoctorAPi"; // Import kiểu
import { appointmentApi, AppointmentResponse } from "@/apis/appointmentsAPI"; // Import API và kiểu
import { toast } from "sonner";

const AppointmentCard = ({
  patientId,
  date,
  timeSlot,
  status,
  onViewDetails,
  onChat,
}: {
  patientId: string;
  date: string;
  timeSlot: string;
  status: string;
  onViewDetails: () => void;
  onChat: () => void;
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-soft hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-hospital-100 rounded-full flex items-center justify-center">
          <User className="h-6 w-6 text-hospital-700" />
        </div>
        <div>
          <h3 className="font-semibold">Bệnh nhân: {patientId}</h3>
          <p className="text-sm text-gray-600">
            {new Date(date).toLocaleDateString()} - {timeSlot}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full ${
            status === "confirmed"
              ? "bg-green-100 text-green-700"
              : status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status === "confirmed" ? "Đã xác nhận" : status === "pending" ? "Đang chờ" : "Đã hủy"}
        </span>
        <Button variant="outline" size="sm" onClick={onViewDetails}>
          Xem chi tiết
        </Button>
        <Button variant="outline" size="sm" onClick={onChat}>
          <MessageSquare className="h-4 w-4 mr-1" /> Chat
        </Button>
      </div>
    </div>
  );
};

const BusyTimeCard = ({ startTime, endTime, onDelete }: { startTime: string; endTime: string; onDelete: () => void }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-soft hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <Clock className="h-6 w-6 text-red-700" />
        </div>
        <div>
          <p className="text-sm text-gray-600">
            Bận từ: {new Date(startTime).toLocaleString()} đến {new Date(endTime).toLocaleString()}
          </p>
        </div>
      </div>
      <Button variant="destructive" size="sm" onClick={onDelete}>
        Xóa
      </Button>
    </div>
  );
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<DoctorResponseDto | null>(null);
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [busyTimes, setBusyTimes] = useState<{ startTime: string; endTime: string; id?: string }[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập lại!");
        navigate("/login");
        return;
      }

      try {
        // Lấy thông tin bác sĩ hiện tại
        const doctorData = await getDoctor("me"); // Giả định "me" là ID của bác sĩ hiện tại
        setDoctor(doctorData);

        // Lấy danh sách lịch hẹn
        const appointmentData = await appointmentApi.getMyAppointments(token);
        setAppointments(appointmentData);

        // Giả định có endpoint để lấy busy times (API hiện tại không có)
        // const busyTimesData = await doctorApi.getBusyTimes("me");
        // setBusyTimes(busyTimesData);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Không thể tải dữ liệu!");
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleViewAppointmentDetails = (appointment: AppointmentResponse) => {
    navigate("/doctor/appointment-detail", { state: { appointment } });
  };

  const handleChat = (patientId: string) => {
    navigate("/doctor/chat", { state: { patientId } });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAddBusyTime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime) {
      toast.error("Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc.");
      return;
    }

    const newBusyTime = { startTime, endTime };
    try {
      // Giả định có endpoint để thêm busy time (API hiện tại không có)
      // await doctorApi.addBusyTime("me", newBusyTime);
      setBusyTimes([...busyTimes, newBusyTime]);
      setStartTime("");
      setEndTime("");
      toast.success("Thêm thời gian bận thành công!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể thêm thời gian bận!");
    }
  };

  const handleDeleteBusyTime = async (index: number) => {
    const busyTimeToDelete = busyTimes[index];
    try {
      // Giả định có endpoint để xóa busy time (API hiện tại không có)
      // await doctorApi.deleteBusyTime("me", busyTimeToDelete.id);
      setBusyTimes(busyTimes.filter((_, i) => i !== index));
      toast.success("Xóa thời gian bận thành công!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể xóa thời gian bận!");
    }
  };

  if (loading) {
    return <div className="text-center py-16">Đang tải dữ liệu...</div>;
  }

  return (
    <>
      <Navbar />
      <section className="section-container bg-hospital-60 py-16 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-display font-bold text-hospital-700">
              Bảng Điều Khiển Bác Sĩ
            </h2>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
            </Button>
          </div>

          {/* Thông tin bác sĩ */}
          {doctor && (
            <div className="bg-white p-6 rounded-lg shadow-soft mb-8 flex items-center gap-6">
              <img
                src={doctor.avatar || "/default-avatar.png"}
                alt={doctor.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-2xl font-semibold text-hospital-700">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.specialty}</p>
                <p className="text-gray-500 mt-2">{doctor.hospital?.name || "Chưa có bệnh viện"}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/doctor/profile")}
                >
                  Chỉnh sửa hồ sơ
                </Button>
              </div>
            </div>
          )}

          {/* Form đánh dấu thời gian bận */}
          <div className="bg-white p-6 rounded-lg shadow-soft mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-6 w-6 text-hospital-700" />
              <h3 className="text-xl font-semibold text-hospital-700">Đánh Dấu Thời Gian Bận</h3>
            </div>
            <form onSubmit={handleAddBusyTime} className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Từ</label>
                <Input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Đến</label>
                <Input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="mt-6">
                Thêm
              </Button>
            </form>
          </div>

          {/* Danh sách thời gian bận */}
          <div className="bg-white p-6 rounded-lg shadow-soft mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-6 w-6 text-hospital-700" />
              <h3 className="text-xl font-semibold text-hospital-700">Danh Sách Thời Gian Bận</h3>
            </div>
            <div className="space-y-4">
              {busyTimes.length > 0 ? (
                busyTimes.map((busyTime, index) => (
                  <BusyTimeCard
                    key={index}
                    startTime={busyTime.startTime}
                    endTime={busyTime.endTime}
                    onDelete={() => handleDeleteBusyTime(index)}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center">Chưa có thời gian bận nào được đánh dấu.</p>
              )}
            </div>
          </div>

          {/* Danh sách lịch hẹn */}
          <div className="bg-white p-6 rounded-lg shadow-soft">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-6 w-6 text-hospital-700" />
              <h3 className="text-xl font-semibold text-hospital-700">Lịch Hẹn Sắp Tới</h3>
            </div>
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    patientId={appointment.patientId}
                    date={appointment.date}
                    timeSlot={appointment.timeSlot}
                    status={appointment.status}
                    onViewDetails={() => handleViewAppointmentDetails(appointment)}
                    onChat={() => handleChat(appointment.patientId)}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center">Không có lịch hẹn nào.</p>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default DoctorDashboard;