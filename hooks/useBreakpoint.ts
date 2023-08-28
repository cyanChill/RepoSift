import { useSyncExternalStore, useCallback } from "react";

type BreakpointOperators = "gt" | "gte" | "lt" | "lte" | "eq";

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => {
    window.removeEventListener("resize", callback);
  };
}

/**
 *
 * useBreakpoint hook
 *
 * @description Tracks when the inner width of our window hits a certain breakpoint
 *
 * @param breakpoint Integer in "px" representing where we want to detect when our window hits or go beyond it.
 * @param operator Defaults to the "lt" (<) operator - represents how we want to detect when we hit the breakpoint.
 * @returns A boolean stating when we hit or go beyond our breakpoint.
 *
 */
const useBreakpoint = (
  breakpoint: number,
  operator: BreakpointOperators = "lt",
) => {
  const getSnapshot = useCallback(() => {
    switch (operator) {
      case "gt":
        return window.innerWidth > breakpoint;
      case "gte":
        return window.innerWidth >= breakpoint;
      case "lt":
        return window.innerWidth < breakpoint;
      case "lte":
        return window.innerWidth <= breakpoint;
      case "eq":
        return window.innerWidth === breakpoint;
      default:
        throw new Error("Invalid Operator");
    }
  }, [breakpoint, operator]);

  return useSyncExternalStore(
    subscribe, // React won't resubscribe for as long as you pass the same function
    getSnapshot, // How to get the value on the client
    () => false, // How to get the value on the server
  );
};

/**
 *
 * useMobile hook
 *
 * @description Tracks when the inner width of our window is less than MOBILE_BREAKPOINT.
 *
 * @returns A boolean stating when our window size is less than our MOBILE_BREAKPOINT.
 *
 */
const MOBILE_BREAKPOINT = 768; // In "px"
const useIsMobile = () => {
  return useBreakpoint(MOBILE_BREAKPOINT, "lt");
};

export type { BreakpointOperators };
export { useBreakpoint, useIsMobile };
