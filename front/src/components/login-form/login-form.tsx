"use client";

import Button from "@/components/button/button";
import Input from "@/components/input/input";
import { ApiResponse } from "@/services/ApiService";
import { AuthService, LoginResponse } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const login = async (formData: FormData) => {
    setLoading(true);
    try {
      const r: ApiResponse<LoginResponse> = await AuthService.login(formData);

      if (r.statusCode >= 400) {
        toast.error(r.message);
        return;
      }

      toast.success(r.message);
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <form action={login} className="w-96 max-sm:w-full max-sm:mx-10">
        <Input name="email" placeholder="bruce@bat.cave" type="email" />
        <Input
          autoComplete="current-password"
          name="password"
          placeholder="imb@tman"
          type="password"
          label="Mot de passe"
        />
        <div className="text-center">
          <Button
            label={loading ? "Let's go..." : "Se connecter"}
            type="submit"
            disabled={loading}
          />
        </div>
      </form>
      <div className="mt-5">
        <p>Email: user0@email.com</p>
        <p>Mdp: password</p>
      </div>
      <ToastContainer />
    </div>
  );
}
