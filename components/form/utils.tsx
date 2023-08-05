import type { CSSProperties } from "react";
import { IoMdClose } from "react-icons/io";

import { cn } from "@/lib/utils";

export interface Option {
  name: string;
  value: string;
  disabled?: boolean;
}

/**
 * @description Gets a list of filtered options for HeadlessUI's <ComboBox />.
 * @returns An array of string.
 */
export const getFilteredOptions = (query: string, options: Option[]) => {
  return query === ""
    ? options
    : options.filter((opt) => {
        return opt.name
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.toLowerCase().replace(/\s+/g, ""));
      });
};

const BG_COLORS = [
  "bg-red-300",
  "bg-orange-300",
  "bg-green-300",
  "bg-blue-300",
  "bg-purple-300",
];

type ItemsListProps = {
  values: string[];
  onDelete: (val: string) => void;
  className?: string;
};

/**
 * @description Display a list of values which can be removed on click.
 * @returns A JSX Element.
 */
export const ItemsList = ({ values, onDelete, className }: ItemsListProps) => {
  return (
    <div className={cn("mx-2 flex flex-wrap gap-2", className)}>
      {values.map((val, idx) => (
        <button
          key={idx}
          style={
            { "--bs-offset-x": "2px", "--bs-offset-y": "2px" } as CSSProperties
          }
          type="button"
          className={cn(
            "newFocus just-black flex items-center gap-2 rounded-md border-2 px-2 py-0.5 text-sm font-medium shadow-full",
            "disabled:brightness-75 enabled:hocus:brightness-125",
            BG_COLORS[idx % BG_COLORS.length]
          )}
          onClick={() => onDelete(val)}
        >
          {val} <IoMdClose className="pointer-events-none shrink-0" />
        </button>
      ))}
    </div>
  );
};

type FormValueProps = { name: string; value: string | undefined };

/**
 * @description Gives an accessible value in a <form />'s FormData on submission.
 * @returns A hidden <input />.
 */
export const FormValue = ({ name, value }: FormValueProps) => {
  return (
    <input id={name} name={name} type="text" value={value} readOnly hidden />
  );
};
