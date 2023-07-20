import { useRef, useEffect, useCallback } from "react";

/**
 *
 * useFormReset hook
 *
 * @description Fires a callback when a form reset event is triggered.
 *
 * @param callback Callback that fires on "form reset".
 * @param formId The id of the form we want the callback to trigger on.
 *
 */
const useFormReset = (callback: () => void, formId: string) => {
  const savedCb = useRef(callback);

  const memoizedCb = useCallback(
    (e: Event) => {
      const target = e.target as Element;
      if (target.id === formId) savedCb.current();
    },
    [formId]
  );

  useEffect(() => {
    savedCb.current = callback;
  }, [callback]);

  useEffect(() => {
    window.addEventListener("reset", memoizedCb);
    return () => {
      window.removeEventListener("reset", memoizedCb);
    };
  }, [memoizedCb]);
};

export { useFormReset };
