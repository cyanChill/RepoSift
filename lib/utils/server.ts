import "server-only";

import type { GenericObj } from "../types";
import { ENV } from "../env-server";
import type { Option } from "@/components/form/utils";

/**
 * @description Fetches cached filters from database through API route and assigns types.
 * @returns An object.
 */
export async function getFilters(): Promise<{
  labels: { primary: Option[]; regular: Option[] };
  languages: Option[];
}> {
  const res = await fetch(`${ENV.NEXTAUTH_URL}/api/filters`);
  if (!res.ok) throw new Error("Failed to fetch filters from server.");
  const data = (await res.json()) as GenericObj;

  return {
    labels: {
      primary: ((data.labels as GenericObj).primary as Option[]) ?? [],
      regular: ((data.labels as GenericObj).regular as Option[]) ?? [],
    },
    languages: (data.languages as Option[]) ?? [],
  };
}
