"use client";

import LeftSection from "@/components/layout/LeftSection/LeftSection";
import RightSection from "@/components/layout/RightSection/RightSection";

export default function Home() {
  return (
    <div className="relative h-[100dvh] mx-auto w-fit pt-[64px] flex gap-6">
      <LeftSection />
      <RightSection />
    </div>
  );
}
