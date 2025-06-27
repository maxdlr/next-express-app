"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ApiService, User } from "@/services/ApiService";
import Loader from "./loader/loader";

interface AuthContextType {
  user: User | undefined;
  isAuth: boolean;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  loading: true,
  logout: () => {},
  user: undefined,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuth, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = ApiService.getToken();
      const userData = ApiService.getUser();

      const authenticated = !!token;
      setIsAuthenticated(authenticated);
      setUser(userData || undefined);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    ApiService.removeToken();
    ApiService.removeUser();
    setIsAuthenticated(false);
    setUser(undefined);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isAuth, loading, logout }}>
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
    return <Loader />;
  }

  if (!isAuth) {
    return null;
  }

  return <>{children}</>;
}
