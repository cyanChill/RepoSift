import type { ReactNode } from "react";

export default function MarqueeX({ children }: { children: ReactNode }) {
  return (
    <aside className="relative max-w-full overflow-hidden bg-black py-2 text-4xl font-bold text-white md:text-7xl">
      <div className="relative w-max animate-marqueeX uppercase child:mx-4 child:inline">
        {children}
      </div>
    </aside>
  );
}
