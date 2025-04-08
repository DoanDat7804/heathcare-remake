import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AvatarProvider } from "./pages/AvatarContext"; 
import Index from "./pages/Index";
import PatientPreLogin from "./components/Preview/PatientPreLogin"; // Thêm trang mới
import News from "./pages/News";
import Auth from "./pages/Auth";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking"; 
import Introduce from "./pages/Introduce";
import Profile from "./pages/Profile";
import DoctorLogin from "./pagesDoctor/DoctorLogin";
import Doctors from "./pages/Doctors";
import DoctorsPreview from "./components/Preview/DoctorsPreview";
import DoctorDashboard from "./pagesDoctor/DoctorDashboard"; 
import DoctorAppointmentDetail from "./pagesDoctor/DoctorAppointmentDetail"; 
import DoctorProfile from "./pagesDoctor/DoctorProfile";
import DoctorsDetail from "./pages/DoctorsDetail";
import AdminLogin from "./pagesAdmin/AdminLogin";
import AdminDashboard from "./pagesAdmin/AdminDashboard";
import UserManagement from "./pagesAdmin/UserManagement"; 
import DoctorManagement from "./pagesAdmin/DoctorManagement"; 
import NewsManagement from "./pagesAdmin/NewsManagement"; 
import SystemSettings from "./pagesAdmin/SystemSettings"; 
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AvatarProvider> 
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<PatientPreLogin />} /> 
              <Route path="/index" element={<Index />} />
              <Route path="/news" element={<News />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/introduce" element={<Introduce />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/services" element={<Services />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/doctorspreview" element={<DoctorsPreview />} />
              <Route path="/doctor/login" element={<DoctorLogin />} />
              <Route path="/doctors/detail" element={<DoctorsDetail />} />
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/appointment-detail" element={<DoctorAppointmentDetail />} />
              <Route path="/doctor/profile" element={<DoctorProfile />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/userManagement" element={<UserManagement />} />
              <Route path="/doctorManagement" element={<DoctorManagement />} />
              <Route path="/newsManagement" element={<NewsManagement />} />
              <Route path="/systemSettings" element={<SystemSettings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AvatarProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;