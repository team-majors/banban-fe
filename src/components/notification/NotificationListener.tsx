"use client";

import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useNotificationWebSocket } from "@/hooks/useNotificationWebSocket";
import { useNotificationStore } from "@/store/useNotificationStore";
import type { Notification } from "@/types/notification";
import type { WSNotificationMessage } from "@/types/notification";
import { useRouter } from "next/navigation";
import { logger } from "@/utils/logger";
import { useToast } from "@/components/common/Toast/useToast";
import { useQueryClient } from "@tanstack/react-query";

const TIMEOUT_THRESHOLD_MS = 70_000;

function mapNotificationPayload(payload: WSNotificationMessage): Notification {
  return {
    id: payload.id,
    user_id: payload.user_id,
    notification_type: payload.notification_type,
    type: payload.notification_type,
    from_user_id: payload.from_user_id,
    target_type: payload.target_type,
    target_id: payload.target_id,
    message: payload.message,
    is_read: payload.is_read,
    created_at: payload.created_at,
    read_at: payload.read_at,
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

      toast.showToast({
        type: "info",
        message: notification.message,
        duration: 3000,
        action: notification.target_type === "FEED"
          ? {
              label: "보기",
              onClick: () => {
                queryClient.invalidateQueries({
                  queryKey: ["comments", notification.target_id],
                });
                router.push(`/feeds/${notification.target_id}`);
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
