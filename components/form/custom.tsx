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
          type="number"
          min={0}
          step={1}
          className={cn("form-input w-full max-w-[6rem]", className)}
        />
      </div>
    </fieldset>
  );
};
