import Link from "next/link";
import type { IconType } from "react-icons/lib";

import { cn } from "@/lib/utils";
import { getMonthDescriptor } from "@/lib/utils/mutate";

type Props = {
  href: string;
  Icon: IconType;
  title: string;
  description: string;
  btnText: string;
  bgClr: { icon: string; button: string };
  constraint: number;
  disabled: boolean;
};

export default function ContributeSelector({
  href,
  Icon,
  title,
  description,
  btnText,
  bgClr,
  constraint,
  disabled,
}: Props) {
  return (
    <section className="card flex w-full flex-col md:h-[500px] md:max-w-[425px] md:p-6 md:pb-12">
      <Icon
        className={cn("card h-auto w-12 border-2 p-2 md:w-20", bgClr.icon, {
          "bg-gray-200": disabled,
        })}
      />

      <h2 className="mt-4 text-lg font-semibold md:mt-8 md:text-2xl">
        {title}
      </h2>
      <p className="mt-2 text-sm md:mt-4 md:text-lg">{description}</p>

      {disabled && (
        <p className="mt-4 text-xs italic text-error md:mt-8 md:text-base">
          This option is disabled for you due to not having the required
          developer account age (
          <span className="font-semibold">
            greater than {getMonthDescriptor(constraint)}
          </span>
          ).
        </p>
      )}

      <Link
        href={href}
        className={cn(
          "reverse-btn mt-6 self-center border-2 px-6 font-medium md:mt-auto md:px-12 md:text-lg",
          bgClr.button,
          { "pointer-events-none bg-gray-200 shadow-none": disabled },
        )}
      >
        {btnText}
      </Link>
    </section>
  );
}
