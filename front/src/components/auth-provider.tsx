"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ApiService } from "@/services/ApiService";

interface AuthContextType {
  isAuth: boolean;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  loading: true,
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuth, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = ApiService.getToken();
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    ApiService.removeToken();
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ isAuth, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuth, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuth) {
      window.location.href = "/";
    }
  }, [isAuth, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return null;
  }

  return <>{children}</>;
}
