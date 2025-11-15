"use client";

import LeftSection from "@/components/layout/LeftSection/LeftSection";
import RightSectionShell from "@/components/layout/RightSection/RightSectionShell";
import CommentThread from "../../feed/detail/CommentThread";

export default function DesktopFeedDetailPage() {
  return (
    <div className="relative mx-auto w-fit">
      <div className="flex gap-6 pt-[60px] h-[100dvh]">
        <LeftSection />
        <RightSectionShell>
          <CommentThread />
        </RightSectionShell>
      </div>
    </div>
  );
}
