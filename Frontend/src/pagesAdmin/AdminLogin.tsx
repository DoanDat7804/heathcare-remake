
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Mail, Lock, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
//Admin
const AdminLogin = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Giả lập đăng nhập thành công
    setTimeout(() => {
      setLoading(false);
      toast.success("Đăng nhập thành công! Chuyển hướng đến trang quản trị...");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <Link to="/" className="absolute top-6 left-6 flex items-center text-gray-300 hover:text-white transition-colors">
        <span className="font-medium">Trang chủ HealthCare</span>
      </Link>
      
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-hospital-500 flex items-center justify-center mb-2">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-semibold text-white">Hệ Thống Quản Trị</h1>
            <p className="text-gray-400 mt-1">Truy cập quản lý toàn bộ hệ thống</p>
          </div>
        </div>
        
        <Card className="w-full shadow-soft border-0 bg-gray-800 text-white">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="text-2xl font-display">Đăng nhập Admin</CardTitle>
              <CardDescription className="text-gray-400">
                Vui lòng đăng nhập để truy cập hệ thống quản trị
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@healthcare.com" 
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300">Mật khẩu</Label>
                  <Link to="/admin/forgot-password" className="text-sm text-hospital-400 hover:text-hospital-300">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                    required 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-hospital-500 hover:bg-hospital-600" disabled={loading}>
                {loading ? (
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
              <div className="text-sm text-center text-gray-400">
                <p>Chỉ dành cho quản trị viên được ủy quyền</p>
                <p className="mt-1">Truy cập trái phép sẽ bị xử lý theo quy định</p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
