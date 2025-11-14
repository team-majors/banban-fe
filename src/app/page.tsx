"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSafeMediaQuery } from "@/hooks/useMediaQuery";
import MobileHomeSkeleton from "@/components/home/MobileHomeSkeleton";
import DesktopHomeSkeleton from "@/components/home/DesktopHomeSkeleton";

const MobileHome = dynamic(() => import("@/components/home/MobileHome"), {
  ssr: false,
  loading: () => <MobileHomeSkeleton />,
});

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
