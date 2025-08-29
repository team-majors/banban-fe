import { QuestionMarks } from "@/components/svg";
import styled from "styled-components";

export default function VoteResultPlaceHolder() {
  return (
    <Circle>
      <QuestionMarks />
      <Container>
        <Words>결과는 투표후 공개 !</Words>
        <ThickWords>당신의 선택은?</ThickWords>
      </Container>
    </Circle>
  );
}

const Words = styled.span`
  font-size: 18px;
  color: white;
`;

const ThickWords = styled(Words)`
  font-weight: 700;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Circle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(circle, #3f13ff 0%, #3610db 100%);
`;
