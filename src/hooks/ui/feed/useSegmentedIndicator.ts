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
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: indicatorWidth,
  });
  const selectedIdxRef = useRef(selectedIdx);

  const updateIndicator = useCallback(
    (idx?: number) => {
      const targetIdx = typeof idx === "number" ? idx : selectedIdxRef.current;
      const targetItem = itemRefs.current[targetIdx];
      const rawWidth =
        (targetItem?.clientWidth ?? indicatorWidth) || indicatorWidth;
      const nextWidth = Math.max(Math.min(rawWidth - 12, rawWidth), 24);
      const halfWidth = Math.max(nextWidth / 2, 16);

      const distance = calculateIndicatorOffset(
        itemRefs.current,
        targetIdx,
        halfWidth,
      );

      setIndicatorStyle((prev) => {
        if (prev.left === distance && prev.width === halfWidth) {
          return prev;
        }
        return { left: distance, width: halfWidth };
      });
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

  return { indicatorLeft: indicatorStyle.left, indicatorWidth: indicatorStyle.width };
}
