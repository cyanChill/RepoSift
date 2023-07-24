import SSClientPage from "./_components/client_page";

export const metadata = {
  title: "RepoSift | Simple Search",
};

export default function SimpleSearchPage() {
  return (
    <main className="mx-auto grid w-full max-w-appContent gap-8 p-3 py-5 md:grid-cols-2 md:py-20">
      <SSClientPage />
    </main>
  );
}
