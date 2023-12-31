import { toast } from "react-hot-toast";
import type { ZodError } from "zod";

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
 * @description Extracts the error/errors in an ErrorObj and returns an array.
 * @returns A string array.
 */
export function extractSAErr(err: ErrorObj) {
  if (typeof err.error === "string") return [err.error];
  return err.error;
}

/**
 * @description Asserts whether an error was returned from our server actions.
 */
export function throwSAErrors(
  err: string | string[] | undefined,
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
    toast.error("Something unexpected occurred.");
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

/**
 * @description Extract the error messages from a Zod error from safeParse().
 * @returns A string array.
 */
export function getZodMsg(errArr: ZodError) {
  return errArr.errors.map((err) => err.message);
}
