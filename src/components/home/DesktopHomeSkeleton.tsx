"use client";

export default function DesktopHomeSkeleton() {
  return (
    <div className="hidden md:flex justify-center pt-[72px] bg-[#f8fafc] min-h-[100dvh]">
      <div className="flex gap-6 w-full max-w-[1000px] px-6">
        {/* Left Column */}
        <div className="flex flex-col gap-4 basis-[430px] shrink-0">
          <div className="bg-white rounded-2xl p-5 flex flex-col gap-4 min-h-[480px] justify-between shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
            {/* Chart Info */}
            <div className="flex flex-col gap-2.5">
              <SkeletonLine width="40%" height="24px" />
              <SkeletonLine width="90%" height="40px" />
            </div>

            {/* Chart */}
            <div className="flex flex-col gap-4 items-center justify-center h-[280px]">
              <div className="shimmer w-[200px] h-[200px] rounded-full" />
            </div>

            {/* Control Pills */}
            <div className="flex flex-col gap-3">
              <SkeletonPill />
              <SkeletonPill />
            </div>
          </div>

          {/* Feed Placeholder */}
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`desk-feed-${idx}`}
                className="flex gap-3 p-3 bg-white rounded-xl shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
              >
                <div className="shimmer w-12 h-12 rounded-full" />
                <div className="flex flex-col gap-2 flex-1">
                  <SkeletonLine width="40%" height="14px" />
                  <SkeletonLine width="85%" height="14px" />
                  <SkeletonLine width="75%" height="14px" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 bg-white rounded-2xl p-4 flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={`comment-${idx}`}
              className="bg-[#fdfdfd] rounded-xl p-4 flex flex-col gap-2.5"
            >
              <SkeletonLine width="30%" height="12px" />
              <SkeletonLine width="90%" height="12px" />
              <SkeletonLine width="80%" height="12px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- Skeleton Utilities --- */
function SkeletonLine({ width, height }: { width: string; height: string }) {
  return <div style={{ width, height }} className="shimmer rounded-md" />;
}

function SkeletonPill() {
  return <div className="shimmer h-[38px] rounded-md" />;
}
