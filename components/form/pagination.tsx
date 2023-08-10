"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { searchParamsToObj } from "@/lib/utils/url";

type Props = {
  currPage: number;
  hasNext: boolean;
};

export default function Pagination({ currPage, hasNext }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const baseStyles =
    "reverse-btn border-2 py-0.5 font-medium hover:bg-gray-200";

  return (
    <nav className="flex justify-between px-10">
      {currPage > 1 && (
        <Link
          href={{
            pathname,
            query: { ...searchParamsToObj(searchParams), page: currPage - 1 },
          }}
          className={baseStyles}
        >
          {"<"} Prev
        </Link>
      )}
      {hasNext && (
        <Link
          href={{
            pathname,
            query: { ...searchParamsToObj(searchParams), page: currPage + 1 },
          }}
          className={cn(baseStyles, "ml-auto")}
        >
          Next {">"}
        </Link>
      )}
    </nav>
  );
}
