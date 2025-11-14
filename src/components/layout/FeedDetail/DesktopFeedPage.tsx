"use client";

import LeftSection from "@/components/layout/LeftSection/LeftSection";
import RightSectionShell from "@/components/layout/RightSection/RightSectionShell";
import MainFeedAndComments from "../RightSection/MainFeedAndComments";

export default function DesktopFeedPage() {
  return (
    <div className="relative mx-auto w-fit">
      <div className="flex gap-6 pt-[60px] h-[100dvh]">
        <LeftSection />
        <RightSectionShell>
          <MainFeedAndComments />
        </RightSectionShell>
      </div>
    </div>
  );
}
