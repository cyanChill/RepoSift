"use client";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  let routeName: undefined | string = undefined;
  if (pathname === "/") routeName = "RepoSift";
  if (pathname === "/simple") routeName = "Simple Search";
  if (pathname.startsWith("/indexed")) routeName = "Indexed Search";
  if (pathname === "/contribute") routeName = "Contribute";
  if (pathname.startsWith("/u/@")) routeName = "Profile";
  if (pathname === "/misc") routeName = "Misc.";

  if (!routeName) return null;

  return (
    <header className="w-full bg-white p-2 text-center text-[10vw] font-bold uppercase leading-none">
      <h1>{routeName}</h1>
    </header>
  );
}
