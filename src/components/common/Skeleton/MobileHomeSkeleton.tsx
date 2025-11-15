"use client";

export default function MobileHomeSkeleton() {
  return (
    <div className="flex flex-col h-[100dvh] bg-[#f8fafc] pt-16 px-4 pb-[82px] gap-4 md:hidden">
      {/* Card */}
      <div className="bg-white rounded-2xl p-5 flex flex-col gap-3">
        <SkeletonLine width="60%" height="24px" />
        <SkeletonLine width="80%" height="40px" />

        <div className="flex min-h-[248px] justify-center items-center p-5">
          <div className="shimmer w-[200px] h-[200px] rounded-full" />
        </div>

        <div className="flex flex-col gap-2.5">
          <SkeletonPill />
          <SkeletonPill />
        </div>
      </div>

      {/* FeedList */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={`feed-skeleton-${idx}`}
            className="flex gap-3 p-3 bg-white rounded-xl"
          >
            <div className="shimmer w-12 h-12 rounded-full" />
            <div className="flex flex-col flex-1 gap-2">
              <SkeletonLine width="40%" />
              <SkeletonLine width="90%" />
              <SkeletonLine width="70%" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white px-4 py-2 flex justify-between items-center h-16">
        {["home", "feeds", "noti", "profile"].map((key) => (
          <div
            key={key}
            className="flex flex-col items-center gap-1.5 w-[60px]"
          >
            <div className="shimmer w-[26px] h-[26px] rounded-full" />
            <SkeletonLine width="60%" height="12px" />
          </div>
        ))}
      </nav>
    </div>
  );
}

/* --- Skeleton Utilities --- */

function SkeletonLine({
  width,
  height = "12px",
}: {
  width: string;
  height?: string;
}) {
  return <div style={{ width, height }} className="shimmer rounded-md" />;
}

function SkeletonPill() {
  return <div className="shimmer h-[38px] rounded-md" />;
}
