import "server-only";
import { headers } from "next/headers";

/**
 * @description Returns everything left of the domain
 * @returns A string.
 */
export function getPathWithQuery() {
  const headersList = headers();
  const domain = headersList.get("host") ?? "";
  const fullUrl = headersList.get("referer") ?? "";
  return fullUrl.split(domain)[1];
}
