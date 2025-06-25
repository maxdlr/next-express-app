import { ApiService } from "./ApiService";

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

const login = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await ApiService.post("login", { email, password }, false);

  const token = response.payload?.token;

  if (token) {
    ApiService.setToken(token);
  }

  return response;
};

const logout = () => {
  ApiService.removeToken();
  // Force redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

const isLoggedIn = (): boolean => {
  return ApiService.isAuthenticated();
};

export const AuthService = {
  login,
  logout,
  isLoggedIn,
};
