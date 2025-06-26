import { Utils } from "@/utils";
import { ReactNode } from "react";

interface ButtonProps {
  child?: ReactNode;
  label?: string;
  type?: "submit" | "reset" | "button";
  colors?: string;
  id: string;
}

export default function Button({
  child,
  label,
  colors,
  onClick,
  id,
  type = "submit",
}: ButtonProps) {
  return (
    <button
      id={id}
      onClick={onClick}
      itemType="{type}"
      className={`px-9 py-2 ${colors || "bg-black text-white hover:bg-blue-600 active:bg-gray-200 active:text-black"} rounded-full hover:cursor-pointer active:scale-95 transition-all`}
    >
      {label ? Utils.toTitle(label) : child}
    </button>
  );
}
