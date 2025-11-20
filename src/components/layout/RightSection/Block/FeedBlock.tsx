import type { Feed } from "@/types/feeds";
import React, { useEffect, useRef, useState, useContext } from "react";
import dynamic from "next/dynamic";
import { useClickOutside } from "@/hooks/common/useClickOutside";
import { Poll } from "@/types/poll";
import { Avatar } from "@/components/common/Avatar";
import { FeedCommentButton, FeedHeartButton } from "@/components/common/Button";
import { useAuthStore } from "@/store/useAuthStore";
import styled from "styled-components";
import { MoreIcon } from "@/components/svg/MoreIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFeed, deleteFeed } from "@/remote/feed";
import { useToast } from "@/components/common/Toast/useToast";
import { SectionContext } from "@/components/layout/RightSection/SectionContext";
import useReportMutation from "@/hooks/api/report/useReportMutation";
import { useFeedLikeOptimisticUpdate } from "@/hooks/api/feed/useLikeOptimisticUpdate";
import { useVoteOptionColor } from "@/hooks/ui/poll/useVoteOptionColor";

const OptionsDropdown = dynamic(
  () =>
    import("@/components/common/OptionsDropdown/OptionsDropdown").then(
      (mod) => mod.OptionsDropdown,
    ),
  { ssr: false, loading: () => null },
);

const ReportModal = dynamic(
  () => import("@/components/common/Report").then((mod) => mod.ReportModal),
  { ssr: false, loading: () => null },
);

const ConfirmModal = dynamic(
  () =>
    import("@/components/common/ConfirmModal/ConfirmModal").then(
      (mod) => mod.ConfirmModal,
    ),
  { ssr: false, loading: () => null },
);

const FloatingInputModal = dynamic(
  () =>
    import("@/components/common/FloatingInputModal").then(
      (mod) => mod.FloatingInputModal,
    ),
  { ssr: false, loading: () => null },
);

export const FeedBlock = ({
  props,
  pollData,
}: {
  props: Feed;
  pollData?: Poll;
}) => {
  const { user, createdAt, commentCount, content, likeCount, id, isLiked } =
    props;
  const me = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const formattedCreatedAt = new Date(createdAt).toLocaleDateString();

  // 모바일 컨텍스트 확인
  const { onMobileFeedClick, onDesktopFeedClick } = useContext(SectionContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  const [liked, setLiked] = useState<boolean>(isLiked);
  const [count, setCount] = useState<number>(likeCount);

  useEffect(() => {
    setLiked(isLiked);
    setCount(likeCount);
  }, [isLiked, likeCount]);

  const likeMutation = useFeedLikeOptimisticUpdate({ id });

  const avatarBackground = useVoteOptionColor(props.userVoteOptionId, pollData);

  const reportMutation = useReportMutation();

  const updateMutation = useMutation({
    mutationFn: (newContent: string) => updateFeed(id, newContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      showToast({
        type: "success",
        message: "피드가 수정되었습니다.",
        duration: 3000,
      });
      setEditModalOpen(false);
    },
    onError: () => {
      showToast({
        type: "error",
        message: "피드 수정에 실패했습니다.",
        duration: 3000,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteFeed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      showToast({
        type: "success",
        message: "피드가 삭제되었습니다.",
        duration: 3000,
      });
      setDeleteModalOpen(false);
    },
    onError: () => {
      showToast({
        type: "error",
        message: "피드 삭제에 실패했습니다.",
        duration: 3000,
      });
    },
  });

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

  const handleEdit = () => {
    handleCloseDropdown();
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    handleCloseDropdown();
    setDeleteModalOpen(true);
  };

  const handleEditSubmit = (newContent: string) => {
    updateMutation.mutate(newContent);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate();
  };

  const handleReport = (reason: string, detail?: string) => {
    reportMutation.mutate({
      targetType: "FEED",
      targetId: id,
      reasonCode: reason,
      reasonDetail: detail,
    });
  };

  const isMyFeed = me?.username === user?.username;

  return (
    <StyledContainer>
      <Avatar
        src={user?.profileImage || ""}
        alt="사용자 프로필 이미지"
        size={40}
        background={avatarBackground}
      />

      <StyledContentContainer>
        <StyledTitleContainer>
          <StyledTitleWrapper>
            <StyledTitle>{user?.username}</StyledTitle>
            <StyledCreatedAt>{formattedCreatedAt}</StyledCreatedAt>
          </StyledTitleWrapper>

          {isLoggedIn && (
            <StyledMoreButtonWrapper ref={dropdownRef}>
              <StyledMoreButton
                onClick={handleToggleDropdown}
                aria-label="더보기 옵션 열기"
              >
                <MoreIcon />
              </StyledMoreButton>

              {isDropdownOpen && (
                <OptionsDropdown
                  isMyFeed={isMyFeed}
                  onHide={() => {
                    handleCloseDropdown();
                    // 관심 없음 처리 로직을 여기에 추가할 수 있음
                  }}
                  onReport={() => {
                    handleCloseDropdown();
                    setReportModalOpen(true);
                  }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}

              {isReportModalOpen && (
                <ReportModal
                  isOpen={isReportModalOpen}
                  onClose={() => setReportModalOpen(false)}
                  onReport={handleReport}
                  targetType="FEED"
                  targetId={id}
                />
              )}
            </StyledMoreButtonWrapper>
          )}
        </StyledTitleContainer>

        <StyledBodyContainer>{content}</StyledBodyContainer>

        <StyledIconButtonContainer>
          <FeedHeartButton
            likeCount={count}
            isLiked={liked}
            isLoggedIn={isLoggedIn}
            onClick={() => {
              setCount(liked ? count - 1 : count + 1);
              setLiked(!liked);
              likeMutation.mutate();
            }}
            onLoginRequired={handleLoginRequired}
          />
          <FeedCommentButton
            commentCount={commentCount}
            onClick={() => {
              // 모바일 핸들러가 있으면 사용 (바텀시트), 없으면 페이지 이동
              if (onMobileFeedClick) {
                onMobileFeedClick(id);
              } else if (onDesktopFeedClick) {
                onDesktopFeedClick(id);
              }
            }}
          />
        </StyledIconButtonContainer>

        {isEditModalOpen && (
          <FloatingInputModal
            onClose={() => setEditModalOpen(false)}
            onSubmit={handleEditSubmit}
            actionType="피드"
            editMode={true}
            initialContent={content}
          />
        )}

        {isDeleteModalOpen && (
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="피드를 삭제하시겠습니까?"
            message="삭제된 피드는 복구할 수 없습니다."
            confirmText="삭제"
            cancelText="취소"
            isDanger={true}
          />
        )}
      </StyledContentContainer>
    </StyledContainer>
  );
};

// export const FeedBlock = React.memo(FeedBlockComponent);

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 10px 16px;
  align-items: start;
  margin-bottom: 8px;
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
