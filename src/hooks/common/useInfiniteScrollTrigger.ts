import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollTriggerOptions {
  onLoadMore: () => void | Promise<void>;
  enabled: boolean;
  hasNextPage: boolean;
  rootMargin?: string;
}

export function useInfiniteScrollTrigger({
  onLoadMore,
  enabled,
  hasNextPage,
  rootMargin = "200px",
}: InfiniteScrollTriggerOptions) {
  const [ref, inView] = useInView({
    rootMargin,
    threshold: 0,
  });

  useEffect(() => {
    if (!enabled || !hasNextPage || !inView) return;
    onLoadMore();
  }, [enabled, hasNextPage, inView, onLoadMore]);

  return ref;
}
