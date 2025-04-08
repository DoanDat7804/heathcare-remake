import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NavbarPreLogin = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-hospital-700">HealthCare</span>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-hospital-600 transition-colors">
            Trang chủ
          </Link>
          <Link to="/services" className="text-gray-600 hover:text-hospital-600 transition-colors">
            Dịch vụ
          </Link>
          <Link to="/doctors" className="text-gray-600 hover:text-hospital-600 transition-colors">
            Bác sĩ
          </Link>
          <Link to="/news" className="text-gray-600 hover:text-hospital-600 transition-colors">
            Tin tức
          </Link>
        </div>

        {/* Nút đăng nhập */}
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="outline"
            className="text-hospital-600 border-hospital-200 hover:bg-hospital-50"
          >
            <Link to="/auth">Đăng nhập</Link>
          </Button>
          <Button asChild className="bg-hospital-600 hover:bg-hospital-700">
            <Link to="/patient/register">Đăng ký</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarPreLogin;