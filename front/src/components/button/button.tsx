import { Utils } from "@/utils";

interface ButtonProps {
  label: string;
  type?: "submit" | "reset" | "button";
}

export default function Button({ label, type = "submit" }: ButtonProps) {
  return (
    <button
      itemType="{type}"
      className="px-9 py-2 bg-black rounded-full text-white hover:bg-blue-600 hover:cursor-pointer active:bg-gray-200 active:text-black"
    >
      {Utils.toTitle(label)}
    </button>
  );
}
