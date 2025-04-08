
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Navigation items with their routes and icons
  const navItems = [
    { name: "Đặt Lịch", path: "/appointments", icon: Calendar },
    { name: "Hỗ Trợ", path: "/chat", icon: MessageCircle },
    { name: "Hồ Sơ", path: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
          <h1 
            className="text-2xl font-bold text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Chăm Sóc Sức Khỏe
          </h1>
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className={cn(
                    "flex items-center gap-1",
                    location.pathname === item.path ? "bg-blue-600 hover:bg-blue-700" : ""
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Button>
              );
            })}
            <Button variant="outline" className="flex items-center gap-1">
              <LogOut className="h-5 w-5" />
              Đăng Xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-2 px-3 ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
