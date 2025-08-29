"use client";

import { useState, useCallback } from "react";
import styled from "styled-components";
import { Avatar } from "../Avatar/Avatar";
import { CloseIcon } from "@/components/svg";
import { DefaultButton } from "../Button/Default/DefaultButton";
import { UserInfoLoader } from "./UserInfoLoader";

interface TargetUser {
  nickname: string;
  description: string;
  avatarUrl: string;
  highlightText?: string; // 강조할 텍스트
}

interface FloatingInputModalProps {
  onClose: () => void;
  onSubmit: (content: string) => void;
  userId: string | number; // 유저 ID로 변경
  actionType?: "댓글" | "피드"; // 등록할 콘텐츠 타입
}

export const FloatingInputModal = ({
  onClose,
  onSubmit,
  userId,
  actionType = "댓글",
}: FloatingInputModalProps) => {
  const [content, setContent] = useState("");
  const [targetUser, setTargetUser] = useState<TargetUser | null>(null);

  const handleSubmit = useCallback(() => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent("");
    }
  }, [content, onSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      onClose();
    }
  }, [handleSubmit, onClose]);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);

  const handleUserLoaded = useCallback((user: TargetUser) => {
    setTargetUser(user);
  }, []);

  const handleUserError = useCallback((error: Error) => {
    console.error("Failed to load user info:", error);
    // 에러 처리 로직 추가 가능
  }, []);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {/* 상단 헤더 */}
        <Header>
          <CloseButton onClick={onClose}>
            <CloseIcon width={20} height={20} />
          </CloseButton>
          <Title>
            <ActionTypeText>{actionType}</ActionTypeText>
            <ActionText>등록하기</ActionText>
          </Title>
          <HeaderSpacer />
        </Header>

        {/* 대상 정보 영역 - UserInfoLoader로 분리 */}
        <UserInfoLoader
          userId={userId}
          onUserLoaded={handleUserLoaded}
          onError={handleUserError}
        >
          {targetUser && (
            <TargetInfo>
              <Avatar
                src={targetUser.avatarUrl}
                alt={`${targetUser.nickname}의 프로필 이미지`}
                size={48}
              />
              <UserInfo>
                <Nickname>@{targetUser.nickname}</Nickname>
                <Description>
                  {targetUser.description}
                </Description>
              </UserInfo>
            </TargetInfo>
          )}
        </UserInfoLoader>

        {/* 입력 영역 */}
        <InputSection>
          <TextInput
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            placeholder="당신의 의견을 들려주세요!"
            rows={4}
          />
        </InputSection>

        {/* 하단 버튼 */}
        <Footer>
          <DefaultButton
            isActive={!!content.trim()}
            onClick={handleSubmit}
          >
            보내기
          </DefaultButton>
        </Footer>
      </ModalContainer>
    </ModalOverlay>
  );
};

// 스타일 컴포넌트들
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  z-index: 1000;
  padding: 20px;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #E9EAEB;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0px 12px 16px -4px rgba(10, 13, 18, 0.08), 0px 4px 6px -2px rgba(10, 13, 18, 0.03);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionTypeText = styled.span`
  color: #2563eb;
`;

const ActionText = styled.span`
  color: #111827;
`;

const HeaderSpacer = styled.div`
  width: 32px;
`;

const TargetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Nickname = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const Description = styled.span`
  font-size: 14px;
  color: #6b7280;

  span {
    color: #ec4899;
    font-weight: 500;
  }
`;

const InputSection = styled.div`
  padding: 0 20px;
  flex: 1;
`;

const TextInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.5;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Footer = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
`;
