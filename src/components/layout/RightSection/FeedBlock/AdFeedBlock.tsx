import styled from "styled-components";
import { Avatar } from "@/components/common/Avatar"
import type { Feed } from "@/types/feeds";

interface AdFeedBlockProps {
  feedProps: Feed;
}

export function AdFeedBlock({ feedProps }: AdFeedBlockProps) {
  return (
    <StyledContainer>
      <Avatar 
        src={feedProps.author.profileImage || ""}
        alt="광고 프로필 이미지" 
        size={40}
        background="rgba(0, 0, 0, 0.00)"
      />
      <StyledContentContainer>
        <StyledTitleContainer>
          <StyledTitle>{feedProps.author.username}</StyledTitle>
          <StyledCreatedAt>광고</StyledCreatedAt>
        </StyledTitleContainer>
        <StyledImageContainer src="/Ad.png" alt="광고 이미지" />
        <StyledBodyContainer>
          {feedProps.content}
        </StyledBodyContainer>
      </StyledContentContainer>
    </StyledContainer>
  )
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
`;

const StyledImageContainer = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;

  margin-top: 5px;
  border-radius: 20px;
`;


