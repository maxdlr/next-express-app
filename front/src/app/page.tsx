import LoginForm from "@/components/login-form/login-form";
import Image from "next/image";

export default function Home() {
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
