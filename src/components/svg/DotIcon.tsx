type IconProps = React.SVGProps<SVGSVGElement>;

export const DotIcon = (props: IconProps) => {
  return (
    <svg
      data-testid="dot-indicator"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="0.5" y="0.5" width="9" height="9" rx="4.5" fill="#FF000D" />
      <rect x="0.5" y="0.5" width="9" height="9" rx="4.5" stroke="white" />
    </svg>
  );
};
