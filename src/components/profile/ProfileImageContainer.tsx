import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import styled from "styled-components";
import { useToast } from "../common/Toast/useToast";

export interface RegisterRequestType {
  email: string;
  name: string;
  accountId: string;
  profileImageUrl: File | string | null;
  termsOfServiceConsent: boolean;
  privacyPolicyConsent: boolean;
}

export default function ProfileImageContainer({
  imageUrl,
  setImageUrl,
  hasCustomImage,
  pendingFile,
  setPendingFile,
  isDeleted,
  setIsDeleted,
  onEditClick,
  defaultImageUrl,
}: {
  imageUrl?: string | null;
  setImageUrl?: React.Dispatch<React.SetStateAction<RegisterRequestType>>;
  hasCustomImage?: boolean;
  pendingFile?: File | null;
  setPendingFile?: (file: File | null) => void;
  isDeleted?: boolean;
  setIsDeleted?: (deleted: boolean) => void;
  onEditClick?: () => void;
  defaultImageUrl?: string | null;
}) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newImage, setNewImage] = useState<string | undefined>(undefined);
  const [hasError, setHasError] = useState(false);

  // 프로필 편집 모드인지 회원가입 모드인지 판단
  const isProfileEditMode = setPendingFile !== undefined;

  // 초기 상태의 기본 이미지 URL 저장 (커스텀이 아닐 때)
  const defaultImage = useMemo(() => {
    return hasCustomImage ? null : imageUrl;
  }, [hasCustomImage, imageUrl]);

  const displayImage = isDeleted
    ? (defaultImageUrl || defaultImage || "/no_img.png")
    : newImage
    ? newImage
    : !hasError && imageUrl
    ? imageUrl
    : "/no_img.png";

  const handleImageClick = () => {
    if (isProfileEditMode && onEditClick) {
      onEditClick();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFile = e.target?.files?.[0];
    if (!inputFile) return;
    const getFileExt = (fileName: string) => {
      const ext = fileName.split(".").pop()?.toLowerCase();
      if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "webp") {
        return ext;
      }
      return null;
    };

    if (inputFile.size > 5 * 1024 * 1024) {
      showToast({
        type: "error",
        message: "파일 크기는 5MB를 초과할 수 없습니다.",
      });
      return;
    }

    const ext = getFileExt(inputFile.name);
    if (!ext) {
      showToast({ type: "error", message: "이미지 파일이 아닙니다." });
      return;
    }

    try {
      const { compressImage } = await import("@/utils/compress");
      const convertedFile = await compressImage(inputFile);
      if (!convertedFile) return;
      const imageUrl = URL.createObjectURL(convertedFile);

      setNewImage(imageUrl);
      setHasError(false);

      // 프로필 편집 모드: 미리보기만
      if (isProfileEditMode && setPendingFile && setIsDeleted) {
        setPendingFile(convertedFile);
        setIsDeleted(false);
      }
      // 회원가입 모드: 상태에 저장
      else if (setImageUrl) {
        setImageUrl((prev) => ({
          ...prev,
          profileImageUrl: convertedFile,
        }));
      }
    } catch (error) {
      console.error("Error processing file:", error);
      showToast({ type: "error", message: "처리중 오류가 발생했습니다." });
    }
  };

  useEffect(() => {
    if (!pendingFile) {
      setNewImage(undefined);
    } else if (pendingFile && isProfileEditMode) {
      const url = URL.createObjectURL(pendingFile);
      setNewImage(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [pendingFile, isProfileEditMode]);

  useEffect(() => {
    if (isDeleted) {
      setNewImage(undefined);
    }
  }, [isDeleted]);





  return (
    <Container>
      <ProfileImageWrapper onClick={handleImageClick}>
        <StyledProfileImage
          width={92}
          height={92}
          src={(displayImage ?? "/no_img.png") as string}
          alt="upload_image"
          onError={() => {
            setHasError(true);
          }}
          unoptimized={true}

        />
        {isProfileEditMode && (
          <ImageOverlay>
            <OverlayText>편집</OverlayText>
          </ImageOverlay>
        )}
      </ProfileImageWrapper>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg, image/jpg, image/bmp, image/webp, image/png, image/gif"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </Container>
  );
}

const ProfileImageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 4px;
  width: 100px;
  height: 100px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0px 12px 16px -4px rgba(10, 13, 18, 0.08);
  overflow: hidden;
  cursor: pointer;
`;

const StyledProfileImage = styled(Image)`
  border-radius: 50%;
  object-fit: cover;
`;

const Container = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;



const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  
  ${ProfileImageWrapper}:hover & {
    opacity: 1;
  }
`;

const OverlayText = styled.span`
  color: white;
  font-size: 14px;
  font-weight: 600;
`;
