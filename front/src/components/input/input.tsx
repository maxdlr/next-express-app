import { Utils } from "@/utils";

interface InputProps {
  name: string;
  placeholder: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  name,
  placeholder = "type here",
  type = "text",
  onChange,
}: InputProps) {
  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        <span className="text-sm font-medium text-black">
          {Utils.toTitle(name)}
        </span>

        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </label>
    </div>
  );
}
