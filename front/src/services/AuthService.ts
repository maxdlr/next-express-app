import { ApiService } from "./ApiService";

const login = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await ApiService.post("login", { email, password }, false);

  const token = response.payload?.token;

  if (token) {
    localStorage.setItem("token", token);
    ApiService.token = token;
  }

  return response;
};

export const AuthService = { login };
