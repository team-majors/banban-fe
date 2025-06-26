"use client";

import { useToast } from "@/components/common/Toast/useToast";

export default function Home() {
  const { showToast } = useToast();

  const handleClick = () =>
    showToast({
      type: "default",
      message: "성공적으로 완료되었습니다!",
      duration: 400000,
    });

  return (
    <div className="h-[200dvh]">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleClick}
      >
        토스트 띄우기
      </button>
    </div>
  );
}
