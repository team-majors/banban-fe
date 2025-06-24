import Image from "next/image";
import styled from "styled-components";
import React from "react";

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
  return (
    <GradientBorder background={background}>
      <StyledImageWrapper size={size}>
        <Image
          role="img"
          src={src}
          alt={alt}
          width={size}
          height={size}
          style={{ objectFit: "cover", height: `${size}px` }}
        />
      </StyledImageWrapper>
    </GradientBorder>
  );
};

const GradientBorder = styled.div<GradientBorderProps>`
  display: inline-block;
  padding: 2px;
  border-radius: 16px;
  background: ${({ background }) =>
    background || "linear-gradient(to right, #ec4899, #d946ef)"};
`;

const StyledImageWrapper = styled.div<StyledImageWrapperProps>`
  width: ${({ size }) => size || 40}px;
  height: ${({ size }) => size || 40}px;
  border-radius: 16px;
  overflow: hidden;
  background-color: white;
`;
