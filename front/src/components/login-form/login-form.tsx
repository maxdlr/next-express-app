"use client";

import Button from "@/components/button/button";
import Input from "@/components/input/input";
import { ApiResponse } from "@/services/ApiService";
import { AuthService, LoginResponse } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

export default function LoginForm() {
  const router = useRouter();
  const pending = false;

  const login = async (formData: FormData) => {
    try {
      const r: ApiResponse<LoginResponse> = await AuthService.login(formData);
      if (r.statusCode < 400) {
        toast.success(r.message);
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      } else {
        toast.error(r.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="w-full flex justify-center items-center">
      <form action={login} className="w-96 max-sm:w-full max-sm:mx-10">
        <Input name="email" placeholder="bruce@bat.cave" type="email" />
        <Input name="password" placeholder="imb@tman" type="password" />
        <div className="text-center">
          <Button
            label={pending ? "Logging in..." : "login"}
            type="submit"
            disabled={pending}
          />
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
