import React, { useEffect, useState, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import {
  selectOption,
  SelectOptionGroup,
} from "@/components/common/SelectOptionGroup/SelectOptionGroup";
import VoteResultPlaceHolder from "./VoteResultPlaceHolder/VoteResultPlaceHolder";
import { PollOption } from "@/types/poll";
import dynamic from "next/dynamic";
import { PieData } from "@/types/pie";

/* ------------------------------
   ✔️ 1. 개선된 폴리필
   - 더 현실적인 유휴 시간 감지
-------------------------------- */
function requestIdleCallbackPolyfill(callback: IdleRequestCallback): number {
  const start = Date.now();
  return window.setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
    } as IdleDeadline);
  }, 1) as unknown as number;
}

function cancelIdleCallbackPolyfill(id: number) {
  clearTimeout(id);
}

const LazyVoteResultCircle = dynamic(
  () =>
    import(
      "@/components/layout/LeftSection/TodayTopicCard/chart/VoteResultCircle"
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[264px] w-full items-center justify-center">
        <div className="w-[232px] h-[232px] rounded-full bg-[#f2f3f5] animate-pulse" />
      </div>
    ),
  },
);

/* ------------------------------
   ✔️ 2. VoteResultDisplay - 불필요한 상태 초기화 방지
-------------------------------- */
function VoteResultDisplay({
  pieData,
  votedOptionId,
}: {
  pieData: PieData[];
  votedOptionId: number | null | undefined;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || ready) return;

    const idle = window.requestIdleCallback ?? requestIdleCallbackPolyfill;
    const cancelIdle = window.cancelIdleCallback ?? cancelIdleCallbackPolyfill;

    const idleId = idle(() => {
      setReady(true);
    });

    return () => cancelIdle(idleId);
  }, []); // 한 번만 실행

  if (!votedOptionId) return <VoteResultPlaceHolder />;

  if (!pieData.length) return null;

  return ready ? (
    <LazyVoteResultCircle pieData={pieData} />
  ) : (
    <VoteResultPlaceHolder />
  );
}

function MainContent({
  pieData,
  votedOptionId,
  options,
  displayedSelection,
  handleVote,
  isLoggedIn,
}: {
  pieData: PieData[];
  votedOptionId: number | null | undefined;
  options?: PollOption[];
  displayedSelection: selectOption;
  handleVote: (selection: selectOption) => void;
  isLoggedIn: boolean;
}) {
  // options 배열이 변경될 때만 재계산
  const { firstOptionString, secondOptionString } = useMemo(() => {
    return {
      firstOptionString:
        options?.find((o) => o.optionOrder === 1)?.content || "",
      secondOptionString:
        options?.find((o) => o.optionOrder === 2)?.content || "",
    };
  }, [options]);

  return (
    <>
      <VoteResultCircleContainer>
        <VoteResultDisplay pieData={pieData} votedOptionId={votedOptionId} />
      </VoteResultCircleContainer>

      <SelectOptionGroup
        selected={displayedSelection}
        rowGap="10px"
        firstOptionString={firstOptionString}
        secondOptionString={secondOptionString}
        onClick={handleVote}
        isAuthenticated={isLoggedIn}
      />
    </>
  );
}

export default MainContent;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const VoteResultCircleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.3s ease-out forwards;
`;
