import { useMemo } from "react";
import voteOptionColors from "@/constants/voteOptionColors";
import { Poll } from "@/types/poll";

export const useVoteOptionColor = (userVoteOptionId: number | null, pollData?: Poll) => {
  const avatarBackground = useMemo(() => {
    if (!userVoteOptionId || !pollData?.options) return undefined;

    const option = pollData?.options.find((opt) => opt.id === userVoteOptionId);
    if (!option) return undefined;

    return getVoteOptionColorByOrder(option.option_order);
  }, [userVoteOptionId, pollData]);

  return avatarBackground;
};

export const getVoteOptionColorByOrder = (optionOrder: number): string | undefined => {
  switch (optionOrder) {
    case 1:
      return voteOptionColors.RED_GRADATION;
    case 2:
      return voteOptionColors.BLUE_GRADATION;
    default:
      return undefined;
  }
};
