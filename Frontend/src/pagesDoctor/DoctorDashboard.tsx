import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, User, LogOut, Clock, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react"; // Thêm useEffect
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { doctorApi } from "../apis/doctorApi"; // Import doctorApi
import { toast } from "sonner"; // Thêm toast để hiển thị thông báo

const AppointmentCard = ({
  patientName,
  time,
  status,
  onViewDetails,
  onChat,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-soft hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-hospital-100 rounded-full flex items-center justify-center">
          <User className="h-6 w-6 text-hospital-700" />
        </div>
        <div>
          <h3 className="font-semibold">{patientName}</h3>
          <p className="text-sm text-gray-600">{time}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full ${
            status === "Confirmed"
              ? "bg-green-100 text-green-700"
              : status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status === "Confirmed" ? "Đã xác nhận" : status === "Pending" ? "Đang chờ" : "Đã hủy"}
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

const BusyTimeCard = ({ startTime, endTime, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-soft hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <Clock className="h-6 w-6 text-red-700" />
        </div>
        <div>
          <p className="text-sm text-gray-600">
            Bận từ: {startTime} đến {endTime}
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
  const [doctor, setDoctor] = useState(null); // Thay vì dữ liệu tĩnh
  const [appointments, setAppointments] = useState([]);
  const [busyTimes, setBusyTimes] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  // Lấy dữ liệu từ API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin bác sĩ hiện tại (giả định endpoint /doctors/me)
        const doctorResponse = await doctorApi.getDoctorById("me"); // Thay "me" bằng ID thực tế nếu cần
        setDoctor(doctorResponse.data);

        // Lấy danh sách lịch hẹn (giả định endpoint /doctors/me/appointments)
        const appointmentsResponse = await doctorApi.getAllDoctors(); // Thay bằng endpoint thực tế nếu có
        setAppointments(appointmentsResponse.data.appointments || []);

        // Lấy danh sách thời gian bận (giả định endpoint /doctors/me/busy-times)
        const busyTimesResponse = await doctorApi.getAllDoctors(); // Thay bằng endpoint thực tế nếu có
        setBusyTimes(busyTimesResponse.data.busyTimes || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Không thể tải dữ liệu!");
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewAppointmentDetails = (appointment) => {
    navigate("/doctor/appointment-detail", { state: { appointment } });
  };

  const handleChat = (patientName) => {
    navigate("/doctor/chat", { state: { patientName } });
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token khi đăng xuất
    navigate("/login");
  };

  const handleAddBusyTime = async (e) => {
    e.preventDefault();
    if (!startTime || !endTime) {
      toast.error("Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc.");
      return;
    }

    const newBusyTime = { startTime, endTime };
    try {
      // Gửi yêu cầu thêm thời gian bận (giả định endpoint POST /doctors/me/busy-times)
      await doctorApi.createDoctor(newBusyTime); // Thay bằng endpoint thực tế nếu có
      setBusyTimes([...busyTimes, newBusyTime]);
      setStartTime("");
      setEndTime("");
      toast.success("Thêm thời gian bận thành công!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể thêm thời gian bận!");
    }
  };

  const handleDeleteBusyTime = async (index) => {
    const busyTimeToDelete = busyTimes[index];
    try {
      // Gửi yêu cầu xóa thời gian bận (giả định endpoint DELETE /doctors/me/busy-times/:id)
      await doctorApi.deleteDoctor(busyTimeToDelete.id); // Thay bằng ID thực tế từ dữ liệu API
      setBusyTimes(busyTimes.filter((_, i) => i !== index));
      toast.success("Xóa thời gian bận thành công!");
    } catch (error) {
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
                src={doctor.image}
                alt={doctor.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-2xl font-semibold text-hospital-700">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.title}</p>
                <p className="text-gray-500 mt-2">{doctor.details}</p>
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
                appointments.map((appointment, index) => (
                  <AppointmentCard
                    key={index}
                    patientName={appointment.patientName}
                    time={appointment.time}
                    status={appointment.status}
                    onViewDetails={() => handleViewAppointmentDetails(appointment)}
                    onChat={() => handleChat(appointment.patientName)}
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