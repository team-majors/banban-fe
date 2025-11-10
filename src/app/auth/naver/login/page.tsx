import CallbackPage from "@/components/auth/CallbackPage";
import Fallback from "@/components/common/FallBack";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<Fallback />}>
      <CallbackPage provider="naver" />
    </Suspense>
  );
}
