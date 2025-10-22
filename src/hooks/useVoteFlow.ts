import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/common/Toast/useToast";
import { useVote } from "@/hooks/useVote";
import { Poll } from "@/types/poll";
import { selectOption } from "@/components/common/SelectOptionGroup/SelectOptionGroup";
import { optionIdToSelection } from "@/utils/pollSelectionUtils";

const VOTE_TOAST = {
  success: { type: "success" as const, message: "투표 완료!" },
  error: { type: "error" as const, message: "투표 실패!" },
  duration: 3000,
};

export default function useVoteFlow(data?: Poll) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [optimisticSelection, setOptimisticSelection] =
    useState<selectOption>("none");

  const showToastWithType = useCallback(
    (type: "success" | "error", message: string) => {
      showToast({ type, message, duration: VOTE_TOAST.duration });
    },
    [showToast],
  );

  const { mutate } = useVote({
    onMutate: (variables) => {
      const newSelection = optionIdToSelection(variables.id, data?.options);
      setOptimisticSelection(newSelection);
      return { previousSelectOption: data?.votedOptionId };
    },
    onSuccess: () => {
      showToastWithType("success", VOTE_TOAST.success.message);
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
    onError: (error, _variables, context) => {
      showToastWithType(
        "error",
        `${VOTE_TOAST.error.message} ${error.message}`,
      );
      const previousSelection = optionIdToSelection(
        context?.previousSelectOption,
        data?.options,
      );
      setOptimisticSelection(previousSelection);
    },
  });

  return { mutate, optimisticSelection, setOptimisticSelection };
}
