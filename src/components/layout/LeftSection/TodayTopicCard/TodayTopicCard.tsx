import { SelectOptionGroup } from "@/components/common/SelectOptionGroup";
import styled from "styled-components";
import VoteResultCircle from "./chart/VoteResultCircle";
import { selectOption } from "@/components/common/SelectOptionGroup/SelectOptionGroup";
import VoteResultPlaceHolder from "./VoteResultPlaceHolder/VoteResultPlaceHolder";
import { usePoll } from "@/hooks/usePoll";
import { useVote } from "@/hooks/useVote";
import { useToast } from "@/components/common/Toast/useToast";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/svg/Spinner";
import useAuth from "@/hooks/useAuth";
import { makePieData } from "@/lib/chart";
import { dataForTest } from "@/mock/data/vote";

export default function TodayTopicCard() {
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const { data, isLoading } = usePoll();
  const [optimisticSelection, setOptimisticSelection] =
    useState<selectOption>("none");

  const pieData = data ? makePieData(data.options, data.voted_option_id) : [];

  const { mutate } = useVote({
    onMutate: (variables) => {
      // 낙관적 업데이트: 투표하기 전에 UI를 미리 업데이트
      const newSelection =
        data?.options[0].id === variables.id
          ? "firstOption"
          : data?.options[1].id === variables.id
          ? "secondOption"
          : "none";

      setOptimisticSelection(newSelection);

      return {
        previousSelectOption: data?.voted_option_id,
      };
    },
    onSuccess: () => {
      showToast({
        type: "success",
        message: `투표 완료!`,
        duration: 300000,
      });
    },
    onError: (error, variables, context) => {
      showToast({
        type: "error",
        message: `투표 실패! ${error.message || "알 수 없는 오류"}`,
        duration: 300000,
      });

      const previousSelection =
        context?.previousSelectOption === null
          ? "none"
          : context?.previousSelectOption === data?.options[0].id
          ? "firstOption"
          : context?.previousSelectOption === data?.options[1].id
          ? "secondOption"
          : "none";

      setOptimisticSelection(previousSelection);
    },
  });

  useEffect(() => {}, [isLoggedIn]);

  const selected =
    data?.voted_option_id === null
      ? "none"
      : data?.options[0].id === data?.voted_option_id
      ? "firstOption"
      : data?.options[1].id === data?.voted_option_id
      ? "secondOption"
      : "none";

  // 화면에 표시할 선택값 (낙관적 업데이트 적용)
  const displayedSelection =
    optimisticSelection !== "none" ? optimisticSelection : selected;

  return (
    <Container>
      <TitleSection>
        <TitleLabel>🔥 오늘의 주제는 :</TitleLabel>
        <TopicTitle as="h2">{data?.title}</TopicTitle>
      </TitleSection>

      {
        <>
          {isLoading ? (
            <SpinnerContainer>
              <Spinner />
            </SpinnerContainer>
          ) : (
            <>
              <VoteResultCircleContainer>
                {data?.voted_option_id === null ? (
                  <VoteResultPlaceHolder />
                ) : (
                  pieData && (
                    <VoteResultCircle
                      // pieData={[
                      //   ...pieData.filter((d) => !d.userSelected),
                      //   ...pieData.filter((d) => d.userSelected),
                      // ]}
                      pieData={[
                        ...dataForTest.filter((d) => !d.userSelected),
                        ...dataForTest.filter((d) => d.userSelected),
                      ]}
                    />
                  )
                )}
              </VoteResultCircleContainer>

              <CountdownSection>
                <CountdownText>⏰ 남은 시간: 14:29:09</CountdownText>
                <CountdownDescription>
                  00:00~23:59까지 투표 가능
                </CountdownDescription>
              </CountdownSection>

              <SelectOptionGroup
                selected={displayedSelection} // 낙관적 업데이트가 적용된 선택값 사용
                rowGap="10px"
                firstOptionString={data?.options[0].content || ""}
                secondOptionString={data?.options[1].content || ""}
                onClick={(state: selectOption) => {
                  if (displayedSelection === state) {
                    return;
                  }
                  if (data?.options[0].id && state === "firstOption") {
                    mutate({ id: data.options[0].id });
                  } else if (data?.options[1].id && state === "secondOption") {
                    mutate({ id: data.options[1].id });
                  }
                }}
              />
            </>
          )}
        </>
      }
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  font-size: 24px;
  text-align: center;
  margin-bottom: 6px;
`;

const CountdownSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 4px;
  text-align: center;
`;

const CountdownText = styled.div`
  font-size: 20px;
  color: #00000060;
`;

const CountdownDescription = styled.div`
  font-size: 10px;
  color: #00000030;
`;

const VoteResultCircleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 8px;
  padding: 0px 10px;
  max-height: 280px;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 471px;
`;
