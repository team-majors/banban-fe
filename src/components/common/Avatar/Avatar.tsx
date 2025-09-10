import Image from "next/image";
import { useState } from "react";
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
  const [imgSrc, setImgSrc] = useState(src || "/no_img.png");
  return (
    <GradientBorder background={background}>
      <StyledImageWrapper size={size}>
        <Image
          role="img"
          src={imgSrc ? imgSrc : src}
          alt={alt}
          width={size}
          height={size}
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
          onError={() => setImgSrc("/no_img.png")}
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
  width: ${({ size }) => size || 40}px;
  height: ${({ size }) => size || 40}px;
  border-radius: 14px;
  overflow: hidden;
  background-color: white;
`;
