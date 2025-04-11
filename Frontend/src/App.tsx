import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AvatarProvider } from "./pages/AvatarContext";
import Index from "./pages/Index";
import News from "./pages/News";
import Auth from "./pages/Auth";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

import Introduce from "./pages/Introduce";
import Profile from "./pages/Profile";
import DoctorLogin from "./pagesDoctor/DoctorLogin";
import Doctors from "./pages/Doctors";
import DoctorDashboard from "./pagesDoctor/DoctorDashboard";
import DoctorsDetail from "./pagesDoctor/DoctorsDetail";
import AdminLogin from "./pagesAdmin/AdminLogin";
import AdminDashboard from "./pagesAdmin/AdminDashboard";
import UserManagement from "./pagesAdmin/UserManagement";
import DoctorManagement from "./pagesAdmin/DoctorManagement";
import NewsManagement from "./pagesAdmin/NewsManagement";
import SystemSettings from "./pagesAdmin/SystemSettings";
import NotFound from "./pages/NotFound";
import ChatPage from "./pages/ChatPage";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectTo = "/auth",
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AvatarProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/news" element={<News />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/introduce" element={<Introduce />} />
              <Route path="/services" element={<Services />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/doctors/:id" element={<DoctorsDetail />} />

              {/* Protected routes for authenticated users */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/chat" element={<ChatPage />} />
              </Route>

              {/* Protected routes for doctors */}
              <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              </Route>

              {/* Protected routes for admins */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/doctors" element={<DoctorManagement />} />
                <Route path="/admin/news" element={<NewsManagement />} />
                <Route path="/admin/settings" element={<SystemSettings />} />
              </Route>

              {/* Auth routes */}
              <Route path="/doctor/login" element={<DoctorLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AvatarProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;