"use client";

import { useContext } from "react";
import { SectionContext } from "@/components/layout/RightSection/SectionContext";
import FeedsPanel from "@/components/layout/RightSection/FeedsPanel";
import CommentsPanel from "@/components/layout/RightSection/CommentsPanel";

export default function FeedTab() {
  const { sectionStatus } = useContext(SectionContext);

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-t-lg overflow-y-auto scrollbar-hide">
      {sectionStatus === "feeds" ? <FeedsPanel /> : <CommentsPanel />}
    </div>
  );
}
