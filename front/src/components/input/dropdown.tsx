import { Utils } from "@/utils";

interface MultiSelectDropdownProps<T> {
  name: string;
  placeholder?: string;
  options: T[];
  displayKey: keyof T;
  valueKey: keyof T;
  value?: T[keyof T][];
  onChange?: (values: T[keyof T][]) => void;
}

export default function MultiSelectDropdown<T>({
  name,
  placeholder = "Select options",
  options,
  displayKey,
  valueKey,
  value = [],
  onChange,
}: MultiSelectDropdownProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedValues = selectedOptions
      .map((option) => {
        const optionValue = option.value;
        const selectedOption = options.find(
          (opt) => String(opt[valueKey]) === optionValue,
        );
        return selectedOption ? selectedOption[valueKey] : null;
      })
      .filter((val) => val !== null) as T[keyof T][];

    if (onChange) {
      onChange(selectedValues);
    }
  };

  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        <span className="text-sm font-medium text-black">
          {Utils.toTitle(name)}
        </span>
        <select
          id={name}
          name={name}
          multiple
          value={value?.map((v) => String(v)) || []}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 min-h-[100px]"
        >
          {options.map((option, index) => (
            <option key={index} value={String(option[valueKey])}>
              {String(option[displayKey])}
            </option>
          ))}
        </select>
      </label>
      {value && value.length > 0 && (
        <div className="mt-2">
          <span className="text-xs text-gray-600">
            Selectionné{value.length !== 1 ? "s" : ""}: {value.length} fond
            {value.length !== 1 ? "s" : ""} d'investissement
          </span>
        </div>
      )}
    </div>
  );
}
