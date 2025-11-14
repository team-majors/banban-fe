export default function RightSectionSkeleton() {
  return (
    <div
      className="
        w-[430px]
        h-full
        rounded-[16px]
        p-4
        bg-white
        shadow-[0_12px_32px_rgba(15,23,42,0.08)]
        flex flex-col gap-3
      "
    >
      <div
        className="
          w-[60%]
          h-[16px]
          rounded-[8px]
          bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6]
          animate-shimmer
        "
      />
      <div
        className="
          w-full
          h-[60px]
          rounded-[8px]
          bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6]
          animate-shimmer
        "
      />
      <div
        className="
          w-full
          h-[60px]
          rounded-[8px]
          bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6]
          animate-shimmer
        "
      />
    </div>
  );
}
