import type { ReadonlyURLSearchParams } from "next/navigation";

import type { VariableObj } from "../types";

/**
 * @description Returns the 1st string value in URL search params.
 * @returns A string or undefined.
 */
export function firstStrParam(val: string | string[] | undefined) {
  if (!val || typeof val === "string") return val;
  else return val[0];
}

/**
 * @description Turns an object of string-values into a query string.
 * @returns A string.
 */
export function toURLQS(data: VariableObj<string>) {
  const params = new URLSearchParams(data);
  return params.toString();
}

/**
 * @description Replace a query string param from an existing search params.
 * @returns A string.
 */
export function replaceSearchParam(
  searchParams: VariableObj<string>,
  name: string,
  value: string,
) {
  const params = new URLSearchParams(searchParams);
  params.set(name, value);
  return params.toString();
}

/**
 * @description Turn a URLSearchParams type into an object.
 * @returns Object with string values.
 */
export function searchParamsToObj(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
) {
  const obj: VariableObj<string> = {};
  searchParams.forEach((value, key) => (obj[key] = value));
  return obj;
}

/**
 * @description Updates the URL without reloading the page.
 */
export function updateURL(basePath: string, queryStr?: string) {
  if (window.history) {
    const query = queryStr ? `?${queryStr}` : "";
    window.history.pushState(null, "", `/${basePath}${query}`);
  }
}
