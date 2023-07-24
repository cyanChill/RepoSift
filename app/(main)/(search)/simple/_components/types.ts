import type { AuthProviders } from "@/lib/zod/types";
import type { GitHubRepo } from "@/lib/zod/schema";

export type Results =
  | undefined
  | { error: true }
  | { error: false; provider: AuthProviders; items: GitHubRepo[] };
