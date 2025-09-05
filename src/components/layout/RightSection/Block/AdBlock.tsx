import styled from "styled-components";
import { Avatar } from "@/components/common/Avatar";
import { MoreIcon } from "@/components/svg/MoreIcon";
import type { Feed } from "@/types/feeds";
import { useRef, useState } from "react";
import { OptionsDropdown } from "@/components/common/OptionsDropdown/OptionsDropdown";
import { useClickOutside } from "@/hooks/useClickOutside";
import { ReportModal } from "@/components/common/Report";
import useReport from "@/hooks/useReport";

const AdBlock = ({ props }: { props: Feed }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<string>('');
  const [reportDetail, setReportDetail] = useState<string>('');
  
  const reportMutation = useReport({
    targetType: 'FEED',
    targetId: props.id,
    reasonCode: reportReason,
    reasonDetail: reportDetail
  });
  
  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };

  const handleReport = (reason: string, detail?: string) => {
    setReportReason(reason);
    setReportDetail(detail || '');
    setTimeout(() => {
      reportMutation.mutate();
    }, 0);
  };

  return (
    <StyledContainer>
      <Avatar
        src={props.user.profileImage || "love.jpg"}
        alt="광고 프로필 이미지"
        size={40}
        background="rgba(0, 0, 0, 0.00)"
      />
      <StyledContentContainer>
        <StyledTitleContainer>
          <StyledTitleWrapper>
            <StyledTitle>{props.user.username}</StyledTitle>
            <StyledCreatedAt>광고</StyledCreatedAt>
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
                targetType="FEED"
                targetId={props.id}
              />
            )}
          </StyledMoreButtonWrapper>
        </StyledTitleContainer>
        <StyledImageContainer src="/Ad.png" alt="광고 이미지" />
        <StyledBodyContainer>{props.content}</StyledBodyContainer>
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

const StyledImageContainer = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  margin-top: 5px;
  border-radius: 20px;
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

export { AdBlock };