"use client";
import { useAuth } from "@/components/auth-provider";
import Loader from "@/components/loader/loader";
import LoginForm from "@/components/login-form/login-form";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  const { isAuth, loading } = useAuth();

  useEffect(() => {
    if (isAuth) {
      window.location.href = "/dashboard";
    }
  }, [isAuth]);

  if (loading) {
    return <Loader />;
  }

  if (isAuth) {
    return null;
  }
  return (
    <main className="flex flex-col justify-center items-center h-[100svh]">
      <Image
        src="/logo.svg"
        width={50}
        height={50}
        alt="Picture of the author"
      />
      <LoginForm />
    </main>
  );
}
