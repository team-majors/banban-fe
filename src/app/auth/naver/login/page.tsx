import CallbackPage from "@/components/auth/CallbackPage";
import Fallback from "@/components/common/Fallback";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<Fallback />}>
      <CallbackPage provider="naver" />
    </Suspense>
  );
}
