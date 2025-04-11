import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { appointmentApi } from "@/apis/appointmentsAPI";
import { getDoctors, DoctorResponseDto } from "@/apis/Doctor";
import AppointmentSteps from "./appointment/AppointmentSteps";
import PatientInfoForm from "./appointment/PatientInfoForm";
import TimeSelectionForm from "./appointment/TimeSelectionForm";
import { usersApi, UpdateUserRequest } from "@/apis/usersAPI";

interface PatientInfo {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  note: string;
  symptoms?: string[];
}

interface TimeInfo {
  selectedDate: string | null;
  selectedTime: string | null;
  selectedDoctor: string | null;
}

const AppointmentForm = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: "",
    phone: "",
    email: "",
    serviceType: "",
    note: "",
    symptoms: [],
  });
  const [timeInfo, setTimeInfo] = useState<TimeInfo>({
    selectedDate: null,
    selectedTime: null,
    selectedDoctor: null,
  });
  const [doctors, setDoctors] = useState<DoctorResponseDto[]>([]);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorList = await getDoctors();
        if (!Array.isArray(doctorList)) {
          throw new Error("Dữ liệu bác sĩ không phải là mảng");
        }
        setDoctors(doctorList);
      } catch (error) {
        toast.error("Không thể tải danh sách bác sĩ");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      console.log("User data:", user); // Debug để kiểm tra
      setPatientInfo({
        name: user.name || "",
        phone: user.phone || "", // Sử dụng phone từ user
        email: user.email || "",
        serviceType: "",
        note: "",
        symptoms: [],
      });
    }
  }, [isAuthenticated, user, authLoading]);

  const handlePatientInfoSubmit = async (data: PatientInfo) => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để tiếp tục!");
      navigate("/auth");
      return;
    }

    setPatientInfo(data);
    if (user && (data.name !== user.name || data.email !== user.email)) {
      try {
        await usersApi.update(
          user.id,
          { name: data.name, email: data.email, phone: data.phone || undefined },
          localStorage.getItem("token") || ""
        );
        toast.success("Cập nhật thông tin cá nhân thành công!");
      } catch (error) {
        toast.error("Cập nhật thông tin thất bại!");
      }
    }
    setActiveTab("time");
  };

  const handleTimeSelectionSubmit = async (data: TimeInfo) => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để tiếp tục!");
      navigate("/auth");
      return;
    }
  
    console.log("Received data in handleTimeSelectionSubmit:", data);
    setTimeInfo(data); // Vẫn cập nhật state để hiển thị giao diện nếu cần
    await handleSubmit({ preventDefault: () => {}, timeInfo: data } as any); // Truyền data trực tiếp
  };
  
  // Sửa handleSubmit để nhận timeInfo từ tham số nếu có
  const handleSubmit = async (e: React.FormEvent & { timeInfo?: TimeInfo }) => {
    e.preventDefault();
  
    const effectiveTimeInfo = e.timeInfo || timeInfo; // Ưu tiên dữ liệu từ tham số
    console.log("Effective TimeInfo:", effectiveTimeInfo);
  
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để đặt lịch!");
      navigate("/auth");
      return;
    }
  
    if (!patientInfo.name || !patientInfo.phone || !patientInfo.serviceType) {
      toast.error("Vui lòng điền đầy đủ thông tin cá nhân và loại dịch vụ!");
      setActiveTab("info");
      return;
    }
  
    if (!effectiveTimeInfo.selectedDate || !effectiveTimeInfo.selectedTime) {
      toast.error("Vui lòng chọn ngày và giờ khám!");
      setActiveTab("time");
      return;
    }
  
    if (!effectiveTimeInfo.selectedDoctor) {
      toast.error("Vui lòng chọn bác sĩ!");
      setActiveTab("time");
      return;
    }
  
    try {
      const token = localStorage.getItem("token") || "";
      // Chuyển đổi timeSlot thành định dạng HH:MM-HH:MM
      const startTime = effectiveTimeInfo.selectedTime; // "03:00"
      const [startHour, startMinute] = startTime.split(":"); // ["03", "00"]
      const endHour = (parseInt(startHour) + 1).toString().padStart(2, "0"); // "04"
      const timeSlotFormatted = `${startTime}-${endHour}:${startMinute}`; // "03:00-04:00"
  
      const appointmentData = {
        doctorId: effectiveTimeInfo.selectedDoctor,
        serviceType: patientInfo.serviceType,
        date: effectiveTimeInfo.selectedDate, // "2025-04-11"
        timeSlot: timeSlotFormatted, // "03:00-04:00"
        note: patientInfo.note || undefined,
        symptoms: patientInfo.symptoms?.length ? patientInfo.symptoms : undefined,
      };
      console.log("Data sent to API:", appointmentData);
      const response = await appointmentApi.createAppointment(appointmentData, token);
      console.log("API response:", response);
  
      toast.success("Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
      setPatientInfo({
        name: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        serviceType: "",
        note: "",
        symptoms: [],
      });
      setTimeInfo({ selectedDate: null, selectedTime: null, selectedDoctor: null });
      setActiveTab("info");
    } catch (error: any) {
      console.error("Error from API:", error.response?.data || error);
      toast.error("Đặt lịch thất bại: " + (error.response?.data?.message || "Lỗi không xác định"));
    }
  };

  const isPatientInfoComplete = patientInfo.name && patientInfo.phone && patientInfo.serviceType;

  if (loading || authLoading) {
    return <div className="text-center py-16">Đang tải...</div>;
  }

  return (
    <section id="appointment" className="section-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <AppointmentSteps />
        <div className="animate-fade-in animate-delay-200">
          <Card className="shadow-soft border-0 overflow-hidden">
            <CardHeader className="bg-hospital-500 text-white">
              <CardTitle className="text-2xl font-display">Đặt Lịch Khám Ngay</CardTitle>
              <CardDescription className="text-hospital-100">
                Điền thông tin và chọn thời gian phù hợp
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="info">Thông Tin</TabsTrigger>
                  <TabsTrigger value="time">Thời Gian</TabsTrigger>
                </TabsList>
                <TabsContent value="info">
                  <PatientInfoForm onSubmit={handlePatientInfoSubmit} initialData={patientInfo} />
                </TabsContent>
                <TabsContent value="time">
                  <TimeSelectionForm
                    onSubmit={handleTimeSelectionSubmit}
                    initialData={timeInfo}
                    doctors={doctors}
                  />
                  {!isPatientInfoComplete && (
                    <p className="text-red-500 text-sm mt-2">
                      Vui lòng hoàn thành thông tin cá nhân trước!
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;