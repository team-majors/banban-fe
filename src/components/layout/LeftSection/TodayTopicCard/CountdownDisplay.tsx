import styled from "styled-components";

export default function CountdownDisplay() {
  const COUNTDOWN_TIME = "14:29:09";
  const VOTING_PERIOD = "00:00~23:59까지 투표 가능";

  return (
    <CountdownSection>
      <CountdownText>⏰ 남은 시간: {COUNTDOWN_TIME}</CountdownText>
      <CountdownDescription>{VOTING_PERIOD}</CountdownDescription>
    </CountdownSection>
  );
}

const CountdownSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 4px;
  text-align: center;
`;

const CountdownText = styled.div`
  font-size: 1.25rem;
  color: #00000060;
`;

const CountdownDescription = styled.div`
  font-size: 0.75rem;
  color: #00000030;
`;
