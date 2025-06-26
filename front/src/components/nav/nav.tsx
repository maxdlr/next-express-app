"use client";
import { AuthService } from "@/services/AuthService";
import Image from "next/image";
import Button from "../button/button";
import { redirect } from "next/navigation";
export default function Nav() {
  return (
    <nav className="flex justify-between items-center my-5">
      <div className="flex">
        <div onClick={() => redirect("/")}>
          <Image
            src="/logo.svg"
            width={50}
            height={50}
            alt="Picture of the author"
            className="cursor-pointer hover:rotate-20 transition-all active:scale-90"
          />
        </div>
      </div>

      <Button
        label="deconnexion"
        onClick={AuthService.logout}
        colors="bg-red-400 text-white hover:bg-red-700 active:bg-red-200 active:text-black"
      />
    </nav>
  );
}
