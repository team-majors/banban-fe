import { selectOption } from "@/components/common/SelectOptionGroup/SelectOptionGroup";
import { PollOption } from "@/types/poll";

export function optionIdToSelection(
  optionId: number | null | undefined,
  options?: PollOption[],
): selectOption {
  if (optionId == null || !options?.length) return "none";
  const matched = options.find((opt) => opt.id === optionId);
  return matched?.optionOrder === 1
    ? "firstOption"
    : matched
    ? "secondOption"
    : "none";
}

export function selectionToOptionId(
  selection: selectOption,
  options?: PollOption[],
): number | null {
  if (!options?.length) return null;
  const orderMap: Record<selectOption, number | null> = {
    firstOption: 1,
    secondOption: 2,
    none: null,
  };
  const order = orderMap[selection];
  return options.find((opt) => opt.optionOrder === order)?.id ?? null;
}
