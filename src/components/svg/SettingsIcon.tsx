type IconProps = React.SVGProps<SVGSVGElement>;

export const SettingsIcon = (props: IconProps) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="8" cy="8" r="2.5" stroke="#414651" strokeWidth="1.5" />
      <path
        d="M8 1.5V2.5M8 13.5V14.5M2.5 8H1.5M14.5 8H13.5M3.44 3.44L2.73 2.73M12.56 12.56L13.27 13.27M3.44 12.56L2.73 13.27M12.56 3.44L13.27 2.73"
        stroke="#414651"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
