import Image from "next/image";

export const metadata = {
  title: "Join RepoSift",
  description: "Join RepoSift today with the avaliable repository providers.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className="grid grid-flow-col grid-cols-1 grid-rows-1 bg-zinc-900 text-white">
      {children}
      <aside className="relative hidden w-[40vw] overflow-auto md:grid">
        <Image
          src="/assets/auth/background.svg"
          alt=""
          fill
          className="absolute left-0 top-0 h-full w-full object-cover"
        />
      </aside>
    </body>
  );
}
