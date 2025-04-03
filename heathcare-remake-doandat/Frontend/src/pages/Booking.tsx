import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import TimeSelectionForm from "@/components/appointment/TimeSelectionForm"; // Sửa đường dẫn import
import PatientInfoForm from "@/components/appointment/PatientInfoForm"; // S

interface TimeInfo {
  selectedDate: string | null;
  selectedTime: string | null;
  selectedDoctor: string | null;
}

interface PatientInfo {
  name: string;
  phone: string;
  email: string;
  service: string;
  note: string;
}

const Booking = () => {
  const [step, setStep] = useState(1); // Quản lý bước hiện tại
  const [timeInfo, setTimeInfo] = useState<TimeInfo>({
    selectedDate: null,
    selectedTime: null,
    selectedDoctor: null,
  });
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: "",
    phone: "",
    email: "",
    service: "",
    note: "",
  });

  // Xử lý khi hoàn thành bước chọn thời gian
  const handleTimeSubmit = (data: TimeInfo) => {
    setTimeInfo(data);
    setStep(2); // Chuyển sang bước nhập thông tin bệnh nhân
  };

  // Xử lý khi hoàn thành bước nhập thông tin bệnh nhân
  const handlePatientSubmit = (data: PatientInfo) => {
    setPatientInfo(data);
    setStep(3); // Chuyển sang bước xác nhận
    toast.success("Đặt lịch khám thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
  };

  // Quay lại bước trước
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-hospital-60">
      <Navbar />

      <section className="flex-grow py-16">
        <div className="container mx-auto px-4">
          {/* Tiêu đề */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Đặt Lịch Khám
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Đặt lịch khám dễ dàng với các bước đơn giản dưới đây. Chúng tôi sẽ hỗ trợ bạn nhanh chóng!
            </p>
          </div>

          {/* Thanh tiến trình */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-hospital-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                1
              </div>
              <span className={step >= 1 ? "text-hospital-600 font-semibold" : "text-gray-500"}>Chọn thời gian</span>
              <div className="w-12 h-1 bg-gray-300"></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-hospital-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                2
              </div>
              <span className={step >= 2 ? "text-hospital-600 font-semibold" : "text-gray-500"}>Thông tin bệnh nhân</span>
              <div className="w-12 h-1 bg-gray-300"></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-hospital-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                3
              </div>
              <span className={step >= 3 ? "text-hospital-600 font-semibold" : "text-gray-500"}>Xác nhận</span>
            </div>
          </div>

          {/* Nội dung từng bước */}
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
            {step === 1 && (
              <>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Bước 1: Chọn Thời Gian Khám</h2>
                <p className="text-gray-600 mb-4">
                  Vui lòng chọn ngày, giờ và bác sĩ (nếu muốn) để đặt lịch khám. Các ngày cuối tuần có thể không khả dụng.
                </p>
                <TimeSelectionForm onSubmit={handleTimeSubmit} initialData={timeInfo} />
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Bước 2: Nhập Thông Tin Bệnh Nhân</h2>
                <p className="text-gray-600 mb-4">
                  Điền thông tin cá nhân và dịch vụ khám để chúng tôi có thể phục vụ bạn tốt nhất.
                </p>
                <PatientInfoForm onSubmit={handlePatientSubmit} initialData={patientInfo} />
                <Button
                  variant="outline"
                  className="mt-4 w-full border-hospital-500 text-hospital-500 hover:bg-hospital-50"
                  onClick={handleBack}
                >
                  Quay lại
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Bước 3: Xác Nhận Lịch Hẹn</h2>
                <p className="text-gray-600 mb-4">
                  Kiểm tra lại thông tin lịch hẹn của bạn. Chúng tôi sẽ gửi xác nhận qua email hoặc số điện thoại.
                </p>
                <div className="space-y-4">
                  <div>
                    <Label className="font-semibold">Ngày khám:</Label>
                    <p>{timeInfo.selectedDate || "Chưa chọn"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Giờ khám:</Label>
                    <p>{timeInfo.selectedTime || "Chưa chọn"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Bác sĩ:</Label>
                    <p>{timeInfo.selectedDoctor ? `ID: ${timeInfo.selectedDoctor}` : "Bất kỳ"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Họ và tên:</Label>
                    <p>{patientInfo.name}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Số điện thoại:</Label>
                    <p>{patientInfo.phone}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Email:</Label>
                    <p>{patientInfo.email || "Không có"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Dịch vụ:</Label>
                    <p>{patientInfo.service}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Ghi chú:</Label>
                    <p>{patientInfo.note || "Không có"}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 w-full border-hospital-500 text-hospital-500 hover:bg-hospital-50"
                  onClick={handleBack}
                >
                  Quay lại chỉnh sửa
                </Button>
              </>
            )}
          </div>

          {/* Hướng dẫn đặt lịch khám */}
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Hướng Dẫn Đặt Lịch Khám</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-hospital-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-hospital-600 font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Chọn Thời Gian</h3>
                <p className="text-gray-600 text-sm">
                  Chọn ngày và giờ phù hợp từ lịch trống của chúng tôi. Bạn cũng có thể chọn bác sĩ nếu muốn.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-hospital-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-hospital-600 font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Nhập Thông Tin</h3>
                <p className="text-gray-600 text-sm">
                  Cung cấp thông tin cá nhân và dịch vụ khám để chúng tôi chuẩn bị tốt nhất cho bạn.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-hospital-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-hospital-600 font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Xác Nhận</h3>
                <p className="text-gray-600 text-sm">
                  Kiểm tra thông tin và xác nhận lịch hẹn. Bạn sẽ nhận được thông báo qua email hoặc điện thoại.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;