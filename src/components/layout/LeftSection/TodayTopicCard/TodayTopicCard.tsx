import styled from "styled-components";
import { selectOption } from "@/components/common/SelectOptionGroup/SelectOptionGroup";
import { usePoll } from "@/hooks/usePoll";
import { useVote } from "@/hooks/useVote";
import { useToast } from "@/components/common/Toast/useToast";
import { useMemo, useState, useCallback } from "react";
import { makePieData } from "@/lib/chart";
import { useQueryClient } from "@tanstack/react-query";
import MainContent from "./MainContent";
import { useTodayISO } from "@/hooks/useTodayIso";
import NoTopicState from "./NoTopicState";
import useAuth from "@/hooks/useAuth";
import LoginReqruiedModal from "./LoginRequiredModal";
import { Spinner } from "@/components/svg/Spinner";

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
  const { isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const today = useTodayISO();
  const { data, isLoading, isError } = usePoll(today);
  const queryClient = useQueryClient();
  const [optimisticSelection, setOptimisticSelection] =
    useState<selectOption>("none");

  const pieData = useMemo(
    () => makePieData(data?.options ?? [], data?.votedOptionId ?? null),
    [data],
  );

  const currentSelection = optionIdToSelection(
    data?.votedOptionId,
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

  const handleVote = useCallback(
    (selection: selectOption) => {
      // 로그인 하지 않았을 경우
      if (!isLoggedIn) {
        setOpen(true);
      }

      if (displayedSelection === selection) return;

      const optionId = selectionToOptionId(selection, data?.options);
      if (optionId) mutate({ id: optionId });
    },
    [isLoggedIn, displayedSelection, data?.options, mutate],
  );

  return (
    <Container>
      {isError || (!isLoading && data === undefined) ? (
        <NoTopicState
          message="오늘의 주제가 없습니다"
          description="잠시 후 다시 시도해주세요"
        />
      ) : (
        <>
          {isLoading ? (
            <SpinnerContainer>
              <Spinner />
            </SpinnerContainer>
          ) : (
            <>
              <TitleSection>
                <TitleLabel>🔥 오늘의 주제는 :</TitleLabel>
                <TopicTitle as="h2">{data?.title}</TopicTitle>
              </TitleSection>
              <MainContent
                pieData={pieData}
                votedOptionId={data?.votedOptionId}
                options={data?.options}
                displayedSelection={displayedSelection}
                handleVote={handleVote}
              />
            </>
          )}
          {open && (
            <LoginReqruiedModal isOpen={open} onClose={() => setOpen(false)} />
          )}
        </>
      )}
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.625rem;
  min-width: 340px;
  max-width: 430px;
  min-height: 552px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
`;

const TitleSection = styled.div`
  display: flex;
  min-height: 88px;
  flex-direction: column;
  justify-content: center;
`;

const TitleLabel = styled.div`
  font-weight: 600;
  padding: 10px;
`;

const TopicTitle = styled.div`
  width: 100%;
  font-weight: 900;
  font-size: 24px;
  padding: 10px;
  text-align: center;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 300px;
`;
