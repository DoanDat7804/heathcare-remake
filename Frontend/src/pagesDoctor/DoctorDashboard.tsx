import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Calendar, User, LogOut, Clock, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { doctorApi } from "../apis/doctorApi";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

// Component AppointmentCard
const AppointmentCard = ({ patientName, time, status, patientDetails, onViewDetails, onChat }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-soft hover:shadow-md transition-shadow">
      <div 
        className="flex items-center gap-4 cursor-pointer" 
        onClick={handleToggleDetails}
      >
        <div className="w-12 h-12 bg-hospital-100 rounded-full flex items-center justify-center">
          <User className="h-6 w-6 text-hospital-700" />
        </div>
        <div>
          <h3 className="font-semibold hover:underline">{patientName}</h3>
          <p className="text-sm text-gray-600">{time}</p>
          {showDetails && patientDetails && (
            <div className="mt-2 text-sm text-gray-700">
              <p>ID: {patientDetails._id}</p>
              <p>Email: {patientDetails.email}</p>
              <p>Số điện thoại: {patientDetails.phone || "Chưa cung cấp"}</p>
            </div>
          )}
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

// Component BusyTimeCard
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

// Component DoctorDashboard
const DoctorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [busyTimes, setBusyTimes] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !isAuthenticated || user?.role !== "doctor") {
      navigate("/doctor/login", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const doctorId = user.id || location.state?.doctorId;
        if (!doctorId) {
          throw new Error("Không tìm thấy ID bác sĩ!");
        }
    
        const token = localStorage.getItem("token");
        console.log("Raw token from localStorage:", token);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log("Config headers:", config.headers);
    
        // Decode token để kiểm tra nội dung
        const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
        console.log("Decoded token:", decodedToken);
    
        // Lấy thông tin bác sĩ
        console.log("Calling getDoctorById...");
        const doctorResponse = await doctorApi.getDoctorById(doctorId, config);
        console.log("Doctor response:", doctorResponse.data);
        setDoctor(doctorResponse.data);
    
        // Lấy danh sách lịch hẹn
        console.log("Calling getAppointments (/appointments/me)...");
        const appointmentsResponse = await doctorApi.getAppointments(config);
        console.log("Appointments response (raw):", appointmentsResponse);
        console.log("Appointments data:", appointmentsResponse.data);
        const appointmentsData = Array.isArray(appointmentsResponse.data) ? appointmentsResponse.data : [];
        console.log("Appointments data (processed):", appointmentsData);
    
        const today = new Date();
        const filteredAppointments = appointmentsData.filter((appt) => {
          const isFuture = new Date(appt.date) >= today;
          console.log(`Appointment date: ${appt.date}, isFuture: ${isFuture}`);
          return isFuture;
        });
        console.log("Filtered appointments:", filteredAppointments);
    
        setAppointments(
          filteredAppointments.map((appt) => {
            const mapped = {
              patientName: appt.patientId?.name || "Bệnh nhân không xác định",
              time: appt.date && appt.timeSlot 
                ? `${new Date(appt.date).toLocaleDateString()} ${appt.timeSlot}`
                : "Thời gian không xác định",
              status: appt.status || "unknown",
              patientDetails: appt.patientId,
              original: appt,
            };
            console.log("Mapped appointment:", mapped);
            return mapped;
          })
        );
    
        // Lấy thời gian bận
        console.log("Calling getBusyTimes...");
        try {
          const busyTimesResponse = await doctorApi.getBusyTimes(config);
          console.log("Busy times response:", busyTimesResponse.data);
          setBusyTimes(Array.isArray(busyTimesResponse.data) ? busyTimesResponse.data : []);
        } catch (err) {
          console.warn("No busy times found:", err);
          setBusyTimes([]);
        }
      } catch (error) {
        console.error("Lỗi chi tiết:", error);
        console.error("Error response:", error.response?.data);
        console.error("Status code:", error.response?.status);
        toast.error(error.message || "Không thể tải dữ liệu!");
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("doctorId");
          navigate("/doctor/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.state, navigate, user, isAuthenticated]);

  const handleViewAppointmentDetails = (appointment) => {
    navigate("/doctor/appointment-detail", { state: { appointment: appointment.original } });
  };

  const handleChat = (patientName) => {
    navigate("/doctor/chat", { state: { patientName } });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("doctorId");
    navigate("/doctor/login", { replace: true });
  };

  const handleAddBusyTime = async (e) => {
    e.preventDefault();
    if (!startTime || !endTime) {
      toast.error("Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc.");
      return;
    }

    const newBusyTime = { startTime, endTime };
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await doctorApi.createBusyTime(newBusyTime, config);
      const busyTimesResponse = await doctorApi.getBusyTimes(config);
      setBusyTimes(busyTimesResponse.data || []);
      setStartTime("");
      setEndTime("");
      toast.success("Thêm thời gian bận thành công!");
    } catch (error) {
      toast.error(error.message || "Không thể thêm thời gian bận!");
    }
  };

  const handleDeleteBusyTime = async (busyTimeId) => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await doctorApi.deleteBusyTime(busyTimeId, config);
      const busyTimesResponse = await doctorApi.getBusyTimes(config);
      setBusyTimes(busyTimesResponse.data || []);
      toast.success("Xóa thời gian bận thành công!");
    } catch (error) {
      toast.error(error.message || "Không thể xóa thời gian bận!");
    }
  };

  const handleEditProfile = () => {
    const doctorId = user.id || location.state?.doctorId;
    navigate("/doctor/profile", { state: { doctorId } });
  };

  if (loading) {
    return <div className="text-center py-16">Đang tải dữ liệu...</div>;
  }

  return (
    <section className="section-container bg-hospital-60 min-h-screen">
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-display font-bold text-hospital-700">
            Bảng Điều Khiển Bác Sĩ
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
          </Button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto pt-20 pb-16 px-4">
        {doctor && (
          <div className="bg-white p-6 rounded-lg shadow-soft mb-8 flex items-center gap-6">
            <img
              src={doctor.avatar || "default-avatar.png"}
              alt={doctor.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h3 className="text-2xl font-semibold text-hospital-700">{doctor.name}</h3>
              <p className="text-gray-600">
                Chuyên khoa: {doctor.specialty || "Chưa cập nhật"}
              </p>
              <p className="text-gray-600">Số điện thoại: {doctor.phone}</p>
              <p className="text-gray-500">Giới tính: {doctor.gender}</p>
              <p className="text-gray-500">Mã bác sĩ: {doctor._id || "Không xác định"}</p>
              <Button variant="outline" className="mt-4" onClick={handleEditProfile}>
                Chỉnh sửa hồ sơ
              </Button>
            </div>
          </div>
        )}

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

        <div className="bg-white p-6 rounded-lg shadow-soft mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-6 w-6 text-hospital-700" />
            <h3 className="text-xl font-semibold text-hospital-700">Danh Sách Thời Gian Bận</h3>
          </div>
          <div className="space-y-4">
            {busyTimes.length > 0 ? (
              busyTimes.map((busyTime) => (
                <BusyTimeCard
                  key={busyTime.id}
                  startTime={busyTime.startTime}
                  endTime={busyTime.endTime}
                  onDelete={() => handleDeleteBusyTime(busyTime.id)}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center">Chưa có thời gian bận nào được đánh dấu.</p>
            )}
          </div>
        </div>

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
                  patientDetails={appointment.patientDetails}
                  onViewDetails={() => handleViewAppointmentDetails(appointment)}
                  onChat={() => handleChat(appointment.patientName)}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center">Hiện tại không có lịch hẹn nào.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorDashboard;