import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { doctorApi } from "../apis/doctorApi";
import { toast } from "sonner";

const BASE_URL = "http://localhost:3000"; // Thêm BASE_URL để hiển thị avatar

const DoctorProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    phone: "",
    gender: "",
    avatar: null, // Thêm avatar vào formData
  });
  const [avatarFile, setAvatarFile] = useState(null); // Lưu file ảnh tạm thời

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
        setDoctor({
          ...doctorData,
          avatar: doctorData.avatar ? `${BASE_URL}${doctorData.avatar}` : null, // Chuẩn hóa avatar
        });
        setFormData({
          name: doctorData.name || "",
          specialty: doctorData.specialty || "",
          phone: doctorData.phone || "",
          gender: doctorData.gender || "",
          avatar: doctorData.avatar ? `${BASE_URL}${doctorData.avatar}` : null, // Đặt avatar ban đầu
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setFormData((prev) => ({ ...prev, avatar: URL.createObjectURL(file) })); // Hiển thị preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const doctorId = location.state?.doctorId || localStorage.getItem("doctorId");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      // Cập nhật thông tin bác sĩ (không bao gồm avatar)
      const updateData = {
        name: formData.name,
        specialty: formData.specialty,
        phone: formData.phone,
        gender: formData.gender,
      };
      await doctorApi.updateDoctor(doctorId, updateData, config);

      // Upload avatar nếu có file mới
      if (avatarFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("avatar", avatarFile);
        const uploadResponse = await doctorApi.uploadAvatar(doctorId, uploadFormData, config);
        const newAvatarUrl = `${BASE_URL}${uploadResponse.data.avatar}`;
        setFormData((prev) => ({ ...prev, avatar: newAvatarUrl }));
        setDoctor((prev) => ({ ...prev, avatar: newAvatarUrl }));
        setAvatarFile(null); // Reset file sau khi upload
      }

      setDoctor((prev) => ({ ...prev, ...updateData }));
      setIsEditing(false);
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      toast.error(error.message || "Không thể cập nhật hồ sơ!");
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(true);
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
                <div className="flex items-center gap-4">
                  {doctor.avatar ? (
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-full object-cover"
                      onError={(e) => ((e.target as HTMLImageElement).src = "https://via.placeholder.com/100")}
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/100"
                      alt="No Avatar"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <Label>ID</Label>
                  <p className="text-gray-700">{doctor._id}</p> {/* Sửa từ doctor.id thành doctor._id */}
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
                  <Label>Ảnh đại diện</Label>
                  <div className="flex items-center gap-4 mt-1">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Avatar Preview"
                        className="w-24 h-24 rounded-full object-cover"
                        onError={(e) => ((e.target as HTMLImageElement).src = "https://via.placeholder.com/100")}
                      />
                    ) : (
                      <img
                        src="https://via.placeholder.com/100"
                        alt="No Avatar"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-1"
                    />
                  </div>
                </div>
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
                    onClick={() => setIsEditing(false)}
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