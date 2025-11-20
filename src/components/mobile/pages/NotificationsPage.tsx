"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import type {
  Notification,
  NotificationConnectionStatus,
} from "@/types/notification";
import { useInView } from "react-intersection-observer";
import { Avatar } from "@/components/common/Avatar";
import { useToast } from "@/components/common/Toast/useToast";
import { useNotifications } from "@/hooks/api/notification/useNotifications";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useQueryClient } from "@tanstack/react-query";
import {
  deleteReadNotifications,
  markAllNotificationsAsRead,
  markNotificationsAsRead,
} from "@/remote/notification";
import { logger } from "@/utils/logger";
import { useFeeds } from "@/hooks/api/feed/useFeeds";
import { useFeedFilterStore } from "@/store/useFeedFilterStore";
import { SectionContext } from "@/components/layout/RightSection/SectionContext";
import dynamic from "next/dynamic";
import RightSection from "@/components/layout/RightSection/RightSection";
import type { Feed } from "@/types/feeds";

const DynamicBottomSheet = dynamic(
  () =>
    import("@/components/common/BottomSheet/BottomSheet").then(
      (mod) => mod.BottomSheet,
    ),
  { ssr: false, loading: () => null },
);

const STATUS_LABELS: Record<NotificationConnectionStatus, string> = {
  idle: "대기",
  connecting: "연결 중",
  connected: "연결됨",
  reconnecting: "재연결 중",
  disconnected: "연결 끊김",
  error: "오류",
};

const STATUS_BG_COLORS: Record<NotificationConnectionStatus, string> = {
  idle: "bg-[#e9eaeb]",
  connecting: "bg-[#fff3cd]",
  connected: "bg-[#d4edda]",
  reconnecting: "bg-[#fff3cd]",
  disconnected: "bg-[#f8d7da]",
  error: "bg-[#f8d7da]",
};

const STATUS_TEXT_COLORS: Record<NotificationConnectionStatus, string> = {
  idle: "text-[#535862]",
  connecting: "text-[#856404]",
  connected: "text-[#155724]",
  reconnecting: "text-[#856404]",
  disconnected: "text-[#721c24]",
  error: "text-[#721c24]",
};

export default function NotificationsPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // 바텀시트 상태
  const [selectedFeedId, setSelectedFeedId] = useState<number | null>(null);
  const [sectionStatus, setSectionStatus] = useState<"feeds" | "comments">(
    "comments",
  );
  const [targetFeed, setTargetFeed] = useState<Feed | null>(null);

  const connectionStatus = useNotificationStore(
    (state) => state.connectionStatus,
  );
  const isTimeout = useNotificationStore((state) => state.isTimeout);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllRead = useNotificationStore((state) => state.markAllAsRead);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotifications({ enabled: true });

  const allNotifications =
    data?.pages?.flatMap((page) => page.data.notifications) ?? [];

  // 피드 목록 가져오기
  const { sortBy, filterType } = useFeedFilterStore();
  const { data: feedsData } = useFeeds({
    sort_by: sortBy,
    filter_type: filterType,
  });

  // 선택된 피드 찾기
  const selectedFeed = useMemo(() => {
    if (!selectedFeedId || !feedsData) return null;

    let found: Feed | null = null;
    feedsData.pages?.some((page) => {
      const hit = page?.data?.content?.find(
        (item: Feed) => item?.id === selectedFeedId,
      );
      if (hit) {
        found = hit;
        return true;
      }
      return false;
    });

    return found;
  }, [selectedFeedId, feedsData]);

  // 선택된 피드가 변경되면 targetFeed 업데이트
  useEffect(() => {
    if (!selectedFeed) return;
    setTargetFeed(selectedFeed);
  }, [selectedFeed, setTargetFeed]);

  const { ref: loadMoreRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      markAllRead();
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (error) {
      logger.error("전체 알림 읽음 처리 실패", error);
    }
  };

  const handleDeleteRead = async () => {
    try {
      await deleteReadNotifications();
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      logger.info("읽은 알림 삭제 완료");
    } catch (error) {
      logger.error("읽은 알림 삭제 실패", error);
      showToast({
        type: "error",
        message: "알림 삭제에 실패했습니다.",
        duration: 3000,
      });
    }
  };

  const handleNotificationItemClick = async (notification: Notification) => {
    // 읽음 처리
    if (!notification.isRead) {
      try {
        await markNotificationsAsRead([notification.id]);
        markAsRead([notification.id]);
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      } catch (error) {
        logger.error("알림 읽음 처리 실패", error);
      }
    }

    // 바텀시트 열기
    if (notification.targetType === "FEED" && notification.targetId) {
      setSelectedFeedId(notification.targetId);
      setSectionStatus("comments");
      // 브라우저 히스토리에 상태 추가 (뒤로가기 처리용)
      window.history.pushState({ bottomSheet: true }, "");
    } else if (
      notification.targetType === "COMMENT" &&
      notification.relatedId
    ) {
      // 댓글 알림의 경우 relatedId가 feedId
      setSelectedFeedId(notification.relatedId);
      setSectionStatus("comments");
      // 브라우저 히스토리에 상태 추가 (뒤로가기 처리용)
      window.history.pushState({ bottomSheet: true }, "");
    }
  };

  const handleCloseBottomSheet = useCallback(() => {
    setSelectedFeedId(null);
    setTargetFeed(null);
  }, []);

  // 브라우저 뒤로가기 처리
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // 바텀시트가 열려있을 때 뒤로가기를 누르면 바텀시트만 닫기
      if (selectedFeedId !== null) {
        event.preventDefault();
        handleCloseBottomSheet();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [selectedFeedId, handleCloseBottomSheet]);

  const formatTimeAgo = useCallback((createdAt: string): string => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return created.toLocaleDateString();
  }, []);

  const sectionContextValue = useMemo(
    () => ({
      sectionStatus,
      setSectionStatus,
      targetFeed,
      setTargetFeed,
      inBottomSheet: true,
    }),
    [sectionStatus, targetFeed],
  );

  return (
    <>
      <div className="flex flex-col w-full h-full bg-white">
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#e9eaeb]">
          <h1 className="text-xl font-bold text-[#181d27]">알림</h1>
          <span
            className={`text-xs px-2 py-1 rounded-xl ${STATUS_BG_COLORS[connectionStatus]} ${STATUS_TEXT_COLORS[connectionStatus]}`}
          >
            {STATUS_LABELS[connectionStatus]}
          </span>
        </div>

        <div className="flex gap-2 px-4 py-3 border-b border-[#e9eaeb]">
          <button
            onClick={handleMarkAllRead}
            className="text-sm px-3 py-1.5 border border-[#d5d7da] rounded-md bg-white text-[#535862] cursor-pointer transition-colors hover:bg-[#f4f6f8] active:bg-[#e9eaeb]"
          >
            모두 읽음
          </button>
          <button
            onClick={handleDeleteRead}
            className="text-sm px-3 py-1.5 border border-[#d5d7da] rounded-md bg-white text-[#535862] cursor-pointer transition-colors hover:bg-[#f4f6f8] active:bg-[#e9eaeb]"
          >
            읽은 알림 삭제
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {allNotifications.length === 0 ? (
            <div className="flex items-center justify-center py-15 px-5 text-base text-[#858d9d]">
              알림이 없습니다
            </div>
          ) : (
            <>
              {allNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationItemClick(notification)}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-[#e9eaeb] cursor-pointer transition-colors hover:bg-[#f4f6f8] active:bg-[#e9eaeb] ${
                    notification.isRead ? "bg-white" : "bg-[#f8f9ff]"
                  }`}
                >
                  <div className="flex-shrink-0">
                    <Avatar
                      src={notification.fromUser?.profileImage || "/user.png"}
                      alt={notification.fromUser?.username || "사용자"}
                      size={40}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#181d27] mb-1 break-words">
                      {notification.message}
                    </p>
                    <span className="text-xs text-[#858d9d]">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-[#3f13ff] flex-shrink-0" />
                  )}
                </div>
              ))}
              {hasNextPage && (
                <div
                  ref={loadMoreRef}
                  className="p-4 text-center text-sm text-[#858d9d]"
                >
                  {isFetchingNextPage ? "로딩 중..." : ""}
                </div>
              )}
            </>
          )}
        </div>

        {isTimeout && (
          <div className="px-4 py-3 bg-[#fff3cd] text-[#856404] text-center text-sm border-t border-[#ffeaa7]">
            알림 연결 시간이 초과되었습니다. 새로고침해주세요.
          </div>
        )}
      </div>

      {/* 바텀시트 - 댓글 표시 */}
      {selectedFeedId && selectedFeed && (
        <SectionContext.Provider value={sectionContextValue}>
          <DynamicBottomSheet
            isOpen={true}
            onClose={handleCloseBottomSheet}
            maxHeight={90}
          >
            <RightSection />
          </DynamicBottomSheet>
        </SectionContext.Provider>
      )}
    </>
  );
}
