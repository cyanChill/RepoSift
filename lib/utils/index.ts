import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
