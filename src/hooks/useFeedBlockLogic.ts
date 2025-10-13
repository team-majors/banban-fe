import { SectionContext } from "@/components/layout/RightSection/SectionContext";
import { useAuthStore } from "@/store/useAuthStore";
import { Feed } from "@/types/feeds";
import { Poll } from "@/types/poll";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useClickOutside } from "./useClickOutside";
import { useFeedLikeOptimisticUpdate } from "./useLikeOptimisticUpdate";
import { useVoteOptionColor } from "./useVoteOptionColor";
import useReportMutation from "./useReportMutation";

export function useFeedBlockLogic(feed: Feed, pollData: Poll) {
  const { isLoggedIn, user: me } = useAuthStore();
  const { setSectionStatus, setTargetFeed } = useContext(SectionContext);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);

  // 로컬 optimistic state (초기값은 feed로부터)
  const [liked, setLiked] = useState<boolean>(feed?.isLiked ?? false);
  const [count, setCount] = useState<number>(feed?.likeCount ?? 0);

  // 외부 변경(예: 부모로부터 feed가 업데이트되는 경우)에 동기화
  useEffect(() => {
    setLiked(feed.isLiked);
    setCount(feed.likeCount);
  }, [feed.isLiked, feed.likeCount]);

  // hooks that must be called at top-level
  const likeMutation = useFeedLikeOptimisticUpdate({ id: feed.id });
  const avatarBackground = useVoteOptionColor(feed.userVoteOptionId, pollData);
  const reportMutation = useReportMutation();

  // stable callbacks
  const handleCloseDropdown = useCallback(() => setDropdownOpen(false), []);
  useClickOutside(dropdownRef, handleCloseDropdown);

  const handleToggleDropdown = useCallback(
    () => setDropdownOpen((prev) => !prev),
    [],
  );

  const handleOpenReportModal = useCallback(() => {
    handleCloseDropdown();
    setReportModalOpen(true);
  }, [handleCloseDropdown]);

  const handleCloseReportModal = useCallback(
    () => setReportModalOpen(false),
    [],
  );

  const handleReport = useCallback(
    (reason: string, detail?: string) => {
      // 상태(state)에 의존하지 않고 인자로 받은 값을 바로 사용 — race condition 방지
      reportMutation.mutate({
        targetType: "FEED",
        targetId: feed.id,
        reasonCode: reason,
        reasonDetail: detail || "",
      });

      // 모달 닫기 (UI 즉시 반영)
      setReportModalOpen(false);
      // 필요한 경우 부모 콜백 호출 (onReported 등)을 여기서 호출하도록 확장 가능
    },
    [reportMutation, feed.id],
  );

  const handleToggleLike = useCallback(() => {
    // functional 업데이트로 이전 값에 안전하게 접근
    setLiked((prev) => {
      const next = !prev;
      setCount((c) => c + (next ? 1 : -1));
      return next;
    });
    likeMutation.mutate();
  }, [likeMutation]);

  const handleCommentClick = useCallback(() => {
    setTargetFeed(feed);
    setSectionStatus("comments");
  }, [feed, setTargetFeed, setSectionStatus]);

  const formattedCreatedAt = useMemo(
    () => new Date(feed.createdAt).toLocaleDateString(),
    [feed.createdAt],
  );

  const isMyFeed = useMemo(
    () => me?.username === feed.user.username,
    [me?.username, feed.user.username],
  );

  return {
    dropdownRef,
    isDropdownOpen,
    isReportModalOpen,
    liked,
    count,
    avatarBackground,
    isLoggedIn,
    isMyFeed,
    formattedCreatedAt,
    // handlers
    handleToggleDropdown,
    handleCloseDropdown,
    handleOpenReportModal,
    handleCloseReportModal,
    handleReport,
    handleToggleLike,
    handleCommentClick,
    // for advanced use: setter
    setReportModalOpen,
  } as const;
}
