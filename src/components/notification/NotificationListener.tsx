"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { useNotificationWebSocket } from "@/hooks/useNotificationWebSocket";
import { useNotificationStore } from "@/store/useNotificationStore";
import type { Notification } from "@/types/notification";
import type { WSNotificationMessage } from "@/types/notification";
import { useRouter } from "next/navigation";
import { logger } from "@/utils/logger";
import { useToast } from "@/components/common/Toast/useToast";

const TIMEOUT_THRESHOLD_MS = 70_000;

function mapNotificationPayload(payload: WSNotificationMessage): Notification {
  return {
    id: payload.id,
    type: payload.notification_type,
    targetType: payload.target_type,
    targetId: payload.target_id,
    relatedId: payload.related_id,
    message: payload.message,
    isRead: payload.is_read,
    isExpired: payload.is_expired,
    createdAt: payload.created_at,
    readAt: payload.read_at,
  };
}

export default function NotificationListener() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  const addNotification = useNotificationStore((state) => state.addNotification);
  const setConnectionStatus = useNotificationStore(
    (state) => state.setConnectionStatus,
  );
  const setIsTimeout = useNotificationStore((state) => state.setIsTimeout);
  const setLastActivity = useNotificationStore(
    (state) => state.setLastActivity,
  );
  const setReconnectAttempts = useNotificationStore(
    (state) => state.setReconnectAttempts,
  );
  const resetConnectionState = useNotificationStore(
    (state) => state.resetConnectionState,
  );

  const {
    status,
    lastActivity,
    reconnectAttempts,
  } = useNotificationWebSocket({
    enabled: isLoggedIn,
    onNotification: (payload) => {
      const notification = mapNotificationPayload(payload);
      addNotification(notification);

      // React Query 캐시 무효화하여 최신 알림 목록 동기화
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      toast.showToast({
        type: "info",
        message: notification.message,
        duration: 3000,
        action:
          notification.targetType === "FEED"
            ? {
                label: "보기",
                onClick: () => {
                  queryClient.invalidateQueries({
                    queryKey: ["comments", notification.targetId],
                  });
                  router.push(`/feeds/${notification.targetId}`);
                },
              }
            : notification.targetType === "COMMENT" && notification.relatedId
            ? {
                label: "보기",
                onClick: () => {
                  queryClient.invalidateQueries({
                    queryKey: ["comments", notification.relatedId],
                  });
                  router.push(`/feeds/${notification.relatedId}`);
                },
              }
            : undefined,
      });
    },
    onConnected: (payload) => {
      logger.info("✅ 실시간 알림 연결됨", payload);
    },
    onSystemMessage: (payload) => {
      logger.info("WebSocket 시스템 메시지 수신", payload);
    },
    onError: (event, data) => {
      logger.error("❌ 실시간 알림 연결 실패", { event, data });
    },
    onDisconnected: (event) => {
      logger.warn("WebSocket 연결 종료", {
        code: event.code,
        reason: event.reason,
      });
    },
  });

  useEffect(() => {
    if (!isLoggedIn) {
      resetConnectionState();
    }
  }, [isLoggedIn, resetConnectionState]);

  useEffect(() => {
    setConnectionStatus(status);
  }, [status, setConnectionStatus]);

  useEffect(() => {
    setReconnectAttempts(reconnectAttempts);
  }, [reconnectAttempts, setReconnectAttempts]);

  useEffect(() => {
    setLastActivity(lastActivity);
  }, [lastActivity, setLastActivity]);

  useEffect(() => {
    if (lastActivity === null) {
      setIsTimeout(false);
      return () => undefined;
    }

    setIsTimeout(false);

    const timer = window.setTimeout(() => {
      const diff = Date.now() - lastActivity;
      setIsTimeout(diff >= TIMEOUT_THRESHOLD_MS);
    }, TIMEOUT_THRESHOLD_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [lastActivity, setIsTimeout]);

  return null;
}
