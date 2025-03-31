import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Định nghĩa interface cho DoctorItem (tái sử dụng từ Doctors.tsx)
interface DoctorItem {
  name: string;
  title: string;
  image: string;
}

// Dữ liệu mẫu cho preview (chọn 3 bác sĩ nổi bật)
const previewDoctors: DoctorItem[] = [
  {
    name: "TS. Nguyễn Văn Anh",
    title: "Trưởng Khoa Nội",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZG9jdG9yfGVufDB8fDB8fHww",
  },
  {
    name: "PGS. TS. Trần Thị Bắc",
    title: "Trưởng Khoa Nhi",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    name: "BS. CKI. Phạm Văn Cảnh",
    title: "Khoa Tim Mạch",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
  },
];

// Component DoctorCard đơn giản hóa cho Preview
const DoctorCardPreview = ({
  name,
  title,
  image,
}: {
  name: string;
  title: string;
  image: string;
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-soft transition-transform hover:-translate-y-1 hover:shadow-md flex flex-col items-center">
      <img
        src={image}
        alt={name}
        className="w-32 h-32 rounded-full object-cover mb-3"
      />
      <h3 className="text-lg font-semibold text-gray-900 text-center">{name}</h3>
      <p className="text-gray-600 text-sm text-center">{title}</p>
    </div>
  );
};

const DoctorsPreview = () => {
  return (
    <section className="container mx-auto px-4 py-10">
      {/* Tiêu đề phần */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Đội Ngũ Bác Sĩ
        </h2>
        <p className="text-gray-600">
          Gặp gỡ đội ngũ bác sĩ giàu kinh nghiệm của chúng tôi.
        </p>
      </div>

      {/* Danh sách bác sĩ rút gọn */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {previewDoctors.map((doctor, index) => (
          <DoctorCardPreview
            key={index}
            name={doctor.name}
            title={doctor.title}
            image={doctor.image}
          />
        ))}
      </div>

      {/* Nút dẫn đến trang Doctors chi tiết */}
      <div className="mt-8 text-center">
        <Link to="/doctors">
          <Button className="bg-hospital-500 hover:bg-hospital-600 text-white">
            Xem Tất Cả Bác Sĩ
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default DoctorsPreview;