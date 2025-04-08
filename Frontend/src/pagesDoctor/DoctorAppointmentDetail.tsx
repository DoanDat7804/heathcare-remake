import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Phone, Mail, FileText, ArrowLeft, Stethoscope } from "lucide-react";
import { doctorApi } from "../apis/doctorApi";
import { toast } from "sonner";

interface Patient {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface Doctor {
  _id: string;
  name: string;
}

interface Appointment {
  _id: string;
  patientId: Patient | string;
  doctorId: Doctor | string;
  serviceType: string;
  date: string;
  timeSlot: string;
  status: "confirmed" | "pending" | "cancelled" | string;
  note?: string;
}

const DoctorAppointmentDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointment }: { appointment?: Appointment } = location.state || {};
  const [note, setNote] = useState<string>(appointment?.note || "");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  React.useEffect(() => {
    console.log("Appointment data:", appointment);
  }, [appointment]);

  if (!appointment) {
    toast.error("Không tìm thấy thông tin lịch hẹn!");
    return (
      <div className="min-h-screen bg-hospital-60 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Lỗi</h2>
          <p className="mt-2 text-gray-600">Không có dữ liệu lịch hẹn để hiển thị.</p>
          <Button
            variant="outline"
            className="mt-4 flex items-center mx-auto"
            onClick={() => navigate("/doctor/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const getName = (entity: Patient | Doctor | string | undefined): string => {
    if (!entity) return "Không xác định";
    return typeof entity === "string" ? entity : entity.name || "Không xác định";
  };

  const getId = (entity: Patient | Doctor | string | undefined): string => {
    if (!entity) return "N/A";
    return typeof entity === "string" ? entity : entity._id || "N/A";
  };

  const getPatientEmail = (patient: Patient | string | undefined): string => {
    if (!patient || typeof patient === "string") return "Chưa cung cấp";
    return patient.email || "Chưa cung cấp";
  };

  const getPatientPhone = (patient: Patient | string | undefined): string => {
    if (!patient || typeof patient === "string") return "Chưa cung cấp";
    return patient.phone || "Chưa cung cấp";
  };

  const handleSaveNote = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập lại!");
      navigate("/doctor/login");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const updatedData = { note };
      await doctorApi.updateAppointment(appointment._id, updatedData, config);
      setIsEditing(false);
      toast.success("Cập nhật ghi chú thành công!");
    } catch (error: any) {
      console.error("Error updating note:", error);
      const errorMessage = error.response?.data?.message || error.message || "Không thể cập nhật ghi chú!";
      toast.error(errorMessage);
    }
  };

  const handleBack = () => {
    navigate("/doctor/dashboard");
  };

  return (
    <div className="min-h-screen bg-hospital-60 p-6">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="outline"
          className="mb-6 flex items-center"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
        </Button>

        <Card className="bg-white shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-hospital-700">
              Chi tiết lịch hẹn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-hospital-700" />
                <div>
                  <Label className="text-sm text-gray-600">Tên bệnh nhân</Label>
                  <p className="font-semibold">{getName(appointment.patientId)}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Mã bệnh nhân</Label>
                <p className="font-semibold">{getId(appointment.patientId)}</p>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-hospital-700" />
                <div>
                  <Label className="text-sm text-gray-600">Tên bác sĩ</Label>
                  <p className="font-semibold">{getName(appointment.doctorId)}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Mã bác sĩ</Label>
                <p className="font-semibold">{getId(appointment.doctorId)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-hospital-700" />
                <div>
                  <Label className="text-sm text-gray-600">Dịch vụ khám</Label>
                  <p className="font-semibold">{appointment.serviceType || "Không xác định"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-hospital-700" />
                <div>
                  <Label className="text-sm text-gray-600">Thời gian</Label>
                  <p className="font-semibold">
                    {appointment.date && appointment.timeSlot
                      ? `${new Date(appointment.date).toLocaleDateString("vi-VN")} ${appointment.timeSlot}`
                      : "Không xác định"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-hospital-700" />
                <div>
                  <Label className="text-sm text-gray-600">Email bệnh nhân</Label>
                  <p className="font-semibold">{getPatientEmail(appointment.patientId)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-hospital-700" />
                <div>
                  <Label className="text-sm text-gray-600">Số điện thoại bệnh nhân</Label>
                  <p className="font-semibold">{getPatientPhone(appointment.patientId)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-hospital-700" />
                <Label className="text-sm text-gray-600">Ghi chú của bác sĩ</Label>
              </div>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú..."
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveNote}>Lưu</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Hủy
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-gray-700">{note || "Chưa có ghi chú"}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Sửa
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600">Trạng thái</Label>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  appointment.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : appointment.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : appointment.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {appointment.status === "confirmed"
                  ? "Đã xác nhận"
                  : appointment.status === "pending"
                  ? "Đang chờ"
                  : appointment.status === "cancelled"
                  ? "Đã hủy"
                  : appointment.status || "Không xác định"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorAppointmentDetail;