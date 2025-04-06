// DoctorProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { doctorApi } from "../apis/doctorApi";
import { toast } from "sonner";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Trạng thái hiển thị form chỉnh sửa
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    phone: "",
    gender: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/doctor/login", { replace: true });
      return;
    }

    const doctorId = location.state?.doctorId || localStorage.getItem("doctorId");
    if (!doctorId) {
      toast.error("Không tìm thấy ID bác sĩ!");
      navigate("/doctor/dashboard", { replace: true });
      return;
    }

    const fetchDoctorData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await doctorApi.getDoctorById(doctorId, config);
        const doctorData = response.data;
        setDoctor(doctorData);
        setFormData({
          name: doctorData.name || "",
          specialty: doctorData.specialty || "",
          phone: doctorData.phone || "",
          gender: doctorData.gender || "",
        });
      } catch (error) {
        toast.error(error.message || "Không thể tải thông tin bác sĩ!");
        console.error("Lỗi khi tải thông tin:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("doctorId");
          navigate("/doctor/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, [location.state, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const doctorId = location.state?.doctorId || localStorage.getItem("doctorId");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      // Cập nhật thông tin bác sĩ qua API
      await doctorApi.updateDoctor(doctorId, formData, config);
      // Cập nhật state doctor để hiển thị thông tin mới
      setDoctor((prev) => ({ ...prev, ...formData }));
      setIsEditing(false); // Ẩn form sau khi lưu
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      toast.error(error.message || "Không thể cập nhật hồ sơ!");
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(true); // Hiển thị form chỉnh sửa
  };

  if (loading) {
    return <div className="text-center py-16">Đang tải thông tin...</div>;
  }

  return (
    <section className="section-container bg-hospital-60 py-16 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl font-display text-hospital-700">
              Hồ sơ bác sĩ
            </CardTitle>
          </CardHeader>
          <CardContent>
            {doctor && !isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label>ID</Label>
                  <p className="text-gray-700">{doctor.id}</p>
                </div>
                <div>
                  <Label>Tên</Label>
                  <p className="text-gray-700">{doctor.name}</p>
                </div>
                <div>
                  <Label>Chuyên khoa</Label>
                  <p className="text-gray-700">{doctor.specialty || "Chưa cập nhật"}</p>
                </div>
                <div>
                  <Label>Số điện thoại</Label>
                  <p className="text-gray-700">{doctor.phone || "Chưa cập nhật"}</p>
                </div>
                <div>
                  <Label>Giới tính</Label>
                  <p className="text-gray-700">{doctor.gender || "Chưa cập nhật"}</p>
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleEditToggle} className="bg-hospital-500 hover:bg-hospital-600">
                    Chỉnh sửa hồ sơ
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/doctor/dashboard")}
                  >
                    Quay lại
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Tên bác sĩ</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="specialty">Chuyên khoa</Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Giới tính</Label>
                  <Input
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="bg-hospital-500 hover:bg-hospital-600">
                    Lưu thay đổi
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)} // Hủy chỉnh sửa
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DoctorProfile;