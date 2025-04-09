import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { authApi } from '@/apis/authApi';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<User>; // Trả về User
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token') || localStorage.getItem('adminToken');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, isAdmin: boolean = false): Promise<User> => {
    try {
      setIsLoading(true);
      const response = await (isAdmin ? authApi.adminLogin(email, password) : authApi.login(email, password));
      console.log("Login response:", response);

      if (!response.access_token) {
        throw new Error("Không nhận được access token từ server");
      }

      const decodedToken: any = jwtDecode(response.access_token);
      const token = response.access_token;

      const formattedUser: User = {
        id: decodedToken.sub,
        name: decodedToken.name || (isAdmin ? "Admin" : "Doctor"),
        email: decodedToken.email,
        role: decodedToken.role || "patient",
        phone: decodedToken.phone || "",
      };

      setUser(formattedUser);
      localStorage.setItem('user', JSON.stringify(formattedUser));
      localStorage.setItem(isAdmin ? 'adminToken' : 'token', token);

      toast.success("Đăng nhập thành công!");
      return formattedUser; // Trả về user vừa tạo
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Đăng nhập thất bại: " + (error.message || "Lỗi không xác định"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      await authApi.register(userData);
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
    } catch (error: any) {
      toast.error("Đăng ký thất bại: " + (error.message || "Lỗi không xác định"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    toast.info("Đã đăng xuất khỏi hệ thống");
    window.location.href = '/auth';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};