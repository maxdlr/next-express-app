import { ApiService, User } from "./ApiService";

export interface LoginResponse {
  token: string;
  user: User;
}

const login = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await ApiService.post("login", { email, password }, false);

  const token = response.payload?.token;
  const user = response.payload?.user;

  if (token && user) {
    ApiService.setToken(token);
    ApiService.setUser(user);
  }

  return response;
};

const logout = () => {
  ApiService.removeToken();
  ApiService.removeUser();
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

const isLoggedIn = (): boolean => {
  return ApiService.isAuthenticated();
};

const getCurrentUser = (): User | null => {
  return ApiService.getUser();
};

export const AuthService = {
  login,
  logout,
  isLoggedIn,
  getCurrentUser,
};
