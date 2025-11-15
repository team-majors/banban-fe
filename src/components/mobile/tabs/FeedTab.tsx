"use client";

import { useContext } from "react";
import { SectionContext } from "@/components/layout/RightSection/SectionContext";
import CommentThread from "@/components/feed/detail/CommentThread";
import FeedsTread from "@/components/feed/list/FeedsTread";

export default function FeedTab() {
  const { sectionStatus } = useContext(SectionContext);

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-t-lg overflow-y-auto scrollbar-hide">
      {sectionStatus === "feeds" ? <FeedsTread /> : <CommentThread />}
    </div>
  );
}
