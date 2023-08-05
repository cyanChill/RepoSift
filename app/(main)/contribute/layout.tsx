import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative mx-auto flex w-full max-w-appContent flex-col justify-evenly gap-8 overflow-hidden p-3 py-5 pb-20 md:flex-row md:py-28">
      {children}

      <Image
        src="/assets/vector.svg"
        alt=""
        width={360}
        height={360}
        className="absolute left-1/2 top-0 -z-10 h-auto w-appContent max-w-none -translate-x-1/2 -translate-y-1/2"
      />
    </main>
  );
}
