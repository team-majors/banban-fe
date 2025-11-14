"use client";
import clsx from "clsx";

export default function HeaderSkeleton() {
  return (
    <header
      data-testid="header-skeleton"
      className="fixed left-0 right-0 z-[999] h-[60px] flex items-center px-4 bg-slate-50"
    >
      {/* Mobile Logo (left) */}
      <div className="md:hidden">
        <SkeletonRect className="w-[80px] h-[36px] md:w-[128px] md:h-[46px]" />
      </div>

      {/* Desktop Logo (center) */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
        <SkeletonRect className="w-[80px] h-[36px] md:w-[128px] md:h-[46px]" />
      </div>

      {/* Actions (right) */}
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <SkeletonRoundedRect className="w-[56px] h-[32px] md:w-[86px] md:h-[44px]" />
        <SkeletonRoundedRect className="w-[56px] h-[32px] md:w-[86px] md:h-[44px]" />
      </div>
    </header>
  );
}

function SkeletonRect({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "animate-shimmer rounded-[4px]",
        "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200",
        className,
      )}
    />
  );
}

function SkeletonRoundedRect({ className }: { className?: string }) {
  return <SkeletonRect className={clsx("rounded-xl", className)} />;
}
