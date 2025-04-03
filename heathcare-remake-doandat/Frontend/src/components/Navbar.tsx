import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar, Menu, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Thêm useLocation
import { useAvatar } from "@/pages/AvatarContext";
import Notification from "@/pages/Notification";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { avatar } = useAvatar();
  const location = useLocation(); 

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hàm kiểm tra xem đường dẫn có khớp với trang hiện tại không
  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white/80 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-hospital-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <h1 className="text-xl font-display font-semibold text-gray-800">HealthCare</h1>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            <Link
              to="/"
              className={cn(
                "font-medium text-gray-700 hover:text-hospital-600 link-underline relative",
                isActive("/") && "text-hospital-600 after:w-full after:bg-hospital-600"
              )}
            >
              Trang chủ
            </Link>
            <Link
              to="/services"
              className={cn(
                "font-medium text-gray-700 hover:text-hospital-600 link-underline relative",
                isActive("/services") && "text-hospital-600 after:w-full after:bg-hospital-600"
              )}
            >
              Dịch vụ
            </Link>
            <Link
              to="/doctors"
              className={cn(
                "font-medium text-gray-700 hover:text-hospital-600 link-underline relative",
                isActive("/doctors") && "text-hospital-600 after:w-full after:bg-hospital-600"
              )}
            >
              Bác sĩ
            </Link>
            <Link
              to="/news"
              className={cn(
                "font-medium text-gray-700 hover:text-hospital-600 link-underline relative",
                isActive("/news") && "text-hospital-600 after:w-full after:bg-hospital-600"
              )}
            >
              Tin tức
            </Link>
            <Link
              to="/introduce"
              className={cn(
                "font-medium text-gray-700 hover:text-hospital-600 link-underline relative",
                isActive("/introduce") && "text-hospital-600 after:w-full after:bg-hospital-600"
              )}
            >
              Giới thiệu
            </Link>
            <Link
              to="/contact"
              className={cn(
                "font-medium text-gray-700 hover:text-hospital-600 link-underline relative",
                isActive("/contact") && "text-hospital-600 after:w-full after:bg-hospital-600"
              )}
            >
              Liên Hệ
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="outline" size="sm" className="border-hospital-200 text-hospital-600 hover:bg-hospital-50">
                <LogIn className="mr-2 h-4 w-4" />
                Đăng nhập
              </Button>
            </Link>
            <Link to="/booking">
              <Button className="bg-hospital-500 hover:bg-hospital-600 text-white rounded-full" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Đặt lịch khám
              </Button>
            </Link>
            <Link to="/profile">
              <Button className="bg-hospital-500 hover:bg-hospital-600 text-white rounded-full flex items-center gap-2" size="sm">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-300" />
                )}
                Trang Cá Nhân
              </Button>
            </Link>
            <Notification />
          </div>

          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-soft animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className={cn(
                  "font-medium text-gray-700 hover:text-hospital-600 py-2 px-4 rounded-md hover:bg-gray-100",
                  isActive("/") && "text-hospital-600 bg-hospital-50"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                to="/services"
                className={cn(
                  "font-medium text-gray-700 hover:text-hospital-600 py-2 px-4 rounded-md hover:bg-gray-100",
                  isActive("/services") && "text-hospital-600 bg-hospital-50"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Dịch vụ
              </Link>
              <Link
                to="/doctors"
                className={cn(
                  "font-medium text-gray-700 hover:text-hospital-600 py-2 px-4 rounded-md hover:bg-gray-100",
                  isActive("/doctors") && "text-hospital-600 bg-hospital-50"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Bác sĩ
              </Link>
              <Link
                to="/news"
                className={cn(
                  "font-medium text-gray-700 hover:text-hospital-600 py-2 px-4 rounded-md hover:bg-gray-100",
                  isActive("/news") && "text-hospital-600 bg-hospital-50"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Tin tức
              </Link>
              <Link
                to="/introduce"
                className={cn(
                  "font-medium text-gray-700 hover:text-hospital-600 py-2 px-4 rounded-md hover:bg-gray-100",
                  isActive("/introduce") && "text-hospital-600 bg-hospital-50"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Giới thiệu
              </Link>
              <Link
                to="/contact"
                className={cn(
                  "font-medium text-gray-700 hover:text-hospital-600 py-2 px-4 rounded-md hover:bg-gray-100",
                  isActive("/contact") && "text-hospital-600 bg-hospital-50"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Liên Hệ
              </Link>
              <div className="pt-2 flex flex-col gap-2">
                <Link to="/auth" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-hospital-200 text-hospital-600 hover:bg-hospital-50">
                    <LogIn className="mr-2 h-4 w-4" />
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/booking" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Button className="bg-hospital-500 hover:bg-hospital-600 text-white w-full" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Đặt lịch khám
                  </Button>
                </Link>
                <Link to="/profile" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Button className="bg-hospital-500 hover:bg-hospital-600 text-white w-full flex items-center gap-2" size="sm">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-300" />
                    )}
                    Trang Cá Nhân
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;