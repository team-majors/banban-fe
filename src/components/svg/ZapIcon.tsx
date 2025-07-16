import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

export default function ZapIcon(props: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.8333 1.66663L2.5 11.6666H10L9.16667 18.3333L17.5 8.33329H10L10.8333 1.66663Z"
        stroke="#FF474F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
