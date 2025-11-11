"use client";

import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import {
  INDICATOR_DEFAULT_WIDTH,
  calculateIndicatorOffset,
} from "@/utils/calculateIndicatorOffset";

interface UseSegmentedIndicatorOptions {
  itemRefs: React.MutableRefObject<Array<HTMLElement | null>>;
  selectedIdx: number;
  indicatorWidth?: number;
  dependencyKey?: number;
}

export function useSegmentedIndicator({
  itemRefs,
  selectedIdx,
  indicatorWidth = INDICATOR_DEFAULT_WIDTH,
  dependencyKey,
}: UseSegmentedIndicatorOptions) {
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const selectedIdxRef = useRef(selectedIdx);

  const updateIndicator = useCallback(
    (idx?: number) => {
      const targetIdx = typeof idx === "number" ? idx : selectedIdxRef.current;
      const distance = calculateIndicatorOffset(
        itemRefs.current,
        targetIdx,
        indicatorWidth,
      );
      setIndicatorLeft(distance);
    },
    [itemRefs, indicatorWidth],
  );

  useEffect(() => {
    selectedIdxRef.current = selectedIdx;
  }, [selectedIdx]);

  useLayoutEffect(() => {
    updateIndicator(selectedIdx);
  }, [selectedIdx, updateIndicator]);

  useEffect(() => {
    const handleResize = () => updateIndicator();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }

    const observer = new ResizeObserver(handleResize);

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
    // dependencyKey를 통해 라벨 갯수 변화 등을 감지
  }, [updateIndicator, itemRefs, dependencyKey]);

  return { indicatorLeft, updateIndicator };
}
