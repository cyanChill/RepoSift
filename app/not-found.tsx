import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "RepoSift",
  description: "Better repository indexing and searching.",
};

export default function NotFound() {
  return (
    <body className="flex flex-col bg-bkg text-black">
      <main className="relative mx-auto flex h-screen w-full max-w-appContent flex-col items-center gap-2 overflow-hidden p-3 py-5 text-center md:py-20">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            alt=""
            width="144"
            height="38"
            className="my-10 h-[76px] w-72"
          />
        </Link>
        <h1 className="mb-4 text-2xl font-semibold md:text-4xl">
          Sorry, this page was not found.
        </h1>
        <Link
          href="/"
          className="card py-2 font-medium transition duration-150 hover:bg-gray-200 hover:shadow-none"
        >
          Go Home
        </Link>

        <Image
          src="/assets/vector.svg"
          alt=""
          width={360}
          height={360}
          className="absolute left-1/2 top-0 -z-10 h-auto w-appContent max-w-none -translate-x-1/2 -translate-y-1/2 brightness-95"
        />
      </main>
    </body>
  );
}
