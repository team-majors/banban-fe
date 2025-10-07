import ZapIcon from "@/components/svg/ZapIcon";
import styled from "styled-components";
import RankingItem from "./RankingItem";
import useHotFeed from "@/hooks/useHotFeed";
import { useMemo } from "react";
import { HotFeed } from "@/types/feeds";

export default function RealtimeFeedRanking() {
  const { data } = useHotFeed();

  const sortedFeeds = useMemo(
    () => (data ? [...data].sort((a, b) => a.rank - b.rank) : []),
    [data],
  );

  const restNum = 5 - sortedFeeds.length;

  return (
    <Container>
      <Title>
        <IconWrapper>
          <ZapIcon />
        </IconWrapper>
        실시간 피드 순위
      </Title>
      <RankingList>
        {sortedFeeds.map((item: HotFeed) => (
          <li key={item.feedId}>
            <RankingItem
              rank={item.rank}
              title={item.content}
              figure={item.rankChange}
            />
          </li>
        ))}
        {Array.from({ length: restNum }, (_, index) => (
          <li key={index}>
            <RankingItem rank={sortedFeeds.length + index + 1} title={"-"} figure={0} />
          </li>
        ))}
      </RankingList>
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
