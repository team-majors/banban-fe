export default function RealtimeFeedRankingSkeleton() {
  return (
    <div className="w-full flex flex-col gap-5 bg-white rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="w-32 h-4.5 rounded-md shimmer" />
      </div>

      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, idx) => (
          <SkeletonRankingRow key={`ranking-skeleton-${idx}`} />
        ))}
      </div>
    </div>
  );
}

function SkeletonRankingRow() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded shimmer" />
      <div className="flex-1 h-4 rounded-md shimmer" />
      <div className="w-10 h-4 rounded-md shimmer" />
    </div>
  );
}
