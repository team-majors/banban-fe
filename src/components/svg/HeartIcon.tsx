import { SVGProps } from "react";
import styled, { css } from "styled-components";

interface HeartProps extends SVGProps<SVGSVGElement> {
  $isActive: boolean;
}

const pathD =
  "M3.65625 1.2515C1.71848 1.2515 0.135422 2.80853 0.135422 4.74389C0.135422 5.46961 0.281538 6.64892 1.08706 8.04635C1.89035 9.43993 3.3281 11.0136 5.8542 12.5666C6.05 12.69 6.27 12.75 6.5 12.75C6.73 12.75 6.95 12.69 7.1458 12.5666C9.6719 11.0136 11.11 9.43993 11.913 8.04635C12.7185 6.64892 12.8646 5.46961 12.8646 4.74389C12.8646 2.80853 11.2815 1.2515 9.34375 1.2515C8.32287 1.2515 7.45915 1.79773 6.90093 2.2604L6.5 2.623L6.09907 2.2604C5.54086 1.79773 4.67714 1.2515 3.65625 1.2515Z";

export default function HeartIcon({ $isActive }: HeartProps) {
  return (
    <HeartSvg
      $isActive={$isActive}
      viewBox="-1 -1 15 16"
    >
      <path d={pathD} />
    </HeartSvg>
  );
}

const HeartSvg = styled.svg<{ $isActive: boolean }>`
  width: 13px;
  height: 14px;
  cursor: pointer;
  transform-origin: center;

  transition: fill 0.25s ease, stroke 0.25s ease,
    transform 0.25s cubic-bezier(0.25, 1.5, 0.5, 1);

  ${({ $isActive }) =>
    $isActive
      ? css`
          fill: #ff8b8b;
          stroke: transparent;
          transform: scale(1.15);
        `
      : css`
          fill: transparent;
          stroke: #767676;
          stroke-width: 1.5px;
        `}
`;
