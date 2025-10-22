interface ToggleButtonProps {
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  disabled?: boolean;
}

export default function ToggleButton({
                                       isChecked,
                                       onChange,
                                       disabled = false,
                                     }: ToggleButtonProps) {
  const handleChange = () => {
    if (disabled) return;
    onChange(!isChecked);
  };

  const cursorClass = disabled ? "cursor-not-allowed" : "cursor-pointer";
  const labelClassName = (() => {
    if (disabled) {
      return "font-light text-neutral-300 dark:text-neutral-500";
    }
    if (isChecked) {
      return "font-bold text-[#1F2024] dark:text-neutral-50";
    }
    return "font-light text-[#71727a] dark:text-neutral-300";
  })();

  return (
      <label
          className={`inline-flex items-center ${cursorClass} gap-3 select-none`}
      >
      <span className={`text-sm ${labelClassName} select-none`}>
        같은 선택 팀
      </span>
        <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
        />
        <div
            className={`
          relative w-9 h-5 
          ${disabled ? "bg-gray-100" : "bg-gray-200"}
          peer-focus:outline-none peer-focus:ring-blue-300
          dark:peer-focus:ring-blue-800
          rounded-full peer dark:bg-gray-700
          peer-checked:after:translate-x-full
          rtl:peer-checked:after:-translate-x-full
          peer-checked:after:border-white
          after:content-['']
          after:absolute after:top-[2px] after:start-[2px]
          after:bg-white after:border-gray-300 after:border
          after:rounded-full after:h-4 after:w-4 after:transition-all
          dark:border-gray-600
          ${
                !disabled &&
                `peer-checked:bg-gradient-to-r 
             peer-checked:from-[#6142FF] 
             peer-checked:to-[#1478FF]
             dark:peer-checked:bg-gradient-to-r 
             dark:peer-checked:from-[#6142FF] 
             dark:peer-checked:to-[#1478FF]`
            }
        `}
        ></div>
      </label>
  );
}
