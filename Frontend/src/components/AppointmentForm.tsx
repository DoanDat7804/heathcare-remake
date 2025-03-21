import { useState } from "react";
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
import AppointmentSteps from "./appointment/AppointmentSteps";
import PatientInfoForm from "./appointment/PatientInfoForm";
import TimeSelectionForm from "./appointment/TimeSelectionForm";

interface PatientInfo {
  name: string;
  phone: string;
  email: string;
  service: string;
  note: string;
}

interface TimeInfo {
  selectedDate: string | null;
  selectedTime: string | null;
  selectedDoctor: string | null;
}

const AppointmentForm = () => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: "",
    phone: "",
    email: "",
    service: "",
    note: "",
  });
  const [timeInfo, setTimeInfo] = useState<TimeInfo>({
    selectedDate: null,
    selectedTime: null,
    selectedDoctor: null,
  });
  const [activeTab, setActiveTab] = useState("info");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientInfo.name || !patientInfo.phone || !patientInfo.service) {
      toast.error("Vui lòng điền đầy đủ thông tin cá nhân và dịch vụ!");
      setActiveTab("info");
      return;
    }
    if (!timeInfo.selectedDate || !timeInfo.selectedTime) {
      toast.error("Vui lòng chọn ngày và giờ khám!");
      setActiveTab("time");
      return;
    }
    toast.success("Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
    // Reset form
    setPatientInfo({ name: "", phone: "", email: "", service: "", note: "" });
    setTimeInfo({ selectedDate: null, selectedTime: null, selectedDoctor: null });
    setActiveTab("info");
  };

  const handlePatientInfoSubmit = (data: PatientInfo) => {
    setPatientInfo(data);
    setActiveTab("time"); // Chuyển sang tab "Thời Gian"
  };

  const handleTimeSelectionSubmit = (data: TimeInfo) => {
    setTimeInfo(data);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent); // Gửi form tổng thể
  };

  // Kiểm tra xem thông tin cơ bản đã đủ chưa
  const isPatientInfoComplete = patientInfo.name && patientInfo.phone && patientInfo.service;

  return (
    <section id="appointment" className="section-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <AppointmentSteps />
        <div className="animate-fade-in animate-delay-200">
          <Card className="shadow-soft border-0 overflow-hidden">
            <CardHeader className="bg-hospital-500 text-white">
              <CardTitle className="text-2xl font-display">Đặt Lịch Khám Ngay</CardTitle>
              <CardDescription className="text-hospital-100">Điền thông tin và chọn thời gian phù hợp</CardDescription>
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
                  <TimeSelectionForm onSubmit={handleTimeSelectionSubmit} initialData={timeInfo} />
                  {!isPatientInfoComplete && (
                    <p className="text-red-500 text-sm mt-2">Vui lòng hoàn thành thông tin cá nhân trước!</p>
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