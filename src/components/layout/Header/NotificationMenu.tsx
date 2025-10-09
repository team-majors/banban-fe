"use client";

import { useMemo } from "react";
import styled from "styled-components";
import type {
  Notification,
  NotificationConnectionStatus,
} from "@/types/notification";

interface NotificationMenuProps {
  notifications: Notification[];
  connectionStatus: NotificationConnectionStatus;
  isTimeout: boolean;
  onMarkAllRead: () => void;
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
  notifications,
  connectionStatus,
  isTimeout,
  onMarkAllRead,
  onItemClick,
}: NotificationMenuProps) {
  const hasUnread = notifications.some((notification) => !notification.is_read);

  const statusLabel = useMemo(() => {
    if (isTimeout) return "지연됨";
    return STATUS_LABELS[connectionStatus] ?? "상태 미확인";
  }, [connectionStatus, isTimeout]);

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
      </MenuHeader>

      <MenuContent>
        {notifications.length === 0 ? (
          <EmptyState>받은 알림이 없습니다.</EmptyState>
        ) : (
          <NotificationList>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                role="menuitem"
                tabIndex={0}
                onClick={() => onItemClick(notification)}
                $unread={!notification.is_read}
              >
                <Message>{notification.message}</Message>
                <Meta>{formatTimestamp(notification.created_at)}</Meta>
              </NotificationItem>
            ))}
          </NotificationList>
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

const Menu = styled.div`
  position: absolute;
  top: 54px;
  right: 0;
  width: 280px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow:
    0 12px 24px rgba(15, 23, 42, 0.08),
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

const NotificationItem = styled.li<{ $unread: boolean }>`
  padding: 12px 14px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  background: ${({ $unread }) => ($unread ? "#f8fafc" : "transparent")};
  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: #eef2ff;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Message = styled.p`
  margin: 0 0 4px 0;
  font-size: 13px;
  line-height: 1.4;
  color: #0f172a;
`;

const Meta = styled.span`
  display: block;
  font-size: 11px;
  color: #94a3b8;
`;

const EmptyState = styled.div`
  padding: 28px 20px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
`;
