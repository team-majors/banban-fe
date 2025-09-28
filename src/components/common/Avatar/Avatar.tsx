import { getUserProfileImage } from "@/remote/user";
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
    async function fetchAvatar() {
      const res = await getUserProfileImage({ url: src });
      setUrl(res.data);
    }
    fetchAvatar();
  }, [src]);

  return (
    <GradientBorder background={background}>
      <StyledImageWrapper size={size}>
        <Image
          role="img"
          src={url ? url : src}
          alt={alt}
          width={size}
          height={size}
          style={{
            objectFit: url ? "contain" : "cover",
            width: "60%",
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
  border-radius: 16px;
  background: ${({ background }) =>
    background || "linear-gradient(to right, #ec4899, #d946ef)"};
`;

const StyledImageWrapper = styled.div<StyledImageWrapperProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ size }) => size || 40}px;
  height: ${({ size }) => size || 40}px;
  border-radius: 14px;
  overflow: hidden;
  background-color: white;
`;
