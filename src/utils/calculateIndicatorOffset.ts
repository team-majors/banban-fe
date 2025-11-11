export const INDICATOR_DEFAULT_WIDTH = 24;

export function calculateIndicatorOffset(
  items: Array<HTMLElement | null>,
  targetIdx: number,
  indicatorWidth: number = INDICATOR_DEFAULT_WIDTH,
): number {
  if (!items.length || targetIdx < 0) return 0;

  const safeIdx = Math.min(targetIdx, items.length - 1);
  let offset = 0;

  for (let i = 0; i < safeIdx; i++) {
    offset += items[i]?.clientWidth ?? 0;
  }

  const currentWidth = items[safeIdx]?.clientWidth ?? 0;
  return offset + (currentWidth - indicatorWidth) / 2;
}
