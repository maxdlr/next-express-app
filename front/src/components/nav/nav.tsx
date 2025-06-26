"use client";
import { AuthService } from "@/services/AuthService";
import Image from "next/image";
import Button from "../button/button";
export default function Nav() {
  return (
    <nav className="flex justify-between items-center my-5">
      <Image
        src="/logo.svg"
        width={50}
        height={50}
        alt="Picture of the author"
        className="cursor-pointer hover:rotate-20 transition-all active:scale-90"
      />
      <Button
        label="deconnexion"
        onClick={AuthService.logout}
        colors="bg-red-400 text-white hover:bg-red-700 active:bg-red-200 active:text-black"
      />
    </nav>
  );
}
