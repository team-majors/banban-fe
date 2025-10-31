"use client";
import styled from "styled-components";
import { Input } from "../common/Input";
import { useRef, useState } from "react";
import ProfileImageContainer from "./ProfileImageContainer";
import useAuth from "@/hooks/useAuth";
import { useUpdateUsername } from "@/hooks/useUpdateUsername";
import { useUploadProfileImage } from "@/hooks/useUploadProfileImage";
import { useDeleteProfileImage } from "@/hooks/useDeleteProfileImage";
import { useToast } from "../common/Toast/useToast";
import { DefaultButton } from "../common/Button";
import { getProfileImageUrl } from "@/remote/user";

export const ProfileEditCard = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { mutate: updateUsername, isPending: isUsernameUpdating } = useUpdateUsername();
  const uploadProfileImageMutation = useUploadProfileImage();
  const deleteProfileImageMutation = useDeleteProfileImage();
  const [newUsername, setNewUsername] = useState(user?.username);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isImageEditMode, setIsImageEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    const hasUsernameChange = newUsername && newUsername !== user?.username;
    const hasImageChange = pendingFile || isDeleted;

    if (!hasUsernameChange && !hasImageChange) {
      onClose();
      return;
    }

    try {
      if (hasImageChange) {
        if (isDeleted) {
          await deleteProfileImageMutation.mutateAsync();
        } else if (pendingFile) {
          await uploadProfileImageMutation.mutateAsync({ file: pendingFile });
        }
      }

      if (hasUsernameChange) {
        await new Promise((resolve, reject) => {
          updateUsername(
            { username: newUsername },
            {
              onSuccess: resolve,
              onError: reject,
            },
          );
        });
      }

      setPendingFile(null);
      setIsDeleted(false);
      setIsImageEditMode(false);
      
      showToast({
        type: "success",
        message: "프로필이 업데이트되었습니다.",
        duration: 3000,
      });
      onClose();
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        message: "프로필 수정 실패: " + (err as Error).message,
        duration: 3000,
      });
    }
  };

  const handleDeleteImage = () => {
    setIsDeleted(true);
    setPendingFile(null);
    setIsImageEditMode(false);
  };

  return (
    <Container>
      <ProfileHeader>
        <ProfileTitle>{isImageEditMode ? "프로필 이미지 편집" : "프로필"}</ProfileTitle>
      </ProfileHeader>

      <ProfileContent>
        <ProfileImageContainer 
          imageUrl={user?.profileImageUrl} 
          hasCustomImage={user?.hasCustomProfileImage}
          pendingFile={pendingFile}
          setPendingFile={setPendingFile}
          isDeleted={isDeleted}
          setIsDeleted={setIsDeleted}
          onEditClick={() => setIsImageEditMode(true)}
        />
        <ProfileUserName>@{user?.username}</ProfileUserName>

        {isImageEditMode ? (
          <ImageEditSection>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/jpg, image/bmp, image/webp, image/png, image/gif"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPendingFile(file);
                  setIsDeleted(false);
                  setIsImageEditMode(false);
                }
                e.target.value = '';
              }}
            />
            <ImageEditButton onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}>
              이미지 등록
            </ImageEditButton>
            <ImageEditButton onClick={(e) => {
              e.stopPropagation();
              handleDeleteImage();
            }}>
              기본 이미지 사용하기
            </ImageEditButton>
          </ImageEditSection>
        ) : (
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
        )}
        <ButtonWrapper>
          <DefaultButton onClick={() => {
            if (isImageEditMode) {
              setIsImageEditMode(false);
            } else {
              setPendingFile(null);
              setIsDeleted(false);
              setIsImageEditMode(false);
              onClose();
            }
          }}>{isImageEditMode ? "뒤로" : "취소"}</DefaultButton>
          <DefaultButton
            disabled={
              isUsernameUpdating ||
              uploadProfileImageMutation.isPending ||
              deleteProfileImageMutation.isPending ||
              !newUsername
            }
            onClick={handleSave}
          >
            {isUsernameUpdating ||
            uploadProfileImageMutation.isPending ||
            deleteProfileImageMutation.isPending
              ? "저장 중"
              : "저장"}
          </DefaultButton>
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
  z-index: 950;
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

const ButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: end;
`;

const ImageEditSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 8px;
  padding: 16px 0;
`;

const ImageEditButton = styled.button`
  width: 100%;
  padding: 14px;
  border: 1px solid #e9eaeb;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f4f6f8;
    border-color: #d5d7da;
  }
`;
