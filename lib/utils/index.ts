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
 * @description Get a random integer satisfying: "min <= val < max".
 * @returns An integer.
 */
export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}
