"use client";

import type React from "react";
import styled from "styled-components";

interface NoTopicStateProps {
  message?: string;
  description?: string;
}

const NoTopicState: React.FC<NoTopicStateProps> = ({
  message = "오늘의 주제가 없습니다",
  description = "주제가 준비되면 알려드릴게요",
}) => {
  return (
    <Container>
      <IconWrapper>
        <EmptyIcon>📭</EmptyIcon>
      </IconWrapper>
      <MessageWrapper>
        <Message>{message}</Message>
        <Description>{description}</Description>
      </MessageWrapper>
      <RetryButton onClick={() => window.location.reload()}>
        새로고침
      </RetryButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  min-height: 400px;
  /* background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%); */
  border-radius: 16px;
  text-align: center;
`;

const IconWrapper = styled.div`
  margin-bottom: 28px;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const EmptyIcon = styled.div`
  font-size: 80px;
  line-height: 1;
  opacity: 0.8;
`;

const Message = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 4px 0;
`;

const Description = styled.p`
  font-size: 16px;
  color: #718096;
  margin: 0 0 32px 0;
  line-height: 1.5;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RetryButton = styled.button`
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default NoTopicState;
