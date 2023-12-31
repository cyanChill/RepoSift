import { isAfter, subMonths, subWeeks } from "date-fns";

/**
 * @description Test whether a value is falsy but not "0".
 * @returns A boolean.
 */
export function isFalsyNotZero(val: unknown) {
  return !val && val !== 0;
}

/**
 * @description Checks whether a date fails to be x months old from today.
 * @returns A boolean.
 */
export function didFailMonthConstraint(months: number, date: Date) {
  return isAfter(date, subMonths(Date.now(), months));
}

/**
 * @description Test whether a value is a number.
 * @returns A boolean.
 */
export function isNum(val: unknown): val is number {
  return typeof val === "number";
}

/**
 * @description Checks whether a date isn't from 1+ week ago.
 * @returns A boolean.
 */
export function isNotOneWeekOld(date: Date) {
  return isAfter(date, subWeeks(Date.now(), 1));
}
