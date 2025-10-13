import { useEffect, useState } from "react";
import { compressImage } from "@/utils/compress";
import Image from "next/image";
import styled from "styled-components";
import { AddIcon } from "../svg";
import { useToast } from "../common/Toast/useToast";
import { useUploadProfileImage } from "@/hooks/useUploadProfileImage";

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
}: {
  imageUrl?: string | null;
  setImageUrl?: React.Dispatch<React.SetStateAction<RegisterRequestType>>;
}) {
  const { showToast } = useToast();
  const [newImage, setNewImage] = useState<string | undefined>(undefined);
  const uploadProfileImageMutation = useUploadProfileImage();

  // 프로필 편집 모드인지 회원가입 모드인지 판단
  const isProfileEditMode = !setImageUrl;

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

    // 파일 크기 검증 (5MB)
    if (inputFile.size > 5 * 1024 * 1024) {
      showToast({ type: "error", message: "파일 크기는 5MB를 초과할 수 없습니다." });
      return;
    }

    if (inputFile) {
      const ext = getFileExt(inputFile.name);
      if (!ext) {
        showToast({ type: "error", message: "이미지 파일이 아닙니다." });
        return null;
      }
      let imageUrl: string | null = null;

      try {
        if (ext) {
          const convertedFile = await compressImage(inputFile);
          console.log(convertedFile);
          if (!convertedFile) return;
          imageUrl = URL.createObjectURL(convertedFile);

          // 프로필 편집 모드일 때: 즉시 API 호출
          if (isProfileEditMode) {
            uploadProfileImageMutation.mutate(
              { file: convertedFile },
              {
                onSuccess: () => {
                  showToast({
                    type: "success",
                    message: "프로필 이미지가 업데이트되었습니다.",
                    duration: 3000,
                  });
                },
                onError: (error) => {
                  console.error("프로필 이미지 업로드 실패:", error);
                  showToast({
                    type: "error",
                    message: "프로필 이미지 업로드에 실패했습니다.",
                    duration: 3000,
                  });
                  return;
                },
              }
            );
          }
        } else {
          imageUrl = URL.createObjectURL(inputFile);
        }
        setNewImage(imageUrl);

        // 회원가입 모드일 때: 상태에 저장
        if (setImageUrl) {
          setImageUrl((prev) => ({
            ...prev,
            profileImageUrl: inputFile,
          }));
        }
      } catch (error) {
        console.error("Error processing file:", error);
        showToast({ type: "error", message: "처리중 오류가 발생했습니다." });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (newImage) {
        URL.revokeObjectURL(newImage);
      }
    };
  }, [newImage]);

  return (
    <Container>
      <ProfileImageWrapper>
        {imageUrl || newImage ? (
          <StyledProfileImage
            width={92}
            height={92}
            src={imageUrl || newImage || ""}
            alt="upload_image"
          />
        ) : (
          <PhotoIcon />
        )}
      </ProfileImageWrapper>

      <label
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          opacity: uploadProfileImageMutation.isPending ? 0.5 : 1,
          cursor: uploadProfileImageMutation.isPending ? "not-allowed" : "pointer",
        }}
      >
        <input
          type="file"
          accept="image/jpeg, image/jpg, image/bmp, image/webp, image/png, image/gif"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploadProfileImageMutation.isPending}
        />
        <Wrapper>
          {uploadProfileImageMutation.isPending ? (
            <span style={{ fontSize: "10px", color: "white" }}>...</span>
          ) : (
            <AddIcon width={15} height={15} color="white" />
          )}
        </Wrapper>
      </label>
    </Container>
  );
}

function PhotoIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="icon">
        <path
          id="Icon"
          d="M3.41789 18.6054C3.02737 18.9959 3.02737 19.6291 3.41789 20.0196C3.80842 20.4101 4.44158 20.4101 4.83211 20.0196L3.41789 18.6054ZM8.625 14.8125L9.33211 14.1054C8.94158 13.7149 8.30842 13.7149 7.91789 14.1054L8.625 14.8125ZM10.875 17.0625L10.1679 17.7696C10.5584 18.1601 11.1916 18.1601 11.5821 17.7696L10.875 17.0625ZM15.9375 12L16.6446 11.2929C16.2541 10.9024 15.6209 10.9024 15.2304 11.2929L15.9375 12ZM19.7304 17.2071C20.1209 17.5976 20.7541 17.5976 21.1446 17.2071C21.5351 16.8166 21.5351 16.1834 21.1446 15.7929L19.7304 17.2071ZM4.83211 20.0196L9.33211 15.5196L7.91789 14.1054L3.41789 18.6054L4.83211 20.0196ZM7.91789 15.5196L10.1679 17.7696L11.5821 16.3554L9.33211 14.1054L7.91789 15.5196ZM11.5821 17.7696L16.6446 12.7071L15.2304 11.2929L10.1679 16.3554L11.5821 17.7696ZM15.2304 12.7071L19.7304 17.2071L21.1446 15.7929L16.6446 11.2929L15.2304 12.7071ZM6.375 4H17.625V2H6.375V4ZM20 6.375V17.625H22V6.375H20ZM17.625 20H6.375V22H17.625V20ZM4 17.625V6.375H2V17.625H4ZM6.375 20C5.06332 20 4 18.9367 4 17.625H2C2 20.0412 3.95875 22 6.375 22V20ZM20 17.625C20 18.9367 18.9367 20 17.625 20V22C20.0412 22 22 20.0412 22 17.625H20ZM17.625 4C18.9367 4 20 5.06332 20 6.375H22C22 3.95875 20.0412 2 17.625 2V4ZM6.375 2C3.95875 2 2 3.95875 2 6.375H4C4 5.06332 5.06332 4 6.375 4V2ZM8.75 8.0625C8.75 8.4422 8.4422 8.75 8.0625 8.75V10.75C9.54677 10.75 10.75 9.54677 10.75 8.0625H8.75ZM8.0625 8.75C7.6828 8.75 7.375 8.4422 7.375 8.0625H5.375C5.375 9.54677 6.57823 10.75 8.0625 10.75V8.75ZM7.375 8.0625C7.375 7.6828 7.6828 7.375 8.0625 7.375V5.375C6.57823 5.375 5.375 6.57823 5.375 8.0625H7.375ZM8.0625 7.375C8.4422 7.375 8.75 7.6828 8.75 8.0625H10.75C10.75 6.57823 9.54677 5.375 8.0625 5.375V7.375Z"
          fill="#D8D8D8"
        />
      </g>
    </svg>
  );
}

const ProfileImageWrapper = styled.div`
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
`;

const StyledProfileImage = styled(Image)`
  border-radius: 50%;
  object-fit: cover;
`;

const Container = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  background-color: #d5d7da;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 100%;
  padding: 8px;
  cursor: pointer;
`;
