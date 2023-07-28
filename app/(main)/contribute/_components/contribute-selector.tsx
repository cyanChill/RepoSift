import Link from "next/link";
import type { IconType } from "react-icons/lib";

import { cn, getMonthDescriptor } from "@/lib/utils";

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
    <section className="just-black flex w-full flex-col border-2 bg-white p-4 shadow-full md:h-[500px] md:max-w-[425px] md:p-6 md:pb-12">
      <Icon
        className={cn(
          "just-black h-auto w-12 border-2 p-2 shadow-full md:w-20",
          bgClr.icon,
          { "bg-gray-200": disabled }
        )}
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
          "just-black mt-6 w-fit self-center border-2 px-6 py-2 text-center font-medium md:mt-auto md:px-12 md:text-lg",
          bgClr.button,
          {
            "pointer-events-none bg-gray-200": disabled,
            "shadow-full transition duration-300 hover:shadow-none": !disabled,
          }
        )}
      >
        {btnText}
      </Link>
    </section>
  );
}
