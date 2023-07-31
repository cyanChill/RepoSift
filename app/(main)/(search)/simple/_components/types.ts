import type { AuthProviders } from "@/lib/zod/utils";
import type { GitHubRepo } from "@/lib/zod/schema";

export type Results =
  | undefined
  | { error: true }
  | { error: false; provider: AuthProviders; items: GitHubRepo[] };
