"use client";
import styled from "styled-components";
import { Input } from "../common/Input";
import { useState } from "react";
import ProfileImageContainer from "./ProfileImageContainer";
import useAuth from "@/hooks/useAuth";
import { useUpdateUsername } from "@/hooks/useUpdateUsername";
import { useToast } from "../common/Toast/useToast";

export const ProfileEditCard = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { mutate, isPending } = useUpdateUsername();
  const [newUsername, setNewUsername] = useState(user?.username);

  const handleSaveUsername = () => {
    if (newUsername && newUsername !== user?.username) {
      mutate(
        { username: newUsername },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (err) => {
            console.error(err);
            showToast({
              type: "error",
              message: "프로필 수정 실패: " + (err as Error).message,
              duration: 3000,
            });
          },
        },
      );
    }
  };

  return (
    <Container>
      <ProfileHeader>
        <ProfileTitle>프로필</ProfileTitle>
      </ProfileHeader>

      <ProfileContent>
        <ProfileImageContainer imageUrl={user?.profileImageUrl} />
        <ProfileUserName>@{user?.username}</ProfileUserName>

        <NicknameSection>
          <Input>
            <StyledLabel>닉네임</StyledLabel>
            <Input.Field
              $isValidate={true}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </Input>
          <NicknameNotice>
            <SmallText>
              닉네임은 7일(168 시간)마다 한 번만 변경할 수 있어요.
            </SmallText>
            <MediumText>다음 변경 가능: 2025-06-22 11:22 KST</MediumText>
          </NicknameNotice>
        </NicknameSection>
        <ButtonWrapper>
          <StyledButton onClick={onClose}>취소</StyledButton>
          <StyledButton
            disabled={
              isPending || newUsername == user?.username || !newUsername
            }
            onClick={handleSaveUsername}
          >
            {isPending ? "저장 중" : "저장"}
          </StyledButton>
        </ButtonWrapper>
      </ProfileContent>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 56px;
  right: 0;
  background-color: white;
  width: 350px;
  height: 448px;
  border-radius: 8px;
  flex-direction: column;
  border: solid 1px #e9eaeb;
  box-shadow: 0px 12px 16px -4px rgba(10, 13, 18, 0.08);
`;

const ProfileHeader = styled.div`
  padding: 16px;
  border-bottom: solid 1px #e9eaeb;
`;

const ProfileTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  padding-bottom: 0;
`;

const ProfileUserName = styled.h2`
  color: #181d27;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  margin-top: 8px;
`;

const NicknameSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 8px;
`;

const StyledLabel = styled(Input.Label)`
  color: #414651;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const NicknameNotice = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 0px;
`;

const SmallText = styled.h6`
  font-size: 10px;
  line-height: 20px;
  color: #8f9098;
`;

const MediumText = styled.h4`
  font-size: 14px;
  line-height: 20px;
  color: #8f9098;
`;

const StyledButton = styled.button<{ disabled?: boolean | undefined }>`
  align-self: flex-end;
  padding: 8px 14px;
  color: ${({ disabled }) => (disabled ? "#bec0c3" : "#414651")};
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #d5d7da;
  border-radius: 8px;
  box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);
  cursor: ${({ disabled }) => (disabled ? "" : "pointer")};
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: end;
`;
