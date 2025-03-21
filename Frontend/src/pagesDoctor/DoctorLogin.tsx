
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Mail, Lock, UserCog } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
// giao diện đăng nhập dành cho bác sĩ trong hệ thống quản lý y tế.
const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      // Chuyển hướng đến trang dashboard sau khi đăng nhập
      navigate("/doctor/dashboard");
    } catch (error) {
      // Lỗi đã được xử lý trong hook useAuth
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-hospital-50 to-white flex flex-col items-center justify-center p-4">
      <Link to="/" className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-hospital-600 transition-colors">
        <span className="font-medium">Trang chủ HealthCare</span>
      </Link>
      
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-hospital-500 flex items-center justify-center mb-2">
              <UserCog className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-semibold">Cổng Bác Sĩ</h1>
            <p className="text-gray-500 mt-1">Hệ thống quản lý dành cho bác sĩ</p>
          </div>
        </div>
        
        <Card className="w-full shadow-soft border-0">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="text-2xl font-display">Đăng nhập hệ thống</CardTitle>
              <CardDescription>
                Vui lòng đăng nhập để truy cập hệ thống quản lý lịch khám
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="doctor@healthcare.com" 
                    className="pl-10" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link to="/doctor/forgot-password" className="text-sm text-hospital-600 hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-hospital-500 hover:bg-hospital-600" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </div>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Đăng nhập
                  </>
                )}
              </Button>
              <div className="text-sm text-center text-gray-500">
                <p>Nếu bạn gặp vấn đề khi đăng nhập, vui lòng liên hệ</p>
                <a href="mailto:support@healthcare.com" className="text-hospital-600 hover:underline">
                  support@healthcare.com
                </a>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DoctorLogin;
