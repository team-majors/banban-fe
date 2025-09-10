import styled from "styled-components";
import { selectOption } from "@/components/common/SelectOptionGroup/SelectOptionGroup";
import { usePoll } from "@/hooks/usePoll";
import { useVote } from "@/hooks/useVote";
import { useToast } from "@/components/common/Toast/useToast";
import { useMemo, useState, useCallback } from "react";
import { makePieData } from "@/lib/chart";
import { useQueryClient } from "@tanstack/react-query";
import MainContent from "./MainContent";

export interface Option {
  id: number;
  content: string;
}

const VOTE_TOAST = {
  success: { type: "success" as const, message: "투표 완료!" },
  error: { type: "error" as const, message: "투표 실패!" },
  duration: 3000,
};

function optionIdToSelection(
  optionId: number | null | undefined,
  options?: Option[],
): selectOption {
  if (!optionId || !options) return "none";
  if (options[0]?.id === optionId) return "firstOption";
  if (options[1]?.id === optionId) return "secondOption";
  return "none";
}

function selectionToOptionId(
  selection: selectOption,
  options?: Option[],
): number | null {
  if (!options) return null;
  switch (selection) {
    case "firstOption":
      return options[0]?.id ?? null;
    case "secondOption":
      return options[1]?.id ?? null;
    default:
      return null;
  }
}

export default function TodayTopicCard() {
  const { showToast } = useToast();
  const { data, isLoading } = usePoll();
  const queryClient = useQueryClient();
  const [optimisticSelection, setOptimisticSelection] =
    useState<selectOption>("none");

  const pieData = useMemo(
    () => makePieData(data?.options ?? [], data?.voted_option_id),
    [data],
  );

  const currentSelection = optionIdToSelection(
    data?.voted_option_id,
    data?.options,
  );

  const displayedSelection =
    optimisticSelection !== "none" ? optimisticSelection : currentSelection;

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

      return { previousSelectOption: data?.voted_option_id };
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

  const handleVote = useCallback(
    (selection: selectOption) => {
      if (displayedSelection === selection) return;
      const optionId = selectionToOptionId(selection, data?.options);
      if (optionId) mutate({ id: optionId });
    },
    [displayedSelection, data?.options, mutate],
  );

  return (
    <Container>
      <TitleSection>
        <TitleLabel>🔥 오늘의 주제는 :</TitleLabel>
        <TopicTitle as="h2">{data?.title}</TopicTitle>
      </TitleSection>
      <MainContent
        isLoading={isLoading}
        pieData={pieData}
        votedOptionId={data?.voted_option_id}
        options={data?.options}
        displayedSelection={displayedSelection}
        handleVote={handleVote}
      />
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  min-width: 340px;
  max-width: 430px;
  background-color: white;
  border-radius: 8px;
  padding: 20px 16px;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleLabel = styled.div`
  font-weight: 600;
  padding: 10px;
  margin-bottom: 10px;
`;

const TopicTitle = styled.div`
  width: 100%;
  font-weight: 900;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 6px;
`;
