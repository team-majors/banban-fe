import styled from "styled-components";
import { Avatar } from "@/components/common/Avatar"
import { FeedHeartButton, FeedCommentButton } from "@/components/common/Button";
import { MoreIcon } from "@/components/svg/MoreIcon";

export function UserFeedBlock() {
  return (
    <StyledContainer>
      <Avatar 
        src="/love.jpg" 
        alt="사용자 프로필 이미지" 
        size={40}
      />
      <StyledContentContainer>
        <StyledTitleContainer>
          <StyledTitleWrapper>
            <StyledTitle>minty_day</StyledTitle>
            <StyledCreatedAt>2시간 전</StyledCreatedAt>
          </StyledTitleWrapper>
          <StyledMoreButton>
            <MoreIcon />
          </StyledMoreButton>
        </StyledTitleContainer>

        <StyledBodyContainer>
          300이면 월세, 밥값 다 커버하고도 남는데? 하고 싶은 거 하면서 사는 게 국룰이지 😎 진짜 나답게 살고 싶어
        </StyledBodyContainer>

        <StyledIconButtonContainer>
          <FeedHeartButton />
          <FeedCommentButton />
        </StyledIconButtonContainer>
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

