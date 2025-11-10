"use client";

import { useMemo, useCallback } from "react";
import type { ReactElement } from "react";
import styled from "styled-components";
import type {
  Notification,
  NotificationConnectionStatus,
  NotificationType,
} from "@/types/notification";
import { useInView } from "react-intersection-observer";
import type { InfiniteData } from "@tanstack/react-query";
import type { NotificationResponse } from "@/remote/notification";
import { Avatar } from "@/components/common/Avatar";
import { useToast } from "@/components/common/Toast/useToast";

interface NotificationMenuProps {
  data?: InfiniteData<NotificationResponse>;
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  connectionStatus: NotificationConnectionStatus;
  isTimeout: boolean;
  onMarkAllRead: () => void;
  onDeleteRead: () => void;
  onItemClick: (notification: Notification) => void;
}

const STATUS_LABELS: Record<NotificationConnectionStatus, string> = {
  idle: "대기",
  connecting: "연결 중",
  connected: "연결됨",
  reconnecting: "재연결 중",
  disconnected: "연결 끊김",
  error: "오류",
};

export default function NotificationMenu({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  connectionStatus,
  isTimeout,
  onMarkAllRead,
  onDeleteRead,
  onItemClick,
}: NotificationMenuProps) {
  const { showToast } = useToast();

  const { ref: scrollTriggerRef } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const allNotifications = useMemo(
    () => data?.pages?.flatMap((page) => page.data.notifications) ?? [],
    [data],
  );

  const unreadCount = useMemo(
    () => data?.pages[0]?.data.unreadCount ?? 0,
    [data],
  );

  const hasUnread = unreadCount > 0;

  const readCount = useMemo(
    () => allNotifications.filter((n) => n.isRead).length,
    [allNotifications],
  );

  const hasRead = readCount > 0;

  const statusLabel = useMemo(() => {
    if (isTimeout) return "지연됨";
    return STATUS_LABELS[connectionStatus] ?? "상태 미확인";
  }, [connectionStatus, isTimeout]);

  const handleItemClick = useCallback(
    (notification: Notification) => {
      if (notification.isRead) {
        showToast({
          type: "info",
          message: "해당 주제의 기간이 종료되어 이동할 수 없습니다.",
          duration: 2500,
        });
        return;
      }
      onItemClick(notification);
    },
    [onItemClick, showToast],
  );

  return (
    <Menu role="menu" aria-label="알림 메뉴">
      <MenuHeader>
        <MenuTitle>알림</MenuTitle>
        <StatusBadge data-status={connectionStatus} data-timeout={isTimeout}>
          {statusLabel}
        </StatusBadge>
        <MarkAllButton
          type="button"
          onClick={onMarkAllRead}
          disabled={!hasUnread}
        >
          모두 읽음
        </MarkAllButton>
        <DeleteButton
          type="button"
          onClick={onDeleteRead}
          disabled={!hasRead}
          title={
            hasRead ? "읽은 알림을 모두 삭제합니다" : "읽은 알림이 없습니다"
          }
        >
          삭제
        </DeleteButton>
      </MenuHeader>

      <MenuContent>
        {allNotifications.length === 0 ? (
          <EmptyState>받은 알림이 없습니다.</EmptyState>
        ) : (
          <>
            <NotificationList>
              {allNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => handleItemClick(notification)}
                  $unread={!notification.isRead}
                  $type={notification.type}
                  $expired={notification.isRead}
                  aria-label={`${notification.fromUser?.username}: ${
                    notification.message
                  }${
                    !notification.isRead ? " (읽지 않은 알림)" : " (읽은 알림)"
                  }${notification.isRead ? " (기간 종료됨)" : ""}`}
                  aria-disabled={notification.isRead}
                >
                  <AvatarWrapper
                    $unread={!notification.isRead}
                    $type={notification.type}
                  >
                    <Avatar
                      src={notification.fromUser?.profileImage || ""}
                      alt={notification.fromUser?.username || "사용자"}
                      size={32}
                    />
                    {!notification.isRead && (
                      <UnreadIndicator $type={notification.type} />
                    )}
                  </AvatarWrapper>
                  <NotificationContent>
                    <UserInfo>
                      <Username $unread={!notification.isRead}>
                        {notification.fromUser?.username}
                      </Username>
                      <Meta>{formatTimestamp(notification.createdAt)}</Meta>
                    </UserInfo>
                    <Message $unread={!notification.isRead}>
                      {formatNotificationMessage(notification.message)}
                    </Message>
                    {notification.isRead && (
                      <ExpiredBadge>기간 종료됨</ExpiredBadge>
                    )}
                  </NotificationContent>
                </NotificationItem>
              ))}
            </NotificationList>
            {hasNextPage && (
              <InfiniteScrollTrigger
                ref={scrollTriggerRef}
                data-fetching={isFetchingNextPage}
              >
                {isFetchingNextPage ? "로딩 중..." : "더 불러오기"}
              </InfiniteScrollTrigger>
            )}
          </>
        )}
      </MenuContent>
    </Menu>
  );
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;

  return date.toLocaleString();
}

function formatNotificationMessage(message: string): (string | ReactElement)[] {
  const keywords = ["새 댓글", "멘션"];
  let parts: (string | ReactElement)[] = [message];

  keywords.forEach((keyword) => {
    parts = parts.flatMap((part, partIndex) => {
      if (typeof part !== "string") return [part];

      const regex = new RegExp(`(${keyword})`, "g");
      const split = part.split(regex);

      return split.map((text, idx) =>
        text === keyword ? (
          <strong key={`${partIndex}-${idx}`}>{text}</strong>
        ) : (
          text
        ),
      );
    });
  });

  return parts;
}

const Menu = styled.div`
  position: absolute;
  top: 54px;
  right: 0;
  width: 308px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08),
    0 6px 12px rgba(15, 23, 42, 0.04);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  z-index: 1000;
`;

const MenuHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-bottom: 1px solid #eef2f6;
`;

const MenuTitle = styled.h3`
  margin: 0;
  flex: 1;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
`;

const StatusBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: -0.02em;
  padding: 4px 6px;
  border-radius: 9999px;
  background: #e2e8f0;
  color: #475569;

  &[data-status="connected"] {
    background: #dcfce7;
    color: #15803d;
  }

  &[data-status="connecting"] {
    background: #e0f2fe;
    color: #0284c7;
  }

  &[data-status="reconnecting"] {
    background: #fef3c7;
    color: #b45309;
  }

  &[data-status="disconnected"],
  &[data-status="error"],
  &[data-timeout="true"] {
    background: #fee2e2;
    color: #b91c1c;
  }
`;

const MarkAllButton = styled.button`
  border: none;
  background: transparent;
  font-size: 11px;
  font-weight: 600;
  color: #6366f1;
  cursor: pointer;
  padding: 4px 6px;

  &:hover:not(:disabled) {
    color: #4f46e5;
  }

  &:disabled {
    color: #cbd5f5;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  border: none;
  background: transparent;
  font-size: 11px;
  font-weight: 600;
  color: #ef4444;
  cursor: pointer;
  padding: 4px 6px;

  &:hover:not(:disabled) {
    color: #dc2626;
  }

  &:disabled {
    color: #fecaca;
    cursor: not-allowed;
  }
`;

const MenuContent = styled.div`
  max-height: 320px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.3);
    border-radius: 999px;
  }
`;

const NotificationList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NotificationItem = styled.li<{
  $unread: boolean;
  $type: NotificationType;
  $expired: boolean;
}>`
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid #f1f5f9;
  border-left: ${({ $unread, $type, $expired }) =>
    $expired
      ? "2px solid transparent"
      : $unread
      ? $type === "MENTION"
        ? "2px solid #10b981"
        : "2px solid #6366f1"
      : "2px solid transparent"};
  padding-left: 12px;
  cursor: ${({ $expired }) => ($expired ? "default" : "pointer")};
  background: ${({ $unread, $type, $expired }) => {
    if ($expired) {
      return "rgba(226, 232, 240, 0.5)";
    }
    if ($unread) {
      return $type === "MENTION" ? "#ecfdf5" : "#eef6ff";
    }
    return "transparent";
  }};
  filter: ${({ $expired }) => ($expired ? "grayscale(50%)" : "none")};
  opacity: ${({ $expired }) => ($expired ? 0.5 : 1)};
  transition: background 0.2s ease, border-left-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: ${({ $unread, $type, $expired }) => {
      if ($expired) {
        return "rgba(226, 232, 240, 0.5)";
      }
      return $unread
        ? $type === "MENTION"
          ? "#d1fae5"
          : "#e0efff"
        : "#eef2ff";
    }};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const AvatarWrapper = styled.div<{ $unread: boolean; $type: NotificationType }>`
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const NotificationContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  justify-content: space-between;
`;

const Username = styled.span<{ $unread: boolean }>`
  font-weight: ${({ $unread }) => ($unread ? 700 : 600)};
  font-size: 12px;
  color: ${({ $unread }) => ($unread ? "#0f172a" : "#475569")};
  transition: all 0.2s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 1;
`;

const Message = styled.p<{ $unread: boolean }>`
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
  color: ${({ $unread }) => ($unread ? "#0f172a" : "#64748b")};
  font-weight: ${({ $unread }) => ($unread ? 500 : 400)};
  transition: all 0.2s ease;
`;

const ExpiredBadge = styled.span`
  display: inline-block;
  margin-top: 5px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: #f1f5f9;
  color: #64748b;
`;

const Meta = styled.span`
  display: block;
  font-size: 11px;
  color: #94a3b8;
  white-space: nowrap;
`;

const UnreadIndicator = styled.div<{ $type: NotificationType }>`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $type }) => ($type === "MENTION" ? "#10b981" : "#6366f1")};
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 1px #e2e8f0;
`;

const EmptyState = styled.div`
  padding: 28px 20px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
`;

const InfiniteScrollTrigger = styled.div`
  padding: 12px 14px;
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  border-top: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #eef2ff;
  }

  &[data-fetching="true"] {
    cursor: not-allowed;
    color: #cbd5e1;
  }
`;
