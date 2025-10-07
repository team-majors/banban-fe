import { useState, useEffect } from "react";
import styled from "styled-components";

export default function CountdownDisplay() {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const VOTING_PERIOD = "00:00~23:59까지 투표 가능";

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();

      // 한국 시간으로 변환 (toLocaleString 사용)
      const koreaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));

      // 오늘 자정까지 계산
      const midnight = new Date(koreaTime);
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight.getTime() - koreaTime.getTime();

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        setTimeLeft(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
      } else {
        setTimeLeft("00:00:00");
      }
    };

    // 초기 계산
    calculateTimeLeft();

    // 1초마다 업데이트
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <CountdownSection>
      <CountdownText>⏰ 남은 시간: {timeLeft}</CountdownText>
      <CountdownDescription>{VOTING_PERIOD}</CountdownDescription>
    </CountdownSection>
  );
}

const CountdownSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
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
