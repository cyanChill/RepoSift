import SSClientPage from "./_components/client_page";

export const metadata = {
  title: "RepoSift | Simple Search",
};

export default function SimpleSearchPage() {
  return (
    <main className="mx-auto w-full max-w-appContent">
      <h1>Simple Search</h1>

      <SSClientPage />
    </main>
  );
}
