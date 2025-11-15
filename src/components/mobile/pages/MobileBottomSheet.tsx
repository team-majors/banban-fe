"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import RightSectionShell from "@/components/layout/RightSection/RightSectionShell";
import FeedCommentsSection from "../../feed/detail/CommentThread";

const BottomSheet = dynamic(
  () =>
    import("@/components/common/BottomSheet/BottomSheet").then(
      (mod) => mod.BottomSheet,
    ),
  { ssr: false },
);

export default function MobileBottomSheet() {
  const router = useRouter();

  return (
    <BottomSheet isOpen={true} onClose={() => router.back()} maxHeight={80}>
      <RightSectionShell>
        <FeedCommentsSection />
      </RightSectionShell>
    </BottomSheet>
  );
}
