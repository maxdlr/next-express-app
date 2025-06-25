import { ApiService } from "./ApiService";

const login = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  return await ApiService.post("login", { email, password }, false);
};

export const AuthService = { login };
