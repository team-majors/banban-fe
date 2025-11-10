"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import MobileHome from "@/components/home/MobileHome";
import DesktopHome from "@/components/home/DesktopHome";

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return isMobile ? <MobileHome /> : <DesktopHome />;
}
