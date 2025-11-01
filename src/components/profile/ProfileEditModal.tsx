"use client";
import styled from "styled-components";
import {Input} from "../common/Input";
import {useRef, useState} from "react";
import ProfileImageContainer from "./ProfileImageContainer";
import useAuth from "@/hooks/useAuth";
import {useUpdateUsername} from "@/hooks/useUpdateUsername";
import {useUploadProfileImage} from "@/hooks/useUploadProfileImage";
import {useDeleteProfileImage} from "@/hooks/useDeleteProfileImage";
import {useToast} from "../common/Toast/useToast";
import {Modal} from "../common/Modal";

export const ProfileEditModal = ({
                                   isOpen,
                                   onClose,
                                 }: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {user} = useAuth();
  const {showToast} = useToast();
  const {mutate: updateUsername, isPending: isUsernameUpdating} =
      useUpdateUsername();
  const uploadProfileImageMutation = useUploadProfileImage();
  const deleteProfileImageMutation = useDeleteProfileImage();
  const [newUsername, setNewUsername] = useState(user?.username);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);
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
          await uploadProfileImageMutation.mutateAsync({file: pendingFile});
        }
      }

      if (hasUsernameChange) {
        await new Promise((resolve, reject) => {
          updateUsername(
              {username: newUsername},
              {
                onSuccess: resolve,
                onError: reject,
              }
          );
        });
      }

      setPendingFile(null);
      setIsDeleted(false);

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
  };

  const handleImageChange = () => {
    fileInputRef.current?.click();
  };

  return (
      <Modal isOpen={isOpen} onClose={onClose} isCloseButton={true} width="400px">
        <Modal.Layout>
            <ModalTitle>프로필 편집</ModalTitle>

            <ProfileContent>
              <ProfileImageContainer
                  imageUrl={user?.profileImageUrl}
                  hasCustomImage={user?.hasCustomProfileImage}
                  pendingFile={pendingFile}
                  setPendingFile={setPendingFile}
                  isDeleted={isDeleted}
                  setIsDeleted={setIsDeleted}
              />
              <ProfileUserName>@{user?.username}</ProfileUserName>

              <ImageActionsWrapper>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg, image/jpg, image/bmp, image/webp, image/png, image/gif"
                    style={{display: "none"}}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPendingFile(file);
                        setIsDeleted(false);
                      }
                      e.target.value = "";
                    }}
                />
                <ImageActionButton onClick={handleImageChange}>
                  이미지 변경
                </ImageActionButton>
                <Divider>|</Divider>
                <ImageActionButton onClick={handleDeleteImage}>
                  기본 이미지 사용
                </ImageActionButton>
              </ImageActionsWrapper>

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
            </ProfileContent>

            <Modal.Actions direction="row">
              <Modal.Button $variant="secondary" onClick={onClose}>
                취소
              </Modal.Button>
              <Modal.Button
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
              </Modal.Button>
            </Modal.Actions>
        </Modal.Layout>
      </Modal>
  );
};

const ModalTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #181d27;
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const ProfileUserName = styled.h2`
  color: #181d27;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

const ImageActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const ImageActionButton = styled.button`
  background: none;
  border: none;
  color: #3f13ff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: #2d0ab3;
  }

  &:active {
    color: #1f0780;
  }
`;

const Divider = styled.span`
  color: #d5d7da;
  font-weight: 300;
`;

const NicknameSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  margin: 0;
`;

const MediumText = styled.h4`
  font-size: 14px;
  line-height: 20px;
  color: #8f9098;
  margin: 0;
`;
