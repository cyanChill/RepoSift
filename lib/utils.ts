import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function firstStrParam(val: string | string[] | undefined) {
  if (!val || typeof val === "string") return val;
  else return val[0];
}

/** Get a random integer satisfying: "min <= val < max". */
export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function formDataToObj(data: FormData) {
  return Object.fromEntries(data);
}
