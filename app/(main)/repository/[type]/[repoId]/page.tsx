import type { AuthProviders } from "@/lib/zod/utils";

type Props = { params: { type: AuthProviders; repoId: string } };

/* TODO: Utilize <ResultPreview /> from "Indexed Search" feature */
export default function RepositoryPage({ params }: Props) {
  console.log(params);

  return (
    <main className="mx-auto w-full max-w-appContent p-3 py-5 md:py-20">
      Repository Page: [{params.type}] {params.repoId}
    </main>
  );
}
