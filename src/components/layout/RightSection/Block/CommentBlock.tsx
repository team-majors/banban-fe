
import styled from "styled-components";
import { Avatar } from "@/components/common/Avatar";
import { FeedHeartButton } from "@/components/common/Button";
import { MoreIcon } from "@/components/svg/MoreIcon";
import { CornerDownRightIcon } from "@/components/svg/CornerDownRightIcon";
import { CommentContent,  } from "@/types/comments";
import { useState } from "react";

import { useCommentLikeOptimisticUpdate } from "@/hooks/useLikeOptimisticUpdate";
import { useVoteOptionColor } from "@/hooks/useVoteOptionColor";
import { Poll } from "@/types/poll";

const CommentBlock = ({ props, pollData }: { props: CommentContent; pollData: Poll }) => {
  const {
    id,
    feedId,
    content,
    author,
    likeCount,
    isLiked,
    userVoteOptionId
  } = props;

  const formattedCreatedAt = new Date(props.createdAt).toLocaleDateString();

  const [liked, setLiked] = useState<boolean>(isLiked);
  const [count, setCount] = useState<number>(likeCount);

  const likeMutation = useCommentLikeOptimisticUpdate({ feedId, id });
  const avatarBackground = useVoteOptionColor(userVoteOptionId, pollData);

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
          <StyledMoreButton>
            <MoreIcon />
          </StyledMoreButton>
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
        </StyledIconButtonContainer>
      </StyledContentContainer>
    </StyledContainer>
  );
}

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

export { CommentBlock };