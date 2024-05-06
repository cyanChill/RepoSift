import { useState } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa6";

import { FormValue, type Option } from "./utils";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  description?: JSX.Element;
  className?: string;
}

export const Input = ({
  name,
  label,
  description,
  className,
  ...rest
}: InputProps) => {
  return (
    <div className="mb-4 flex flex-col">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={cn("form-input", className)}
        {...rest}
      />
      {description && <p className="mt-2 text-xs sm:text-sm">{description}</p>}
    </div>
  );
};

type SelectProps = {
  name: string;
  label: string;
  options: Option[];
  initialValue?: Option;
  flow?: boolean;
};

export const Select = ({
  name,
  label,
  options,
  initialValue,
  flow = true,
}: SelectProps) => {
  const [selectedOpt, setSelectedOpt] = useState<Option>(
    initialValue ?? options[0],
  );

  return (
    <Listbox
      as="div"
      className={cn("relative mb-4 w-full", { "max-w-max": !flow })}
      value={selectedOpt}
      onChange={setSelectedOpt}
    >
      <FormValue name={name} value={selectedOpt.value} />

      <Label className="form-label">{label}</Label>
      <ListboxButton className="form-input flex w-full items-center justify-between gap-2 text-start">
        {selectedOpt.name}
        <FaChevronDown />
      </ListboxButton>

      <div className="w-full">
        <Transition
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="absolute bottom-0 left-0 z-10 max-h-40 w-full translate-y-full overflow-auto border-2 border-black bg-white">
            {options.map((opt) => (
              <ListboxOption
                key={opt.name}
                value={opt}
                disabled={opt.disabled}
                className={cn(
                  "cursor-default px-2 py-1",
                  "data-[focus]:bg-indigo-600 data-[focus]:text-white",
                  "data-[selected]:font-medium",
                  "data-[disabled]:text-gray-300",
                )}
              >
                {opt.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
};
