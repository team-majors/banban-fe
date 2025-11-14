"use client";

import dynamic from "next/dynamic";
import RightSectionShell from "./RightSectionShell";

const RightSectionFeeds = dynamic(() => import("./RightSectionFeeds"), {
  ssr: false,
});

export default function RightSection() {
  return (
    <RightSectionShell>
      <RightSectionFeeds />
    </RightSectionShell>
  );
}
