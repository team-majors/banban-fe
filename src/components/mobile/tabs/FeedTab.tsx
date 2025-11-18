"use client";

import { useContext } from "react";
import { SectionContext } from "@/components/layout/RightSection/SectionContext";
import CommentThread from "@/components/feed/detail/CommentThread";
import FeedListSection from "@/components/feed/list/FeedListSection";

export default function FeedTab() {
  const { sectionStatus } = useContext(SectionContext);

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-t-lg overflow-y-auto scrollbar-hide">
      {sectionStatus === "feeds" ? <FeedListSection /> : <CommentThread />}
    </div>
  );
}
