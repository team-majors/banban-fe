/**
 * 반응형 디자인 breakpoint 정의
 * - Mobile: < 768px
 * - Tablet: 768px ~ 1024px
 * - Desktop: ≥ 1024px
 */

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
};

export const media = {
  mobile: `@media (max-width: ${BREAKPOINTS.mobile - 1}px)`,
  // tablet: `@media (min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.tablet - 1}px)`,
  desktop: `@media (min-width: ${BREAKPOINTS.tablet}px)`,
};
