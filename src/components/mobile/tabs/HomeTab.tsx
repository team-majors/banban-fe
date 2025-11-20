"use client";

import RealtimeFeedRankingSkeleton from "@/components/common/Skeleton/RealtimeFeedRankingSkeleton";
import TodayTopicCard from "@/components/layout/LeftSection/TodayTopicCard/TodayTopicCard";
import dynamic from "next/dynamic";

const RealtimeFeedRanking = dynamic(
  () =>
    import(
      "@/components/layout/LeftSection/RealtimeFeedRanking/RealtimeFeedRanking"
    ),
  { ssr: false, loading: () => <RealtimeFeedRankingSkeleton /> },
);

export default function HomeTab() {
  return (
    <div className="flex flex-col gap-[10px] pb-8 w-full">
      <TodayTopicCard />
      <RealtimeFeedRanking />
    </div>
  );
}
