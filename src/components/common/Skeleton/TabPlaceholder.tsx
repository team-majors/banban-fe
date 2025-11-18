import NeutralSkeleton from "./NeutralSkeleton";

export default function TabPlaceholder() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <NeutralSkeleton height="16px" />
      <NeutralSkeleton height="16px" width="80%" />
      <NeutralSkeleton height="200px" />
    </div>
  );
}
