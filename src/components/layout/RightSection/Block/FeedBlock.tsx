import type { Feed } from "@/types/feeds";
import { useRef, useState } from "react";
import { OptionsDropdown } from "@/components/common/OptionsDropdown/OptionsDropdown";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useFeedLikeOptimisticUpdate } from "@/hooks/useLikeOptimisticUpdate";
import { useVoteOptionColor } from "@/hooks/useVoteOptionColor";
import { Poll } from "@/types/poll";
import { Avatar } from "@/components/common/Avatar";
import { FeedCommentButton, FeedHeartButton } from "@/components/common/Button";
import { OptionsDropdown } from "@/components/common/OptionsDropdown/OptionsDropdown";
import { ReportModal } from "@/components/common/Report";
import useReportMutation from "@/hooks/useReportMutation";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

const FeedBlock = ({ props, pollData }: { props: Feed; pollData?: Poll }) => {
  const { user, createdAt, commentCount, content, likeCount, id, isLiked } =
    props;
  const { isLoggedIn, user: me } = useAuthStore();

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const formattedCreatedAt = new Date(createdAt).toLocaleDateString();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  const [liked, setLiked] = useState<boolean>(isLiked);
  const [count, setCount] = useState<number>(likeCount);

  const likeMutation = useFeedLikeOptimisticUpdate({ id });
  const avatarBackground = useVoteOptionColor(props.userVoteOptionId, pollData);
  const [reportReason, setReportReason] = useState<string>("");
  const [reportDetail, setReportDetail] = useState<string>("");

  const reportMutation = useReportMutation();

  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLoginRequired = () => {
    // TODO: 로그인 유도 로직 구현 (모달 또는 페이지 이동)
    alert("로그인이 필요합니다.");
  }, []);

  return (
    <StyledContainer>
      <Avatar
        src={feed.user.profileImage || ""}
        alt="사용자 프로필 이미지"
        size={40}
        background={avatarBackground}
      />

      <StyledContentContainer>
        <StyledTitleContainer>
          <StyledTitleWrapper>
            <StyledTitle>{feed.user.username}</StyledTitle>
            <StyledCreatedAt>{formattedCreatedAt}</StyledCreatedAt>
          </StyledTitleWrapper>

          {!isMyFeed && isLoggedIn && (
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
                    // 관심 없음 처리 로직을 여기에 추가할 수 있음
                  }}
                  onReport={() => {
                    handleOpenReportModal();
                  }}
                />
              )}

              {isReportModalOpen && (
                <ReportModal
                  isOpen={isReportModalOpen}
                  onClose={handleCloseReportModal}
                  onReport={handleReport}
                  targetType="FEED"
                  targetId={feed.id}
                />
              )}
            </StyledMoreButtonWrapper>
          )}
        </StyledTitleContainer>

        <StyledBodyContainer>{feed.content}</StyledBodyContainer>

        <StyledIconButtonContainer>
          <FeedHeartButton
            likeCount={count}
            isLiked={liked}
            isLoggedIn={isLoggedIn}
            onClick={handleToggleLike}
            onLoginRequired={handleLoginRequired}
          />
          <FeedCommentButton
            commentCount={commentCount}
            onClick={() => {
              router.push(`/feeds/${id}`);
            }}
          />
        </StyledIconButtonContainer>
      </StyledContentContainer>
    </StyledContainer>
  );
};

export const FeedBlock = React.memo(FeedBlockComponent);

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
