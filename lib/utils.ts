import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { GenericObj } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const noop = () => {
  return;
};

export function firstStrParam(val: string | string[] | undefined) {
  if (!val || typeof val === "string") return val;
  else return val[0];
}

/** Get a random integer satisfying: "min <= val < max". */
export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function isFalsyNotZero(val: unknown) {
  return !val && val !== 0;
}

export function formDataToObj(data: FormData) {
  return Object.fromEntries(data);
}

export function removeEmptyProperties(data: GenericObj) {
  return Object.keys(data).reduce((acc, key) => {
    if (!isFalsyNotZero(data[key])) acc[key] = data[key];
    return acc;
  }, {} as GenericObj);
}
