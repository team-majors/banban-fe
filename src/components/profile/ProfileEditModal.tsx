"use client";
import styled from "styled-components";
import { useState, useMemo } from "react";
import useAuth from "@/hooks/auth/useAuth";
import { useUpdateUsername } from "@/hooks/api/user/useUpdateUsername";
import { useUploadProfileImage } from "@/hooks/api/user/useUploadProfileImage";
import { useDeleteProfileImage } from "@/hooks/api/user/useDeleteProfileImage";
import { getDefaultProfileImagePreview } from "@/remote/user";
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
  const [defaultImagePreviewUrl, setDefaultImagePreviewUrl] = useState<
    string | null
  >(null);

  // 초기 상태의 기본 이미지 URL 저장 (커스텀이 아닐 때)
  const defaultImageUrl = useMemo(() => {
    return user?.hasCustomProfileImage ? null : user?.profileImageUrl;
  }, [user?.hasCustomProfileImage, user?.profileImageUrl]);

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
      setDefaultImagePreviewUrl(null);

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

  const hasChanges = useMemo(() => {
    const hasUsernameChange = newUsername && newUsername !== user?.username;
    const hasImageChange = pendingFile !== null || isDeleted;
    return hasUsernameChange || hasImageChange;
  }, [newUsername, user?.username, pendingFile, isDeleted]);

  const handleClose = () => {
    setPendingFile(null);
    setIsDeleted(false);
    setDefaultImagePreviewUrl(null);
    setNewUsername(user?.username);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isCloseButton={true}
      width="400px"
    >
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
              hasCustomProfileImage={user?.hasCustomProfileImage}
              defaultImageUrl={defaultImagePreviewUrl || defaultImageUrl}
              onFileSelect={(file) => {
                setPendingFile(file);
                setIsDeleted(false);
              }}
              onDelete={async () => {
                try {
                  const previewUrl = await getDefaultProfileImagePreview();
                  setDefaultImagePreviewUrl(previewUrl);
                  setIsDeleted(true);
                  setPendingFile(null);
                } catch {
                  showToast({
                    type: "error",
                    message: "기본 이미지 조회 실패",
                    duration: 2000,
                  });
                }
              }}
            />
          </LeftSection>

          <RightSection>
            <ProfileInfoForm
              newUsername={newUsername}
              onUsernameChange={setNewUsername}
            />
          </RightSection>
        </ContentWrapper>

        <Modal.Actions direction="column">
          <Modal.Button
            disabled={isLoading || !newUsername || !hasChanges}
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
