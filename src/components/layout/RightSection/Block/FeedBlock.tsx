import styled from "styled-components";
import { Avatar } from "@/components/common/Avatar";
import { FeedHeartButton, FeedCommentButton } from "@/components/common/Button";
import { MoreIcon } from "@/components/svg/MoreIcon";
import type { Feed } from "@/types/feeds";
import { useContext, useRef, useState } from "react";
import { SectionContext } from "../SectionContext";
import { OptionsDropdown } from "@/components/common/OptionsDropdown/OptionsDropdown";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useFeedLikeOptimisticUpdate } from "@/hooks/useLikeOptimisticUpdate";

const FeedBlock = ({ props }: { props: Feed }) => {
  const {
    user,
    createdAt,
    commentCount,
    content,
    likeCount,
    id,
    isLiked
  } = props;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const formattedCreatedAt = new Date(createdAt).toLocaleDateString();
  const { setSectionStatus, setTargetFeed } = useContext(SectionContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  const [liked, setLiked] = useState<boolean>(isLiked);
  const [count, setCount] = useState<number>(likeCount);

  const likeMutation = useFeedLikeOptimisticUpdate({ id });

  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <StyledContainer>
      <Avatar
        src={user.profileImage || ""}
        alt="사용자 프로필 이미지"
        size={40}
        background={
          props.userVoteOptionId === 15
            ? "linear-gradient(to right, #FF05CE, #FF474F)"
            : props.userVoteOptionId === 16
            ? "linear-gradient(to right, #6142FF, #1478FF)"
            : undefined
        }
      />
      <StyledContentContainer>
        <StyledTitleContainer>
          <StyledTitleWrapper>
            <StyledTitle>{props.user.username}</StyledTitle>
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
                  // 신고 처리 로직
                }}
              />
            )}
          </StyledMoreButtonWrapper>
        </StyledTitleContainer>

        <StyledBodyContainer>{content}</StyledBodyContainer>

        <StyledIconButtonContainer>
          <FeedHeartButton
            likeCount={count}
            isLiked={liked}
            onClick={() => {
              setCount(liked ? count - 1 : count + 1);
              setLiked(!liked);
              likeMutation.mutate();
            }}
          />
          <FeedCommentButton
            commentCount={commentCount}
            onClick={() => {
              setTargetFeed(props);
              setSectionStatus("comments");
            }}
          />
        </StyledIconButtonContainer>
      </StyledContentContainer>
    </StyledContainer>
  );
};

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

export { FeedBlock };
