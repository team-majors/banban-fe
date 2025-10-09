"use client";

import { useEffect, useMemo, useRef } from "react";
import { useNotificationSSE } from "@/hooks/useNotificationSSE";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/common/Toast/useToast";
import { logger } from "@/utils/logger";
import type { Notification } from "@/types/notification";

const HEARTBEAT_TIMEOUT_MS = 60_000;

export default function NotificationListener() {
  const { showToast } = useToast();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userId = useAuthStore((state) => state.user?.id);

  const addNotification = useNotificationStore((state) => state.addNotification);
  const incrementUnread = useNotificationStore((state) => state.incrementUnread);
  const clearAll = useNotificationStore((state) => state.clearAll);
  const setConnectionStatus = useNotificationStore((state) => state.setConnectionStatus);
  const setLastHeartbeat = useNotificationStore((state) => state.setLastHeartbeat);
  const setTimeoutState = useNotificationStore((state) => state.setTimeoutState);

  const timeoutNoticeShownRef = useRef(false);
  const errorNoticeShownRef = useRef(false);

  const enabled = useMemo(() => isLoggedIn && !!userId, [isLoggedIn, userId]);

  useEffect(() => {
    if (!enabled) {
      clearAll();
      timeoutNoticeShownRef.current = false;
      errorNoticeShownRef.current = false;
    }
  }, [enabled, clearAll]);

  const handleNotification = (notification: Notification) => {
    const storeState = useNotificationStore.getState();
    const alreadyExists = storeState.notifications.some(
      (item) => item.id === notification.id,
    );

    addNotification(notification);

    if (!notification.is_read && !alreadyExists) {
      incrementUnread();
    }

    showToast({ type: "info", message: notification.message });
  };

  const { status, lastHeartbeat } = useNotificationSSE({
    enabled,
    onNotification: handleNotification,
    onError: ({ data }) => {
      if (!enabled) return;

      const message =
        data?.message ?? "실시간 알림 연결 중 문제가 발생했습니다.";
      if (!errorNoticeShownRef.current) {
        showToast({ type: "error", message });
        errorNoticeShownRef.current = true;
      }
    },
  });

  useEffect(() => {
    if (!enabled) return;

    setConnectionStatus(status);

    if (status === "connecting") {
      setLastHeartbeat(null);
      setTimeoutState(false);
      timeoutNoticeShownRef.current = false;
    }

    if (status === "connected") {
      errorNoticeShownRef.current = false;
    }

    if (status === "error" || status === "disconnected") {
      logger.warn("SSE 연결 상태 비정상", { status });
    }
  }, [
    enabled,
    status,
    setConnectionStatus,
    setLastHeartbeat,
    setTimeoutState,
  ]);

  useEffect(() => {
    if (!enabled) return;

    if (!lastHeartbeat) {
      return;
    }

    setLastHeartbeat(lastHeartbeat.getTime());
    setTimeoutState(false);
    timeoutNoticeShownRef.current = false;

    const timer = window.setTimeout(() => {
      setTimeoutState(true);
      if (!timeoutNoticeShownRef.current) {
        showToast({
          type: "warning",
          message: "실시간 알림 연결이 지연되고 있습니다. 네트워크 상태를 확인해주세요.",
        });
        timeoutNoticeShownRef.current = true;
      }
    }, HEARTBEAT_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [enabled, lastHeartbeat, setLastHeartbeat, setTimeoutState, showToast]);

  return null;
}
