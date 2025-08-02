import styled from "styled-components";
import { Avatar } from "@/components/common/Avatar";
import { FeedHeartButton, FeedCommentButton } from "@/components/common/Button";
import { MoreIcon } from "@/components/svg/MoreIcon";
import type { Feed } from "@/types/feeds";
interface UserFeedBlockProps {
  feedProps: Feed;
}

export function UserFeedBlock({ feedProps }: UserFeedBlockProps) {
  const formattedCreatedAt = new Date(feedProps.createdAt).toLocaleDateString();

  return (
    <StyledContainer>
      <Avatar
        src={feedProps.author.profileImage || ""}
        alt="사용자 프로필 이미지"
        size={40}
        background={
          feedProps.userVoteOptionId === 1
            ? "linear-gradient(to right, #FF05CE, #FF474F)"
            : feedProps.userVoteOptionId === 2
            ? "linear-gradient(to right, #6142FF, #1478FF)"
            : undefined
        }
      />
      <StyledContentContainer>
        <StyledTitleContainer>
          <StyledTitleWrapper>
            <StyledTitle>{feedProps.author.username}</StyledTitle>
            <StyledCreatedAt>{formattedCreatedAt}</StyledCreatedAt>
          </StyledTitleWrapper>
          <StyledMoreButton>
            <MoreIcon />
          </StyledMoreButton>
        </StyledTitleContainer>


        <StyledBodyContainer>{feedProps.content}</StyledBodyContainer>


        <StyledIconButtonContainer>
          <FeedHeartButton likeCount={feedProps.likeCount} />
          <FeedCommentButton commentCount={feedProps.commentCount} />
        </StyledIconButtonContainer>
      </StyledContentContainer>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  max-width: 428px;
  min-width: 300px;

  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 10px 16px;

  align-items: start;
`;

const StyledContentContainer = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
`;

const StyledTitleContainer = styled.div`
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
