import { RefObject, useLayoutEffect, useState } from "react";

const useCalculatedHeight = (containerRef: RefObject<HTMLElement | null>) => {
  const [calculatedHeight, setCalculatedHeight] = useState<number>(0);

  useLayoutEffect(() => {
    if (!containerRef || !containerRef.current) return;

    const handleScrollAndResize = () => {
      const vh = window.innerHeight;
      const offsetTop = containerRef.current?.offsetTop || 0;
      const scrollY = window.scrollY || 0;
      const calculatedHeight = vh - offsetTop + scrollY;

      console.log("calculatedHeight", calculatedHeight);
      setCalculatedHeight(calculatedHeight);
    };

    window.addEventListener("resize", handleScrollAndResize);
    window.addEventListener("scroll", handleScrollAndResize);
    handleScrollAndResize();

    return () => {
      window.removeEventListener("resize", handleScrollAndResize);
      window.removeEventListener("scroll", handleScrollAndResize);
    };
  }, [containerRef]);

  return calculatedHeight;
};

export { useCalculatedHeight };