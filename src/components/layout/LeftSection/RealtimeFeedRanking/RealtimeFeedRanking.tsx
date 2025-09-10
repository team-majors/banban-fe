import ZapIcon from "@/components/svg/ZapIcon";
import styled from "styled-components";
import RankingItem from "./RankingItem";
import useHotFeed from "@/hooks/useHotFeed";
import { HotFeed } from "@/remote/feed";
import { useMemo } from "react";

export default function RealtimeFeedRanking() {
  const { data } = useHotFeed();

  const sortedFeeds = useMemo(
    () => (data ? [...data].sort((a, b) => a.rank - b.rank) : []),
    [data],
  );

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
          <li key={item.feed_id}>
            <RankingItem
              rank={item.rank}
              title={item.content}
              figure={item.rank_change}
            />
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
