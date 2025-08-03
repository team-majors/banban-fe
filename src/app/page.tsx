"use client";

import LeftSection from "@/components/layout/LeftSection/LeftSection";
import RightSection from "@/components/layout/RightSection/RightSection";

export default function Home() {
  return (
    <div className="relative mx-auto w-fit">
      <div className="flex gap-6 pt-[64px] h-[100dvh]">
        <LeftSection />
        <RightSection />
      </div>
    </div>
  );
}
