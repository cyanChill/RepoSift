"use client";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error }: Props) {
  return (
    <main className="mx-auto w-full max-w-appContent p-3 py-5 text-center md:py-20">
      <h2 className="mb-2 text-2xl font-semibold">
        The following error has occurred:
      </h2>
      <p className="text-lg font-medium">{error.message}</p>
    </main>
  );
}
