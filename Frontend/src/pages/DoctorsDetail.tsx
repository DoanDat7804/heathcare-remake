import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react"; // Thêm Mail icon cho nút liên hệ
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Doctor {
  name: string;
  title: string;
  department: string;
  image: string;
  details: string;
}

const DoctorsDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor: Doctor = location.state?.doctor;

  // Danh sách bác sĩ mẫu để hiển thị trong phần "Xem thêm bác sĩ"
  const moreDoctors = [
    {
        name: "TS. Nguyễn Văn Anh",
        title: "Trưởng Khoa Nội",
        department: "Khoa Nội",
        image:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZG9jdG9yfGVufDB8fDB8fHww",
        details: "Kinh nghiệm 15 năm trong lĩnh vực nội khoa, chuyên gia về các bệnh tiêu hóa và gan mật.",
      },
      {
        name: "PGS. TS. Trần Thị Bắc",
        title: "Trưởng Khoa Nhi",
        department: "Khoa Nhi",
        image:
          "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
        details:
          "Chuyên gia về nhi khoa với hơn 20 năm kinh nghiệm, đặc biệt trong điều trị các bệnh hô hấp trẻ em.",
      },
      {
        name: "BS. CKI. Phạm Văn Cảnh",
        title: "Khoa Tim Mạch",
        department: "Khoa Tim Mạch",
        image:
          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
        details: "Chuyên gia tim mạch với 10 năm kinh nghiệm, chuyên sâu về can thiệp tim mạch.",
      },
      {
        name: "ThS. BS. Lê Thị Duyên",
        title: "Khoa Sản",
        department: "Khoa Sản",
        image:
          "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
        details: "Chuyên gia sản khoa với kinh nghiệm 12 năm, chuyên về chăm sóc sức khỏe bà bầu và sinh nở.",
      },
      {
        name: "BS. CKI. Phạm Văn Cảnh",
        title: "Khoa Tim Mạch",
        department: "Khoa Tim Mạch",
        image:
          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
        details: "Chuyên gia tim mạch với 10 năm kinh nghiệm, chuyên sâu về can thiệp tim mạch.",
      },
      {
        name: "TS. Nguyễn Văn Anh",
        title: "Trưởng Khoa Nội",
        department: "Khoa Nội",
        image:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZG9jdG9yfGVufDB8fDB8fHww",
        details: "Kinh nghiệm 15 năm trong lĩnh vực nội khoa, chuyên gia về các bệnh tiêu hóa và gan mật.",
      },
      {
        name: "PGS. TS. Trần Thị Bắc",
        title: "Trưởng Khoa Nhi",
        department: "Khoa Nhi",
        image:
          "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
        details:
          "Chuyên gia về nhi khoa với hơn 20 năm kinh nghiệm, đặc biệt trong điều trị các bệnh hô hấp trẻ em.",
      },
      {
        name: "BS. CKI. Phạm Văn Cảnh",
        title: "Khoa Tim Mạch",
        department: "Khoa Tim Mạch",
        image:
          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
        details: "Chuyên gia tim mạch với 10 năm kinh nghiệm, chuyên sâu về can thiệp tim mạch.",
      },
      {
        name: "ThS. BS. Lê Thị Duyên",
        title: "Khoa Sản",
        department: "Khoa Sản",
        image:
          "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
        details: "Chuyên gia sản khoa với kinh nghiệm 12 năm, chuyên về chăm sóc sức khỏe bà bầu và sinh nở.",
      },
      {
        name: "PGS. TS. Trần Thị Bắc",
        title: "Trưởng Khoa Nhi",
        department: "Khoa Nhi",
        image:
          "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
        details:
          "Chuyên gia về nhi khoa với hơn 20 năm kinh nghiệm, đặc biệt trong điều trị các bệnh hô hấp trẻ em.",
      },
      {
        name: "BS. CKI. Phạm Văn Cảnh",
        title: "Khoa Tim Mạch",
        department: "Khoa Tim Mạch",
        image:
          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
        details: "Chuyên gia tim mạch với 10 năm kinh nghiệm, chuyên sâu về can thiệp tim mạch.",
      },
      {
        name: "ThS. BS. Lê Thị Duyên",
        title: "Khoa Sản",
        department: "Khoa Sản",
        image:
          "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
        details: "Chuyên gia sản khoa với kinh nghiệm 12 năm, chuyên về chăm sóc sức khỏe bà bầu và sinh nở.",
      },
  ];

  // Nếu không có dữ liệu doctor được truyền qua, hiển thị thông báo
  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-hospital-700 mb-4">Không tìm thấy thông tin bác sĩ</h2>
            <Button
              variant="outline"
              className="border-hospital-500 text-hospital-500 hover:bg-hospital-50"
              onClick={() => navigate("/doctors")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách bác sĩ
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Hàm xử lý khi nhấn "Xem thêm bác sĩ"
  const handleViewMoreDoctors = (selectedDoctor: Doctor) => {
    navigate("/doctors/detail", { state: { doctor: selectedDoctor } });
  };

  // Hàm xử lý liên hệ với bác sĩ (giả định mở email hoặc form)
  const handleContactDoctor = () => {
    // Thay thế bằng logic thực tế, ví dụ: mở email hoặc form liên hệ
    window.location.href = `mailto:doctor@example.com?subject=Liên hệ với ${doctor.name}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-grow section-container bg-hospital-60 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-soft p-8 animate-fade-in">
          <Button
            variant="outline"
            className="mb-6 border-hospital-500 text-hospital-500 hover:bg-hospital-50"
            onClick={() => navigate("/doctors")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>

          <div className="flex flex-col items-center gap-6">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-48 h-48 rounded-full object-cover shadow-md"
            />
            <h1 className="text-3xl font-bold text-hospital-700">{doctor.name}</h1>
            <p className="text-hospital-500 font-medium text-lg">{doctor.title}</p>
            <p className="text-gray-600 font-medium">{doctor.department}</p>
            <div className="text-gray-700 text-center leading-relaxed">
              {doctor.details || "Chưa có thông tin chi tiết."}
            </div>

            {/* Nút Liên hệ với bác sĩ */}
            <Button
              variant="default"
              className="mt-4 bg-hospital-500 text-white hover:bg-hospital-600"
              onClick={handleContactDoctor}
            >
              <Mail className="mr-2 h-4 w-4" />
              Liên hệ với bác sĩ
            </Button>
          </div>

          {/* Phần Xem thêm bác sĩ */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-hospital-700 mb-6 text-center">Xem thêm bác sĩ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {moreDoctors
                .filter((d) => d.name !== doctor.name) // Loại bỏ bác sĩ hiện tại
                .slice(0, 3) // Giới hạn 3 bác sĩ
                .map((moreDoctor, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 p-4 bg-hospital-50 rounded-lg hover:bg-hospital-100 transition"
                  >
                    <img
                      src={moreDoctor.image}
                      alt={moreDoctor.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <p className="text-hospital-700 font-semibold">{moreDoctor.name}</p>
                    <p className="text-gray-600 text-sm">{moreDoctor.title}</p>
                    <Button
                      variant="outline"
                      className="text-hospital-500 border-hospital-500 hover:bg-hospital-50"
                      onClick={() => handleViewMoreDoctors(moreDoctor)}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default DoctorsDetail;