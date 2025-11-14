"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { BellIcon, DotIcon } from "@/components/svg";
import NotificationMenu from "./NotificationMenu";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useNotifications } from "@/hooks/useNotifications";
import {
  deleteReadNotifications,
  markAllNotificationsAsRead,
  markNotificationsAsRead,
} from "@/remote/notification";
import type { Notification } from "@/types/notification";
import { useClickOutside } from "@/hooks/useClickOutside";

interface Props {
  isNew?: boolean;
}

export default function NotificationControls({ isNew }: Props) {
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  useClickOutside(notificationRef, () => setNotificationOpen(false), "click");

  const router = useRouter();
  const queryClient = useQueryClient();

  const connectionStatus = useNotificationStore(
    (state) => state.connectionStatus,
  );
  const isTimeout = useNotificationStore((state) => state.isTimeout);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllRead = useNotificationStore((state) => state.markAllAsRead);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotifications({ enabled: true });

  const unreadCount = useMemo(
    () => data?.pages[0]?.data.unreadCount ?? 0,
    [data],
  );

  const hasUnreadIndicator = useMemo(() => {
    if (typeof isNew === "boolean") return isNew;
    return unreadCount > 0;
  }, [isNew, unreadCount]);

  useEffect(() => {
    if (!isNotificationOpen) return;
    const allNotifications =
      data?.pages?.flatMap((page) => page.data.notifications) ?? [];
    const unreadIds = allNotifications
      .filter((notification) => !notification.isRead)
      .map((notification) => notification.id);
    if (unreadIds.length > 0) {
      markAsRead(unreadIds);
    }
  }, [isNotificationOpen, data, markAsRead]);

  const handleNotificationItemClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await markNotificationsAsRead([notification.id]);
        markAsRead([notification.id]);
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      } catch {
        // ignore
      }
    }
    setNotificationOpen(false);

    if (notification.targetType === "FEED" && notification.targetId) {
      router.push(`/feeds/${notification.targetId}`);
    } else if (
      notification.targetType === "COMMENT" &&
      notification.relatedId
    ) {
      router.push(`/feeds/${notification.relatedId}`);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      markAllRead();
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch {
      // ignore
    }
  };

  const handleDeleteRead = async () => {
    try {
      await deleteReadNotifications();
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch {
      // ignore
    }
  };

  return (
    <NotificationWrapper ref={notificationRef}>
      <IconButton
        aria-label="알림"
        onClick={() => setNotificationOpen((prev) => !prev)}
        $active={isNotificationOpen}
      >
        <BellIcon color="#3f13ff" />
        {hasUnreadIndicator && (
          <NotificationDot data-testid="notification-dot" />
        )}
      </IconButton>
      {isNotificationOpen && (
        <NotificationMenu
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          connectionStatus={connectionStatus}
          isTimeout={isTimeout}
          onMarkAllRead={handleMarkAllRead}
          onDeleteRead={handleDeleteRead}
          onItemClick={handleNotificationItemClick}
        />
      )}
    </NotificationWrapper>
  );
}

const NotificationWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 767px) {
    display: none;
  }
`;

const IconButton = styled.button<{ $active?: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 100%;
  background-color: ${({ $active }) =>
    $active ? "rgba(63, 19, 255, 0.12)" : "#f8fafc"};
  margin-right: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ $active }) =>
      $active ? "rgba(63, 19, 255, 0.18)" : "rgba(63, 19, 255, 0.1)"};
  }

  &:focus {
    outline: 2px solid #3e13ff6c;
    outline-offset: 2px;
  }

  @media (max-width: 767px) {
    width: 44px;
    height: 44px;
    margin-right: 4px;
  }
`;

const NotificationDot = styled(DotIcon)`
  position: absolute;
  right: 13px;
  top: 9px;

  @media (max-width: 767px) {
    right: 11px;
    top: 7px;
  }
`;
