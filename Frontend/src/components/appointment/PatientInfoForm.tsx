import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface PatientInfo {
  name: string;
  phone: string;
  email: string;
  service: string;
  note: string;
}

interface PatientInfoFormProps {
  onSubmit: (data: PatientInfo) => void;
  initialData: PatientInfo;
}

const PatientInfoForm = ({ onSubmit, initialData }: PatientInfoFormProps) => {
  const [formData, setFormData] = useState<PatientInfo>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleServiceChange = (value: string) => {
    setFormData({ ...formData, service: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Họ và tên</Label>
          <Input
            id="name"
            placeholder="Nhập họ và tên"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            placeholder="Nhập số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Nhập email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="service">Dịch vụ khám</Label>
        <Select value={formData.service} onValueChange={handleServiceChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Chọn dịch vụ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">Khám tổng quát (Đánh giá tình trạng sức khỏe chung)</SelectItem>
            <SelectItem value="internal">Khám nội khoa (Vấn đề về các cơ quan bên trong cơ thể)</SelectItem>
            <SelectItem value="pediatric">Khám nhi (Khám sức khỏe dành cho trẻ em)</SelectItem>
            <SelectItem value="gynecology">Khám sản phụ khoa (Khám sức khỏe liên quan đến hệ sinh sản của phụ nữ)</SelectItem>
            <SelectItem value="cardiology">Khám tim mạch (Kiểm tra sức khỏe của hệ tim mạch)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="note">Ghi chú</Label>
        <textarea
          id="note"
          className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Nhập triệu chứng, yêu cầu đặc biệt (nếu có)"
          value={formData.note}
          onChange={handleChange}
        ></textarea>
      </div>
      <Button type="submit" className="w-full bg-hospital-500 hover:bg-hospital-600 text-white">
        <Calendar className="mr-2 h-4 w-4" />
        Tiếp tục
      </Button>
    </form>
  );
};

export default PatientInfoForm;