import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { authApi } from '@/apis/authApi';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string; // Thay number bằng string vì sub là chuỗi
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
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
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(email, password);
      
      if (!response.access_token) {
        throw new Error("Không nhận được access token từ server");
      }

      // Giải mã token để lấy thông tin user
      const decodedToken: any = jwtDecode(response.access_token);
      const formattedUser: User = {
        id: decodedToken.sub || "", // "sub" là ID trong JWT
        name: decodedToken.name || "Unknown", // Nếu không có name thì dùng mặc định
        email: decodedToken.email || email, // Dùng email từ input nếu cần
        role: decodedToken.role || "patient",
      };

      setUser(formattedUser);
      localStorage.setItem('user', JSON.stringify(formattedUser));
      localStorage.setItem('token', response.access_token);
      toast.success("Đăng nhập thành công!");
    } catch (error: any) {
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
    toast.info("Đã đăng xuất khỏi hệ thống");
    window.location.href = '/admin/login';
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        register, 
        logout,
        isAuthenticated: !!user
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