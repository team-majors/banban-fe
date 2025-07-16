interface ToggleButtonProps {
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
}

export default function ToggleButton({
  isChecked,
  onChange,
}: ToggleButtonProps) {
  const handleChange = () => {
    onChange(!isChecked);
  };

  return (
    <label className="inline-flex items-center cursor-pointer gap-3 select-none">
      <span className="text-sm font-light text-neutral-500 dark:text-gray-300 select-none">
        스쿼드
      </span>
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        checked={isChecked}
        onChange={handleChange}
      />
      <div
        className="
          relative w-9 h-5 bg-gray-200
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
          peer-checked:bg-gradient-to-r 
          peer-checked:from-[#6142FF] 
          peer-checked:to-[#1478FF]

          dark:peer-checked:bg-gradient-to-r 
          dark:peer-checked:from-[#6142FF] 
          dark:peer-checked:to-[#1478FF]
        "
      ></div>
    </label>
  );
}
