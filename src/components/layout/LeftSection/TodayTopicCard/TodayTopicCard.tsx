import { SelectOptionGroup } from "@/components/common/SelectOptionGroup";

import styled from "styled-components";
import VoteResultCircle from "./VoteResultCircle/VoteResultCircle";
import { selectOption } from "@/components/common/SelectOptionGroup/SelectOptionGroup";

export default function TodayTopicCard() {
  const topic = "둘 중 어떻게 살고싶은가...?";
  return (
    <Container>
      <TitleSection>
        <TitleLabel>🔥 오늘의 주제는 :</TitleLabel>
        <TopicTitle as="h2">{topic}</TopicTitle>
      </TitleSection>

      <VoteResultCircleContainer>
        <VoteResultCircle />
      </VoteResultCircleContainer>

      <CountdownSection>
        <CountdownText>⏰ 남은 시간: 14:29:09</CountdownText>
        <CountdownDescription>00:00~23:59까지 투표 가능</CountdownDescription>
      </CountdownSection>

      <SelectOptionGroup
        rowGap="10px"
        firstOptionString="24시간 자유, 월 300씩 들어오는 백수"
        secondOptionString="주 52시간 근무, 월급 600 직장인"
        onChange={(state: selectOption) => {
          //TODO: onChange시 실행할 함수 임시 작성
          if (state === "firstOption") {
            return "firstOption";
          } else if (state === "secondOption") return "secondOption";
          else return "none";
        }}
      />
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 340px;
  max-width: 430px;
  background-color: white;
  border-radius: 8px;
  padding: 20px 16px;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleLabel = styled.div`
  font-weight: 600;
  padding: 10px;
`;

const TopicTitle = styled.div`
  width: 100%;
  padding: 10px;
  font-weight: 900;
  font-size: 24px;
  text-align: center;
`;

const CountdownSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 4px;
  text-align: center;
`;

const CountdownText = styled.div`
  font-size: 20px;
  color: #00000060;
`;

const CountdownDescription = styled.div`
  font-size: 10px;
  color: #00000030;
`;

const VoteResultCircleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 8px;
  padding: 0px 10px;
  max-height: 280px;
`;
