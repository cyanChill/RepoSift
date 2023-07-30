import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isAfter, subMonths } from "date-fns";

import type { LinkedAccount } from "@/db/schema/next-auth";
import type { GenericObj } from "./types";

/**
 * @description Combines any number of Tailwind classes nicely.
 * @returns A string containing Tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * @description A placeholder function that does nothing.
 * @returns A void function.
 */
export const noop = () => {
  return;
};

/**
 * @description Returns the 1st string value in URL search params.
 * @returns A string or undefined.
 */
export function firstStrParam(val: string | string[] | undefined) {
  if (!val || typeof val === "string") return val;
  else return val[0];
}

/**
 * @description Get a random integer satisfying: "min <= val < max".
 * @returns An integer.
 */
export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * @description Test whether a value is falsy but not "0".
 * @returns A boolean.
 */
export function isFalsyNotZero(val: unknown) {
  return !val && val !== 0;
}

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
 * @description Checks whether a date fails to be x months old from today.
 * @returns A boolean.
 */
export function didFailMonthConstraint(months: number, date: Date) {
  return isAfter(date, subMonths(Date.now(), months));
}

/**
 * @description Turns a string to a safe id value.
 * @returns A string.
 */
export function toSafeId(str: string) {
  return str.trim().toLowerCase().replace(" ", "_");
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
 * @description An array of the enabled & disabled providers.
 * @returns An array.
 */
export const avaliableProviders = [
  { name: "GitHub", value: "github" },
  { name: "GitLab", value: "gitlab", disabled: true },
  { name: "Bitbucket", value: "bitbucket", disabled: true },
];
