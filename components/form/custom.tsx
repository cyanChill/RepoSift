import { useState, useRef, type CSSProperties } from "react";
import { IoMdClose } from "react-icons/io";

import { useFormReset } from "@/hooks/useFormReset";
import { cn } from "@/lib/utils";

type MMRProps = {
  name: string;
  label: string;
  className?: string;
};

/** Form field names will be `min${name}` & `min${name}` */
export const MinMaxRange = ({ name, label, className }: MMRProps) => {
  return (
    <fieldset className="mb-4 flex flex-col">
      <legend className="form-label">{label}</legend>

      <div className="flex items-center gap-4">
        <label htmlFor={`min${name}`} className="sr-only">
          min{label}
        </label>
        <input
          id={`min${name}`}
          name={`min${name}`}
          type="number"
          min={0}
          step={1}
          className={cn("form-input w-full max-w-[6rem]", className)}
        />

        <span className="block h-1.5 w-4 bg-black" />

        <label htmlFor={`max${name}`} className="sr-only">
          max{label}
        </label>
        <input
          id={`max${name}`}
          name={`max${name}`}
          type="number"
          min={0}
          step={1}
          className={cn("form-input w-full max-w-[6rem]", className)}
        />
      </div>
    </fieldset>
  );
};

type MultiTextProps = {
  name: string;
  label: string;
  /** A positive integer. */
  max: number;
  className?: string;
};

const BG_COLORS = [
  "bg-red-300",
  "bg-orange-300",
  "bg-green-300",
  "bg-blue-300",
  "bg-purple-300",
];

export const MultiText = ({ name, label, max, className }: MultiTextProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [vals, setVals] = useState<string[]>([]);
  useFormReset(() => setVals([]), "simple-search-form");

  const onAdd = () => {
    if (!inputRef.current) return;
    if (vals.length >= max) {
      console.log("[MultiText] Max number of values reached.");
      return;
    }
    const newVal = inputRef.current.value.trim();
    if (newVal.length > 0) setVals((prev) => [...new Set([...prev, newVal])]);
    inputRef.current.value = "";
  };

  const removeSelf = (self: string) => {
    setVals((prev) => prev.filter((val) => val !== self));
  };

  return (
    <div className="mb-4 flex flex-col">
      <label htmlFor={name} className={cn("form-label", className)}>
        {label} {max && <span className="ml-2 font-normal">(max {max})</span>}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={JSON.stringify(vals)}
        readOnly
        hidden
      />

      <div className="mb-2 flex h-9 items-center md:h-10">
        <input
          type="text"
          maxLength={20}
          className="form-input w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          ref={inputRef}
        />
        <button
          type="button"
          className="form-input aspect-square h-full border-l-0 bg-yellow-400 font-semibold transition duration-300 enabled:hocus:bg-yellow-300"
          onClick={onAdd}
        >
          +
        </button>
      </div>

      {/* List of inputted items */}
      <div className="mx-2 flex flex-wrap gap-2">
        {vals.map((val, idx) => (
          <button
            key={idx}
            style={
              {
                "--bs-offset-x": "2px",
                "--bs-offset-y": "2px",
              } as CSSProperties
            }
            type="button"
            className={cn(
              "newFocus just-black flex items-center gap-2 rounded-md border-2 px-2 py-0.5 text-sm font-medium shadow-full",
              "bg-opacity-50 disabled:bg-opacity-25 disabled:text-opacity-75 enabled:hocus:bg-opacity-100",
              BG_COLORS[idx % BG_COLORS.length]
            )}
            onClick={() => removeSelf(val)}
          >
            {val} <IoMdClose className="pointer-events-none shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};
