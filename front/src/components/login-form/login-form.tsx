"use client";

import Button from "@/components/button/button";
import Input from "@/components/input/input";
import { ApiResponse } from "@/services/ApiService";
import { AuthService } from "@/services/AuthService";
import { redirect } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

export default function LoginForm() {
  const pending = false;

  const login = async (formData: FormData) => {
    const r: ApiResponse = await AuthService.login(formData);
    if (r.statusCode < 400) {
      toast.success(r.message);
      redirect("/dashboard");
    } else {
      toast.error(r.message);
    }
  };
  return (
    <div>
      <form action={login} className="w-96">
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
