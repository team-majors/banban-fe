import { RefObject, useEffect } from "react";

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onClickOutside: () => void,
  eventType: keyof DocumentEventMap = "mousedown",
) {
  useEffect(() => {
    const handleClick = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOutside();
      }
    };
    document.addEventListener(eventType, handleClick);
    return () => document.removeEventListener(eventType, handleClick);
  }, [ref, onClickOutside, eventType]);
}
