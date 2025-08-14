import ZapIcon from "@/components/svg/ZapIcon";
import styled from "styled-components";
import RankingItem from "./RankingItem";

export default function RealtimeFeedRanking() {
  return (
    <Container>
      <Title>
        <IconWrapper>
          <ZapIcon />
        </IconWrapper>
        실시간 피드 순위
      </Title>
      <RankingList>
        <FeedRankingItem
          rank={4}
          title="평생 출근 생각만 해도....."
          figure={-2}
        />
        <FeedRankingItem
          rank={5}
          title="600 받으면서 일하면 부모님한테도 효도할 수 있고, 현실적으로 이게 더 끌린다"
          figure={10}
        />
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

const FeedRankingItem = (props: React.ComponentProps<typeof RankingItem>) => (
  <li>
    <RankingItem {...props} />
  </li>
);
