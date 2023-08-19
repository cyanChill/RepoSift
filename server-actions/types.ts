import type { Repository } from "@/db/schema/main";

/*
  This file will contain the types that are used globally (ie: not just
  in the "/server-actions" directory).
*/

/** @description Object structure returned from `doIndexedSearch()`. */
export type IndexedRepo = Omit<Repository, "userId" | "_primaryLabel">;
