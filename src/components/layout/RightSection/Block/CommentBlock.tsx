import styled from "styled-components";
import { Avatar } from "@/components/common/Avatar";
import { FeedHeartButton } from "@/components/common/Button";
import { MoreIcon } from "@/components/svg/MoreIcon";
import { CornerDownRightIcon } from "@/components/svg/CornerDownRightIcon";
import { CommentContent } from "@/types/comments";
import { useRef, useState } from "react";
import { OptionsDropdown } from "@/components/common/OptionsDropdown/OptionsDropdown";
import { useClickOutside } from "@/hooks/useClickOutside";
import { ReportModal } from "@/components/common/Report";

import { useCommentLikeOptimisticUpdate } from "@/hooks/useLikeOptimisticUpdate";
import { useVoteOptionColor } from "@/hooks/useVoteOptionColor";
import { Poll } from "@/types/poll";
import useReportMutation from "@/hooks/useReportMutation";
import { useAuthStore } from "@/store/useAuthStore";

const CommentBlock = ({
  props,
  pollData,
}: {
  props: CommentContent;
  pollData?: Poll;
}) => {
  const { id, feedId, content, author, likeCount, isLiked, userVoteOptionId } =
    props;

  const formattedCreatedAt = new Date(props.createdAt).toLocaleDateString();

  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isReportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>("");
  const [reportDetail, setReportDetail] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const likeMutation = useCommentLikeOptimisticUpdate({ feedId, id });
  const avatarBackground = useVoteOptionColor(userVoteOptionId, pollData);

  const reportMutation = useReportMutation();
  const { isLoggedIn } = useAuthStore();

  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLoginRequired = () => {
    // TODO: 로그인 유도 로직 구현 (모달 또는 페이지 이동)
    alert("로그인이 필요합니다.");
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };

  const handleReport = (reason: string, detail?: string) => {
    setReportReason(reason);
    setReportDetail(detail || "");
    setTimeout(() => {
      reportMutation.mutate({
        targetType: "COMMENT",
        targetId: id,
        reasonCode: reportReason,
        reasonDetail: reportDetail,
      });
    }, 0);
  };

  return (
    <StyledContainer>
      <StyledLeftPadding />
      <CornerDownRightIcon size={30} color="#DADADA" />
      <Avatar
        src={author.profileImage || ""}
        alt="사용자 프로필 이미지"
        size={40}
        background={avatarBackground}
      />
      <StyledContentContainer>
        <StyledTitleContainer>
          <StyledTitleWrapper>
            <StyledTitle>{author.username}</StyledTitle>
            <StyledCreatedAt>{formattedCreatedAt}</StyledCreatedAt>
          </StyledTitleWrapper>
          <StyledMoreButtonWrapper ref={dropdownRef}>
            <StyledMoreButton
              onClick={handleToggleDropdown}
              aria-label="더보기 옵션 열기"
            >
              <MoreIcon />
            </StyledMoreButton>
            {isDropdownOpen && (
              <OptionsDropdown
                onHide={() => {
                  handleCloseDropdown();
                  // 관심 없음 처리 로직
                }}
                onReport={() => {
                  handleCloseDropdown();
                  setReportModalOpen(true);
                }}
              />
            )}
            {isReportModalOpen && (
              <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setReportModalOpen(false)}
                onReport={handleReport}
                targetType="COMMENT"
                targetId={id}
              />
            )}
          </StyledMoreButtonWrapper>
        </StyledTitleContainer>

        <StyledBodyContainer>{content}</StyledBodyContainer>

        <StyledIconButtonContainer>
          <FeedHeartButton
            likeCount={likeCount}
            isLiked={isLiked}
            isLoggedIn={isLoggedIn}
            onClick={() => {
              likeMutation.mutate();
            }}
            onLoginRequired={handleLoginRequired}
          />
        </StyledIconButtonContainer>
      </StyledContentContainer>
    </StyledContainer>
  );
};

const StyledLeftPadding = styled.div`
  padding: 0 5px;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 10px 16px;
  align-items: start;
`;

const StyledContentContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledTitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const StyledTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 8px;
`;

const StyledTitle = styled.div`
  font-weight: bold;
  font-size: 14px;
`;

const StyledCreatedAt = styled.div`
  font-size: 12px;
  font-weight: lighter;
  color: #535862;
`;

const StyledBodyContainer = styled.div`
  font-size: 14px;
  line-height: 24px;
  margin-top: 4px;
`;

const StyledIconButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 7px;
  gap: 10px;
`;

const StyledMoreButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const StyledMoreButtonWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export { CommentBlock };
