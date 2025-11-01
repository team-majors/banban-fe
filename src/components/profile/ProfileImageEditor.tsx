"use client";
import styled from "styled-components";
import Image from "next/image";
import { useRef, useState } from "react";
import { EditIcon } from "@/components/svg";

interface ProfileImageEditorProps {
  imageUrl?: string | null;
  pendingFile?: File | null;
  isDeleted?: boolean;
  hasCustomProfileImage?: boolean;
  defaultImageUrl?: string | null;
  onFileSelect: (file: File) => void;
  onDelete: () => void;
}

export const ProfileImageEditor = ({
  imageUrl,
  pendingFile,
  isDeleted,
  hasCustomProfileImage,
  defaultImageUrl,
  onFileSelect,
  onDelete,
}: ProfileImageEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newImage, setNewImage] = useState<string | undefined>(undefined);
  const [hasError, setHasError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const displayImage = isDeleted
    ? defaultImageUrl || null
    : newImage
    ? newImage
    : !hasError && imageUrl
    ? imageUrl
    : null;

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSize = 800;
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            "image/jpeg",
            0.85
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 체크
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/bmp",
    ];
    if (!validTypes.includes(file.type)) {
      console.error("이미지 파일이 아닙니다.");
      return;
    }

    // 5MB 초과 시 압축
    const processedFile = file.size > 5 * 1024 * 1024 ? await compressImage(file) : file;

    const url = URL.createObjectURL(processedFile);
    setNewImage(url);
    setHasError(false);
    onFileSelect(processedFile);
    setShowMenu(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteClick = () => {
    setNewImage(undefined);
    setHasError(false);
    onDelete();
    setShowMenu(false);
  };

  return (
    <Container>
      <ImageWrapper onClick={handleUploadClick}>
        {displayImage ? (
          <StyledImage
            src={displayImage}
            alt="프로필 이미지"
            width={120}
            height={120}
            onError={() => setHasError(true)}
            unoptimized={true}
          />
        ) : (
          <DefaultAvatar />
        )}
        <HoverOverlay>
          <OverlayText>편집</OverlayText>
        </HoverOverlay>
      </ImageWrapper>

      {(hasCustomProfileImage || pendingFile) && !isDeleted && (
        <RemoveButton onClick={handleDeleteClick}>제거</RemoveButton>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg, image/jpg, image/bmp, image/webp, image/png, image/gif"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const HoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const OverlayText = styled.span`
  color: white;
  font-size: 15px;
  font-weight: 600;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;

  &:hover ${HoverOverlay} {
    opacity: 1;
  }
`;

const StyledImage = styled(Image)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #8f9098;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s;

  &:hover {
    color: #ff4757;
  }
`;

const DefaultAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #e9eaeb;
`;
