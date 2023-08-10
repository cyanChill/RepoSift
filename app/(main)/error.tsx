"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error }: Props) {
  const router = useRouter();

  // To prevent anything sensitive from being displayed
  //  - Our custom error messages will be pretty short.
  const errMsg =
    error.message.length < 150
      ? error.message
      : "Something unexpected has occurred.";

  return (
    <main className="relative mx-auto flex w-full max-w-appContent flex-col items-center overflow-hidden p-3 py-5 text-center md:py-20">
      <p className="mb-4 flex justify-center gap-2 py-4 text-5xl font-bold text-red-500 [text-shadow:3px_3px_#000] md:text-7xl md:[text-shadow:4px_4px_#000]">
        <span className="inline-block -translate-y-1 -rotate-6">O</span>
        <span className="inline-block translate-y-1 rotate-6">U</span>
        <span className="inline-block -rotate-6">C</span>
        <span className="inline-block translate-y-1 rotate-6">H</span>
        <span className="inline-block -rotate-3">!</span>
      </p>

      <h2 className="mb-2 text-2xl font-semibold">
        The following error has occurred:
      </h2>
      <p className="text-lg font-medium">{errMsg}</p>

      <div className="my-8 flex gap-2">
        <Link href="/" className="reverse-btn font-medium hover:bg-gray-200">
          Go Home
        </Link>
        <button
          onClick={() => router.back()}
          className="reverse-btn font-medium hover:bg-gray-200"
        >
          Go Back
        </button>
      </div>

      <Image
        src="/assets/vector.svg"
        alt=""
        width={360}
        height={360}
        className="absolute left-1/2 top-0 -z-10 h-auto w-appContent max-w-none -translate-x-1/2 -translate-y-1/2 brightness-95"
      />
    </main>
  );
}
