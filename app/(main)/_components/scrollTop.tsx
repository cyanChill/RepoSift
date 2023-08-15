"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/*
  Fix with issue w/ "next/Link" not scrolling to the top when clicking on
  a <Link /> if we have a header with "sticky" that's not in its sticky
  position.
    - Ref: https://github.com/vercel/next.js/issues/45187#issuecomment-1639518030
*/
export default function ScrollTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (window) window.scroll(0, 0);
  }, [pathname]);

  return <></>;
}
