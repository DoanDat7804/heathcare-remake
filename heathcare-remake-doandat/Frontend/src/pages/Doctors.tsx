import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { ArrowLeft, Search, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DoctorCard = ({
  name,
  title,
  image,
  delay = "",
  onViewDetails,
}: {
  name: string;
  title: string;
  image: string;
  delay?: string;
  onViewDetails: () => void;
}) => {
  return (
    <div className={`group relative flex flex-col items-center gap-4 ${delay}`}>
      <div className="w-40 h-48 flex-shrink-0 overflow-hidden rounded-2xl shadow-soft">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="absolute left-60 top-0 h-48 w-0 group-hover:w-64 bg-hospital-500/90 text-white rounded-r-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out flex items-center z-10">
        <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-gray-200 mb-4">{title}</p>
          <Button
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            onClick={onViewDetails}
          >
            Xem Thông Tin
          </Button>
        </div>
      </div>
    </div>
  );
};

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const navigate = useNavigate(); // Thêm hook useNavigate

  const doctors = [
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

  const departments = ["all", ...new Set(doctors.map((doctor) => doctor.department))];

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = doctor.name.toLowerCase();
    const title = doctor.title.toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = fullName.includes(search) || title.includes(search);
    const matchesDepartment = selectedDepartment === "all" || doctor.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleViewDetails = (doctor) => {
    navigate("/doctors/detail", { state: { doctor } }); // Điều hướng sang trang chi tiết
  };

  return (
    <>
      <Navbar />
      <section
        id="doctors"
        className="section-container bg-hospital-60 py-16 flex flex-col items-center min-h-screen relative"
      >
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <span className="inline-block px-4 py-1 rounded-full bg-hospital-100 text-hospital-700 font-medium text-sm mb-4">
            Đội Ngũ Y Bác Sĩ
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Đội Ngũ Chuyên Gia</h2>
          <p className="text-gray-600 mb-6">
            Đội ngũ y bác sĩ giàu kinh nghiệm và chuyên môn cao, luôn tận tâm chăm sóc sức khỏe cho bệnh nhân.
          </p>

          {/* Ô tìm kiếm */}
          <div className="flex justify-center items-center max-w-md mx-auto mb-6">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Tìm kiếm bác sĩ theo tên, họ, hoặc khoa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border-hospital-300 focus:border-hospital-500 focus:ring-hospital-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Bộ lọc theo khoa */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {departments.map((dept) => (
              <Button
                key={dept}
                variant={selectedDepartment === dept ? "default" : "outline"}
                className={`rounded-full ${
                  selectedDepartment === dept ? "bg-hospital-500 text-white" : "text-hospital-500 border-hospital-500"
                }`}
                onClick={() => setSelectedDepartment(dept)}
              >
                {dept === "all" ? "Tất cả" : dept}
              </Button>
            ))}
          </div>
        </div>

        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor, index) => (
                <DoctorCard
                  key={index}
                  name={doctor.name}
                  title={doctor.title}
                  image={doctor.image}
                  delay={`animate-fade-in animate-delay-${Math.min(index * 100, 500)}`}
                  onViewDetails={() => handleViewDetails(doctor)}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">Không tìm thấy bác sĩ nào phù hợp.</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Doctors;