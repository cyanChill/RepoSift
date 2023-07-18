export type PageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export type AuthProviders = "github" | "gitlab" | "bitbucket";
