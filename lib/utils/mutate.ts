import type { LinkedAccount } from "@/db/schema/next-auth";

import { isFalsyNotZero } from "./validation";
import type { GenericObj } from "../types";

/**
 * @description Converts a FormData object to a regular object.
 * @returns An object.
 */
export function formDataToObj(data: FormData) {
  return Object.fromEntries(data);
}

/**
 * @description Remove the falsy values that aren't "0" from an object.
 * @returns An object without falsy values that aren't "0".
 */
export function removeEmptyProperties(data: GenericObj) {
  return Object.keys(data).reduce((acc, key) => {
    if (!isFalsyNotZero(data[key])) acc[key] = data[key];
    return acc;
  }, {} as GenericObj);
}

/**
 * @description Go through the "LinkedAccount" property on a "User" object and returns the oldest date.
 * @returns A date or date string.
 */
export function getOldestAge(linkedAccs: LinkedAccount[]) {
  return linkedAccs.reduce((accum, curr: LinkedAccount) => {
    return accum < curr.createdAt ? accum : curr.createdAt;
  }, linkedAccs[0].createdAt);
}

type Descriptors = { one: string; other: string };
/**
 * @description Create a description string based on the number of months in the form of "x months", "x years", or "x years and x months".
 * @returns A string.
 */
export function getMonthDescriptor(numMonths: number) {
  function getPlural(num: number, word: Descriptors) {
    return (num === 1 && word.one) || word.other;
  }

  // Descriptors
  const months = { one: "month", other: "months" };
  const years = { one: "year", other: "years" };
  // Values for # of months & years
  const m = numMonths % 12;
  const y = Math.floor(numMonths / 12);
  const results = [];

  if (y > 0) results.push(`${y} ${getPlural(y, years)}`);
  if (m > 0) results.push(`${m} ${getPlural(m, months)}`);
  return results.join(" and ");
}

/**
 * @description Turns a string to a safe id value.
 * @returns A string.
 */
export function toSafeId(str: string) {
  return str.trim().toLowerCase().replace(" ", "_");
}
