"use client";

import ZapIcon from "@/components/svg/ZapIcon";
import styled from "styled-components";
import RankingItem from "./RankingItem";
import useHotFeed from "@/hooks/useHotFeed";
import { useMemo } from "react";
import { HotFeed } from "@/types/feeds";
import { useRouter } from "next/navigation";
import { usePoll } from "@/hooks/usePoll";

export default function RealtimeFeedRanking() {
  const {
    data: todayPoll,
    isLoading: isPollLoading,
    isError: isPollError,
  } = usePoll();
  const pollId = todayPoll?.id;

  const hotFeedEnabled = typeof pollId === "number";

  const {
    data,
    isLoading: isHotFeedLoading,
    isError: isHotFeedError,
  } = useHotFeed(pollId, { enabled: hotFeedEnabled });
  const router = useRouter();

  const sortedFeeds = useMemo(
    () =>
      data?.feeds ? [...data.feeds].sort((a, b) => a.rank - b.rank) : [],
    [data],
  );

  const restNum = Math.max(0, 5 - sortedFeeds.length);

  return (
    <Container>
      <Title>
        <IconWrapper>
          <ZapIcon />
        </IconWrapper>
        실시간 피드 순위
      </Title>
      {isPollLoading && (
        <StatusMessage>투표 정보를 불러오는 중입니다...</StatusMessage>
      )}

      {!isPollLoading && !hotFeedEnabled && !isPollError && (
        <StatusMessage>
          {"오늘의 주제가 없습니다\n잠시 후 다시 시도해주세요"}
        </StatusMessage>
      )}

      {!isPollLoading && isPollError && (
        <StatusMessage>
          {"투표 정보를 불러오지 못했습니다\n잠시 후 다시 확인해주세요"}
        </StatusMessage>
      )}

      {hotFeedEnabled && !isHotFeedLoading && !isHotFeedError && (
        <RankingList>
          {sortedFeeds.map((item: HotFeed) => {
            const figure = item.rankChange ?? 0;
            const handleSelect = () => {
              router.push(`/feeds/${item.feedId}`);
            };

            return (
              <li key={item.feedId}>
                <RankingItem
                  rank={item.rank}
                  title={item.content}
                  figure={figure}
                  onSelect={handleSelect}
                />
              </li>
            );
          })}
          {Array.from({ length: restNum }, (_, index) => (
            <li key={index}>
              <RankingItem
                rank={sortedFeeds.length + index + 1}
                title={"-"}
                figure={0}
              />
            </li>
          ))}
        </RankingList>
      )}

      {hotFeedEnabled && (isHotFeedLoading || isHotFeedError) && (
        <StatusMessage>
          {isHotFeedError
            ? "핫 피드를 불러오지 못했습니다.\n잠시 후 다시 확인해주세요"
            : "핫 피드를 불러오는 중입니다..."}
        </StatusMessage>
      )}
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 340px;
  max-width: 430px;
  background-color: white;
  border-radius: 8px;
  padding: 12px 16px;
`;

const IconWrapper = styled.span`
  display: inline-flex;
  margin-right: 12px;
`;

const Title = styled.header`
  display: flex;
  align-items: center;
  color: #ff474f;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
`;

const RankingList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StatusMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  padding: 32px 16px;
  font-size: 15px;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
  white-space: pre-line;
`;
