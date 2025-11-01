"use client";
import styled from "styled-components";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useUpdateUsername } from "@/hooks/useUpdateUsername";
import { useUploadProfileImage } from "@/hooks/useUploadProfileImage";
import { useDeleteProfileImage } from "@/hooks/useDeleteProfileImage";
import { useToast } from "../common/Toast/useToast";
import { Modal } from "../common/Modal";
import { ProfileImageEditor } from "./ProfileImageEditor";
import { ProfileInfoForm } from "./ProfileInfoForm";

export const ProfileEditModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { mutate: updateUsername, isPending: isUsernameUpdating } =
    useUpdateUsername();
  const uploadProfileImageMutation = useUploadProfileImage();
  const deleteProfileImageMutation = useDeleteProfileImage();
  const [newUsername, setNewUsername] = useState(user?.username);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

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

  const isLoading =
    isUsernameUpdating ||
    uploadProfileImageMutation.isPending ||
    deleteProfileImageMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCloseButton={true} width="400px">
      <Modal.Layout>
        <ModalHeader>
          <ModalTitle>프로필 편집</ModalTitle>
        </ModalHeader>

        <ContentWrapper>
          <LeftSection>
            <ProfileImageEditor
              imageUrl={user?.profileImageUrl}
              pendingFile={pendingFile}
              isDeleted={isDeleted}
              onFileSelect={(file) => {
                setPendingFile(file);
                setIsDeleted(false);
              }}
              onDelete={() => {
                setIsDeleted(true);
                setPendingFile(null);
              }}
            />
          </LeftSection>

          <RightSection>
            <ProfileInfoForm
              username={user?.username}
              newUsername={newUsername}
              onUsernameChange={setNewUsername}
            />
          </RightSection>
        </ContentWrapper>

        <Modal.Actions direction="row">
          <Modal.Button $variant="secondary" onClick={onClose}>
            취소
          </Modal.Button>
          <Modal.Button
            disabled={isLoading || !newUsername}
            onClick={handleSave}
          >
            {isLoading ? "저장 중" : "저장"}
          </Modal.Button>
        </Modal.Actions>
      </Modal.Layout>
    </Modal>
  );
};

const ModalHeader = styled.div`
  margin-bottom: 24px;
`;

const ModalTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #181d27;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  margin-bottom: 24px;
`;

const LeftSection = styled.div`
  width: 100%;
  height: 144px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
`;

const RightSection = styled.div`
  width: 100%;
`;
