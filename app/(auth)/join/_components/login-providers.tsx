"use client";
import { type PropsWithChildren } from "react";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa6";

import { cn } from "@/lib/utils";

export function LoginProviders() {
  return (
    <>
      <ProviderBtn
        onClick={() => void signIn("github")}
        className="flex items-center justify-center gap-1 border-white bg-black"
      >
        <FaGithub /> GitHub
      </ProviderBtn>
    </>
  );
}

type ProviderBtnProps = PropsWithChildren<{
  onClick: () => void;
  className: string;
}>;

const ProviderBtn = ({ onClick, className, children }: ProviderBtnProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-md border p-4 py-2 text-center shadow-white transition duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-full",
        className
      )}
    >
      {children}
    </button>
  );
};
