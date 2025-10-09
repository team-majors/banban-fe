"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import STORAGE_KEYS from "@/constants/storageKeys";
import { logger } from "@/utils/logger";
import type {
  Notification,
  NotificationConnectionStatus,
  SSEConnectedEvent,
  SSEErrorEvent,
  SSEHeartbeatEvent,
} from "@/types/notification";

interface NotificationSSEOptions {
  enabled: boolean;
  onNotification: (notification: Notification) => void;
  onConnected?: (event: SSEConnectedEvent) => void;
  onConnecting?: () => void;
  onHeartbeat?: (heartbeat: Date) => void;
  onError?: (payload: { event: Event; data?: SSEErrorEvent | null }) => void;
  onReconnect?: (attempt: number, delay: number) => void;
  onDisconnected?: () => void;
}

const STREAM_ENDPOINT = "/api/notifications/stream";
const RETRY_BASE_DELAY = 1000;
const RETRY_MAX_DELAY = 15000;

interface RetryState {
  count: number;
  timer: number | null;
}

export function useNotificationSSE({
  enabled,
  onNotification,
  onConnected,
  onConnecting,
  onHeartbeat,
  onError,
  onReconnect,
  onDisconnected,
}: NotificationSSEOptions) {
  const [status, setStatus] = useState<NotificationConnectionStatus>("idle");
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryState = useRef<RetryState>({ count: 0, timer: null });
  const shouldReconnect = useRef(true);

  const streamUrl = useMemo(() => {
    if (typeof window === "undefined") return null;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}${STREAM_ENDPOINT}`
      : STREAM_ENDPOINT;

    const token = window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) return baseUrl;
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}token=${encodeURIComponent(token)}`;
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !streamUrl) {
      disconnect();
      setStatus("idle");
      return;
    }

    shouldReconnect.current = true;
    connect();

    return () => {
      shouldReconnect.current = false;
      disconnect("disconnected");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, streamUrl]);

  const connect = () => {
    if (typeof window === "undefined" || !streamUrl) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    logger.info("SSE 연결 시도", { streamUrl });
    onConnecting?.();
    setStatus("connecting");

    try {
      const eventSource = new EventSource(streamUrl, { withCredentials: true });
      eventSourceRef.current = eventSource;

      eventSource.addEventListener("connected", (event) => {
        retryState.current.count = 0;
        if (retryState.current.timer) {
          window.clearTimeout(retryState.current.timer);
          retryState.current.timer = null;
        }

        setStatus("connected");

        try {
          const data: SSEConnectedEvent = JSON.parse(event.data);
          logger.info("SSE 연결 완료", data);
          onConnected?.(data);
        } catch (error) {
          logger.warn("SSE 연결 이벤트 파싱 실패", error);
          onConnected?.({ message: "connected" });
        }
      });

      eventSource.addEventListener("notification", (event) => {
        try {
          const notification: Notification = JSON.parse(event.data);
          logger.info("새 알림 수신", { notificationId: notification.id });
          onNotification(notification);
        } catch (error) {
          logger.error("알림 이벤트 파싱 실패", error);
        }
      });

      eventSource.addEventListener("heartbeat", (event) => {
        try {
          const data: SSEHeartbeatEvent = JSON.parse(event.data);
          const timestamp = new Date(Number(data.timestamp) * 1000);
          setLastHeartbeat(timestamp);
          onHeartbeat?.(timestamp);
        } catch (error) {
          logger.warn("Heartbeat 파싱 실패", error);
        }
      });

      eventSource.addEventListener("error", (event) => {
        if (!shouldReconnect.current) {
          logger.info("SSE 에러 - 수동 종료 상태", { readyState: eventSource.readyState });
          return;
        }

        setStatus("reconnecting");

        let payload: SSEErrorEvent | null = null;
        try {
          if ("data" in event && typeof event.data === "string" && event.data) {
            payload = JSON.parse(event.data);
          }
        } catch (error) {
          logger.warn("SSE 에러 데이터 파싱 실패", error);
        }

        onError?.({ event, data: payload });

        scheduleReconnect();
      });

      eventSource.onerror = (event) => {
        logger.error("SSE 연결 에러", event);
        if (!shouldReconnect.current) {
          return;
        }

        setStatus("reconnecting");
        scheduleReconnect();
      };
    } catch (error) {
      logger.error("SSE 연결 중 예외 발생", error);
      setStatus("error");
      onError?.({ event: new Event("exception"), data: { message: "연결 실패" } });
      scheduleReconnect();
    }
  };

  const scheduleReconnect = () => {
    if (!shouldReconnect.current) {
      logger.info("SSE 재연결 스킵 - 수동 종료 상태");
      return;
    }

    retryState.current.count += 1;
    const attempt = retryState.current.count;
    const delay = Math.min(RETRY_BASE_DELAY * 2 ** (attempt - 1), RETRY_MAX_DELAY);

    if (retryState.current.timer) {
      window.clearTimeout(retryState.current.timer);
    }

    onReconnect?.(attempt, delay);

    retryState.current.timer = window.setTimeout(() => {
      connect();
    }, delay);
  };

  const disconnect = (finalStatus: NotificationConnectionStatus = "disconnected") => {
    shouldReconnect.current = false;

    if (retryState.current.timer) {
      window.clearTimeout(retryState.current.timer);
      retryState.current.timer = null;
    }

    if (eventSourceRef.current) {
      logger.info("SSE 연결 종료");
      try {
        eventSourceRef.current.close();
      } catch (error) {
        logger.warn("SSE 종료 중 예외", error);
      }
      eventSourceRef.current = null;
    }

    if (finalStatus === "disconnected") {
      onDisconnected?.();
    }

    setStatus(finalStatus);
  };

  return {
    status,
    lastHeartbeat,
    disconnect,
  };
}
