import styled from "styled-components";
import { useMemo, useState, useCallback } from "react";
import useAuth from "@/hooks/useAuth";
import { usePoll } from "@/hooks/usePoll";
import { media } from "@/constants/breakpoints";

import MainContent from "./MainContent";
import NoTopicState from "./NoTopicState";
import { Spinner } from "@/components/svg/Spinner";
import LoginReqruiedModal from "./LoginRequiredModal";
import ConfirmModal from "./ConfirmModal";

import { makePieData } from "@/lib/chart";
import { selectOption } from "@/components/common/SelectOptionGroup/SelectOptionGroup";

import useVoteFlow from "@/hooks/useVoteFlow";

export default function TodayTopicCard() {
  const { isLoggedIn } = useAuth();
  const { data, isLoading } = usePoll();
  const { mutate, optimisticSelection } = useVoteFlow(data);

  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [selected, setSelected] = useState<selectOption>("none");
  const [optionLabel, setOptionLabel] = useState<string>("");

  const pieData = useMemo(
    () => makePieData(data?.options ?? [], data?.votedOptionId ?? null),
    [data],
  );

  const currentSelection =
    data?.hasVoted === false
      ? "none"
      : data?.options?.find((opt) => opt.id === data?.votedOptionId)
          ?.optionOrder === 1
      ? "firstOption"
      : "secondOption";

  const displayedSelection =
    optimisticSelection !== "none" ? optimisticSelection : currentSelection;

  const firstOption = data?.options.find((opt) => opt.optionOrder === 1);
  const secondOption = data?.options.find((opt) => opt.optionOrder === 2);

  const handleConfirm = (selection: selectOption) => {
    if (!isLoggedIn) return setOpenLoginModal(true);
    setSelected(selection);
    setOptionLabel(
      selection === "firstOption"
        ? firstOption?.content ?? ""
        : secondOption?.content ?? "",
    );
  };

  const handleVote = useCallback(
    (selection: selectOption) => {
      if (displayedSelection === selection) return;
      const optionId =
        selection === "firstOption" ? firstOption?.id : secondOption?.id;
      if (optionId) mutate({ id: optionId });
    },
    [displayedSelection, firstOption, secondOption, mutate],
  );

  if (isLoading)
    return (
      <Container>
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      </Container>
    );

  if (!data)
    return (
      <Container>
        <NoTopicState
          message="오늘의 주제가 없습니다"
          description="잠시 후 다시 시도해주세요"
        />
      </Container>
    );

  return (
    <Container>
      <TitleSection>
        <TitleLabel>🔥 오늘의 주제는 :</TitleLabel>
        <TopicTitle as="h2">{data.title}</TopicTitle>
      </TitleSection>

      <MainContent
        pieData={pieData}
        votedOptionId={data.votedOptionId}
        options={data.options}
        displayedSelection={displayedSelection}
        handleVote={handleConfirm}
        isLoggedIn={isLoggedIn}
      />

      {openLoginModal && (
        <LoginReqruiedModal isOpen onClose={() => setOpenLoginModal(false)} />
      )}

      {selected !== "none" && (
        <ConfirmModal
          onClose={() => setSelected("none")}
          onVote={() => handleVote(selected)}
          optionLabel={optionLabel}
          color={selected === "firstOption" ? "#FF474F" : "#0000FF"}
        />
      )}
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  min-height: 480px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;

  ${media.mobile} {
    width: 100%;
    min-height: auto;
    padding: 16px 12px;
    border-radius: 0;
  }

  ${media.tablet} {
    width: 100%;
  }

  ${media.desktop} {
    width: 430px;
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TitleLabel = styled.div`
  font-weight: 600;
`;

const TopicTitle = styled.div`
  width: 100%;
  font-weight: 800;
  font-size: 24px;
  padding: 4px;
  text-align: center;
  line-height: 1.3;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 480px;
  flex: 1;

  ${media.mobile} {
    min-height: 320px;
  }
`;
