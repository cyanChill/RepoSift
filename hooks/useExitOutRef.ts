import { useRef, useEffect, useCallback } from "react";

/**
 *
 * useExitOutRef hook
 *
 * @description Fires a callback when the user "exits" a ref container by either clicking/touching out of the ref or clicking "esc" while in the ref.
 *
 * @param callback Callback that fires on "exit".
 * @param escInRef Boolean to determine how the "esc" aspect works - if we "esc" while focused inside the ref or from anywhere.
 * @returns An array with first item being the ref.
 *
 */
function useExitOutRef<T extends HTMLElement>(
  callback: () => void,
  escInRef = true
) {
  const ref = useRef<T>(null);
  const savedCb = useRef(callback);

  const memoizedCb = useCallback((e: MouseEvent | TouchEvent) => {
    const node = ref.current;
    if (node && !node.contains(e.target as Element)) savedCb.current();
  }, []);

  const memoizedCbA11y = useCallback(
    (e: KeyboardEvent) => {
      const node = ref.current;
      if (escInRef && (!node || !node.contains(e.target as Element))) return;
      if (e.key === "Escape") savedCb.current();
    },
    [escInRef]
  );

  useEffect(() => {
    savedCb.current = callback;
  }, [callback]);

  useEffect(() => {
    window.addEventListener("click", memoizedCb);
    window.addEventListener("touchstart", memoizedCb);
    window.addEventListener("keydown", memoizedCbA11y);
    return () => {
      window.removeEventListener("click", memoizedCb);
      window.addEventListener("touchstart", memoizedCb);
      window.removeEventListener("keydown", memoizedCbA11y);
    };
  }, [memoizedCb, memoizedCbA11y]);

  return [ref];
}

export { useExitOutRef };
