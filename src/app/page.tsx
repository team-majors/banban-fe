"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSafeMediaQuery } from "@/hooks/common/useMediaQuery";
import MobileHomeSkeleton from "@/components/common/Skeleton/MobileHomeSkeleton";
import DesktopHomeSkeleton from "@/components/common/Skeleton/DesktopHomeSkeleton";
import MobileHome from "@/components/mobile/pages/MobileHome";

const DesktopHome = dynamic(() => import("@/components/home/DesktopHome"), {
  ssr: false,
  loading: () => <DesktopHomeSkeleton />,
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useSafeMediaQuery("(max-width: 767px)");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <DesktopHomeSkeleton />
        <MobileHomeSkeleton />
      </>
    );
  }

  return isMobile ? <MobileHome /> : <DesktopHome />;
}
