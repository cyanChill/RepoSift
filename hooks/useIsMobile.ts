/**
 * Tracks when we resize our screen to be within a mobile breakpoint
 * with JavaScript instead of CSS.
 */
import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768; // In "px"

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => {
    window.removeEventListener("resize", callback);
  };
}

export default function useIsMobile() {
  return useSyncExternalStore(
    subscribe, // React won't resubscribe for as long as you pass the same function
    () => window.innerWidth < MOBILE_BREAKPOINT, // How to get the value on the client
    () => false // How to get the value on the server
  );
}
