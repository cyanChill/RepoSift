import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
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

      <Listbox.Label className="form-label">{label}</Listbox.Label>
      <Listbox.Button className="form-input flex w-full items-center justify-between gap-2 text-start">
        {selectedOpt.name}
        <FaChevronDown />
      </Listbox.Button>

      <div className="w-full">
        <Transition
          as={Fragment}
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute bottom-0 left-0 z-10 max-h-40 w-full translate-y-full overflow-auto border-2 border-black bg-white">
            {options.map((opt) => (
              <Listbox.Option
                as={Fragment}
                key={opt.name}
                value={opt}
                disabled={opt.disabled}
              >
                {({ active, selected, disabled }) => (
                  <li
                    className={cn("cursor-default px-2 py-1", {
                      "bg-indigo-600 text-white": active,
                      "font-medium": selected,
                      "text-gray-300": disabled,
                    })}
                  >
                    {opt.name}
                  </li>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
