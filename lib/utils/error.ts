import { toast } from "react-hot-toast";

import type { ErrorObj } from "../types";

/**
 * @description Determines whether an error was returned from our server actions.
 * @returns A boolean.
 */
export function containsSAErr(err: unknown): err is ErrorObj {
  return (
    typeof (err as ErrorObj).error === "string" ||
    Array.isArray((err as ErrorObj).error)
  );
}

/**
 * @description Asserts whether an error was returned from our server actions.
 */
export function throwSAErrors(
  err: string | string[] | undefined
): asserts err is undefined {
  if (typeof err === "string") throw new Error(undefined, { cause: [err] });
  if (Array.isArray(err)) throw new Error(undefined, { cause: err });
}

/**
 * @description Toast all errors from the server action.
 */
export function toastSAErrors(err: unknown) {
  if (err instanceof Error && err.cause && Array.isArray(err.cause)) {
    err.cause.map((msg: string) => toast.error(msg));
  } else {
    toast.error(String(err));
  }
}

/**
 * @description Gets the error message from an Error object.
 * @returns A string.
 */
export function getErrMsg(err: unknown) {
  if (err instanceof Error) return err.message;
  return String(err);
}
