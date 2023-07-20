import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa6";

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  className?: string;
}

export const Input = ({ name, label, className, ...rest }: InputProps) => {
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
    </div>
  );
};

interface Option {
  name: string;
  value: string;
  disabled?: boolean;
}

type SelectProps = {
  name: string;
  label: string;
  options: Option[];
  className?: string;
};

export const Select = ({ name, label, options, className }: SelectProps) => {
  const [selectedOpt, setSelectedOpt] = useState<Option>(options[0]);

  return (
    <>
      <Listbox
        as="div"
        className="relative mb-4 w-full max-w-max"
        value={selectedOpt}
        onChange={setSelectedOpt}
      >
        <input
          id={name}
          name={name}
          type="text"
          value={selectedOpt.value}
          readOnly
          hidden
        />
        <Listbox.Label className="form-label">{label}</Listbox.Label>
        <Listbox.Button
          className={cn(
            "form-input flex w-full items-center justify-between gap-2 text-start",
            className
          )}
        >
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
            <Listbox.Options className="absolute bottom-0 left-0 max-h-56 w-full translate-y-full overflow-auto border-2 border-black bg-white">
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
    </>
  );
};
