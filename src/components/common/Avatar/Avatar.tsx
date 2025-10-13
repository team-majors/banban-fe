import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface AvatarProps {
  src: string;
  alt: string;
  background?: string;
  size?: number;
}

interface StyledImageWrapperProps {
  size?: number;
}
interface GradientBorderProps {
  background?: string;
}

export const Avatar = ({ src, alt, size, background }: AvatarProps) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    // 이미 전체 URL인 경우 그대로 사용, 상대 경로인 경우에만 API 호출
    if (src.startsWith("http://") || src.startsWith("https://")) {
      setUrl(src);
    } else {
      // 상대 경로인 경우에만 API 호출 (기존 로직)
      async function fetchAvatar() {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api${src.replace("/api", "")}`,
          );
          if (response.ok) {
            const data = await response.json();
            setUrl(data.data);
          } else {
            setUrl("/no_img.png");
          }
        } catch (error) {
          setUrl("/no_img.png");
          console.log(error);
        }
      }
      fetchAvatar();
    }
  }, [src]);

  return (
    <GradientBorder background={background}>
      <StyledImageWrapper size={size}>
        <Image
          role="img"
          src={url || "/no_img.png"}
          alt={alt}
          width={size}
          height={size}
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            objectPosition: "center",
          }}
          onError={() => setUrl("/no_img.png")}
        />
      </StyledImageWrapper>
    </GradientBorder>
  );
};

const GradientBorder = styled.div<GradientBorderProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  border-radius: 50%;
  background: ${({ background }) =>
    background || "linear-gradient(to right, #ec4899, #d946ef)"};
`;

const StyledImageWrapper = styled.div<StyledImageWrapperProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ size }) => size || 54}px;
  height: ${({ size }) => size || 54}px;
  border-radius: 50%;
  overflow: hidden;
  background-color: white;
`;
