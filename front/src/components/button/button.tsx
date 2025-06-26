import { Utils } from "@/utils";
import { ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
  children?: ReactNode;
  label?: string;
  type?: "submit" | "reset" | "button";
  colors?: string;
  id?: string;
  disabled: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({
  children,
  label,
  colors,
  onClick,
  id,
  disabled,
  type = "submit",
}: ButtonProps) {
  return (
    <button
      id={id}
      onClick={onClick}
      type={type}
      className={`px-9 py-2 ${
        colors ||
        "bg-black text-white hover:bg-[#7700ff] active:bg-gray-200 active:text-black"
      } rounded-full hover:cursor-pointer active:scale-95 transition-all`}
      disabled={disabled}
    >
      {label ? Utils.toTitle(label) : children}
    </button>
  );
}
