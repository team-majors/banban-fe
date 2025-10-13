"use client";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import STORAGE_KEYS from "@/constants/storageKeys";
import {logger} from "@/utils/logger";
import type {
  NotificationConnectionStatus,
  WSConnectedMessage,
  WSErrorMessage,
  WSMessage,
  WSNotificationMessage,
  WSPingMessage,
  WSPongMessage,
  WSSystemMessage,
} from "@/types/notification";

interface UseNotificationWebSocketOptions {
  enabled: boolean;
  onNotification: (notification: WSNotificationMessage) => void;
  onConnected?: (payload: WSConnectedMessage) => void;
  onSystemMessage?: (payload: WSSystemMessage) => void;
  onError?: (event: Event, payload?: WSErrorMessage) => void;
  onDisconnected?: (event: CloseEvent) => void;
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectBaseDelay?: number;
  reconnectMaxDelay?: number;
  pingIntervalMs?: number;
}

interface UseNotificationWebSocketResult {
  status: NotificationConnectionStatus;
  isConnected: boolean;
  reconnectAttempts: number;
  lastActivity: number | null;
  connect: () => void;
  disconnect: (finalStatus?: NotificationConnectionStatus) => void;
  sendMessage: (message: WSMessage) => void;
}

const WS_ENDPOINT = "/api/notifications/ws";
const DEFAULT_RECONNECT_BASE_DELAY = 1000;
const DEFAULT_RECONNECT_MAX_DELAY = 30000;
const DEFAULT_PING_INTERVAL = 45_000;

function resolveBaseWebSocketUrl(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL.replace(/\/$/, "");
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL);
      apiUrl.protocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
      apiUrl.pathname = `${apiUrl.pathname.replace(/\/$/, "")}${WS_ENDPOINT}`;
      return apiUrl.toString();
    } catch (error) {
      logger.warn("WebSocket URL 파싱 실패, window.location 기반으로 대체", error);
    }
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}${WS_ENDPOINT}`;
}

function appendToken(url: string, token?: string | null) {
  if (!token) return url;
  try {
    const target = new URL(url, typeof window !== "undefined" ? window.location.href : undefined);
    target.searchParams.set("token", token);
    return target.toString();
  } catch (error) {
    logger.warn("토큰을 WebSocket URL에 추가하지 못했습니다.", {error});
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}token=${encodeURIComponent(token)}`;
  }
}

export function useNotificationWebSocket(
    options: UseNotificationWebSocketOptions,
): UseNotificationWebSocketResult {
  const {
    enabled,
    onNotification,
    onConnected,
    onSystemMessage,
    onError,
    onDisconnected,
    autoReconnect = true,
    maxReconnectAttempts = 5,
    reconnectBaseDelay = DEFAULT_RECONNECT_BASE_DELAY,
    reconnectMaxDelay = DEFAULT_RECONNECT_MAX_DELAY,
    pingIntervalMs = DEFAULT_PING_INTERVAL,
  } = options;

  const [status, setStatus] = useState<NotificationConnectionStatus>("idle");
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastActivity, setLastActivity] = useState<number | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const connectRef = useRef<() => void>(() => {
  });
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shouldReconnectRef = useRef(false);
  const baseUrl = useMemo(resolveBaseWebSocketUrl, []);
  const handlersRef = useRef<{
    onNotification?: (notification: WSNotificationMessage) => void;
    onConnected?: (payload: WSConnectedMessage) => void;
    onSystemMessage?: (payload: WSSystemMessage) => void;
    onError?: (event: Event, payload?: WSErrorMessage) => void;
    onDisconnected?: (event: CloseEvent) => void;
  }>({
    onNotification,
    onConnected,
    onSystemMessage,
    onError,
    onDisconnected,
  });

  useEffect(() => {
    handlersRef.current = {
      onNotification,
      onConnected,
      onSystemMessage,
      onError,
      onDisconnected,
    };
  }, [onNotification, onConnected, onSystemMessage, onError, onDisconnected]);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const clearPingTimer = useCallback(() => {
    if (pingTimerRef.current) {
      window.clearInterval(pingTimerRef.current);
      pingTimerRef.current = null;
    }
  }, []);

  const cleanupSocket = useCallback(() => {
    clearReconnectTimer();
    clearPingTimer();

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (error) {
        logger.warn("WebSocket 종료 중 예외 발생", error);
      }
      wsRef.current = null;
    }
  }, [clearReconnectTimer, clearPingTimer]);

  const scheduleReconnect = useCallback(
      (reason?: string) => {
        if (!autoReconnect || !shouldReconnectRef.current) {
          logger.info("WebSocket 재연결이 비활성화되어 시도하지 않습니다.", {reason});
          return;
        }

        setStatus("reconnecting");

        setReconnectAttempts((prev) => {
          const nextAttempt = prev + 1;
          if (nextAttempt > maxReconnectAttempts) {
            logger.error("WebSocket: 최대 재연결 시도 횟수 초과", {
              maxReconnectAttempts,
            });
            setStatus("error");
            return prev;
          }

          const delay = Math.min(
            reconnectBaseDelay * 2 ** (nextAttempt - 1),
            reconnectMaxDelay,
          );
          logger.info("WebSocket 재연결 예약", { attempt: nextAttempt, delay });

          clearReconnectTimer();
          reconnectTimerRef.current = window.setTimeout(() => {
            connectRef.current();
          }, delay);

          return nextAttempt;
        });
      },
      [
        autoReconnect,
        maxReconnectAttempts,
        reconnectBaseDelay,
        reconnectMaxDelay,
        clearReconnectTimer,
      ],
  );

  const handleMessage = useCallback((event: MessageEvent<string>) => {
    try {
      const message: WSMessage = JSON.parse(event.data);
      setLastActivity(Date.now());

      switch (message.type) {
        case "connected": {
          const payload = message as WSConnectedMessage;
          logger.info("WebSocket 연결 확인", payload);
          handlersRef.current.onConnected?.(payload);
          break;
        }
        case "notification": {
          const payload = message as WSNotificationMessage;
          logger.info("WebSocket 알림 수신", {
            notificationId: payload.id,
            type: payload.notification_type,
          });
          handlersRef.current.onNotification?.(payload);
          break;
        }
        case "ping": {
          const payload = message as WSPingMessage;
          logger.debug("WebSocket Ping 수신", payload);
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            const response: WSPongMessage = {
              type: "pong",
              timestamp: Date.now() / 1000,
            };
            wsRef.current.send(JSON.stringify(response));
            logger.debug("WebSocket Pong 전송", response);
          }
          break;
        }
        case "pong": {
          const payload = message as WSPongMessage;
          logger.debug("WebSocket Pong 수신", payload);
          break;
        }
        case "system": {
          const payload = message as WSSystemMessage;
          logger.info("WebSocket 시스템 메시지 수신", payload);
          handlersRef.current.onSystemMessage?.(payload);
          break;
        }
        case "error": {
          const payload = message as WSErrorMessage;
          logger.error("WebSocket 오류 메시지 수신", payload);
          handlersRef.current.onError?.(new Event("ws-error"), payload);
          break;
        }
        default: {
          logger.warn("WebSocket 알 수 없는 메시지 타입 수신", message);
          break;
        }
      }
    } catch (error) {
      logger.error("WebSocket 메시지 파싱 실패", error);
    }
  }, []);

  const connect = useCallback(() => {
    if (!baseUrl) {
      logger.error("WebSocket: 유효한 연결 URL을 찾지 못했습니다.");
      setStatus("error");
      return;
    }

    const token =
        typeof window !== "undefined"
            ? window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
            : null;

    if (!token) {
      logger.warn("WebSocket: 액세스 토큰이 없어 연결을 중단합니다.");
      setStatus("error");
      return;
    }

    const urlWithToken = appendToken(baseUrl, token);

    cleanupSocket();

    try {
      logger.info("WebSocket 연결 시도", { url: urlWithToken });
      setStatus("connecting");

      const socket = new WebSocket(urlWithToken);
      wsRef.current = socket;

      socket.onopen = () => {
        logger.info("WebSocket 연결 성공");
        setIsConnected(true);
        setStatus("connected");
        setReconnectAttempts(0);
        setLastActivity(Date.now());

        clearPingTimer();
        pingTimerRef.current = window.setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            const payload = {
              type: "ping",
              timestamp: Date.now() / 1000,
            };
            wsRef.current.send(JSON.stringify(payload));
            logger.debug("WebSocket Ping 전송", payload);
          }
        }, pingIntervalMs);
      };

      socket.onmessage = handleMessage;

      socket.onerror = (event) => {
        logger.error("WebSocket 연결 에러", event);
        handlersRef.current.onError?.(event);
      };

      socket.onclose = (event) => {
        logger.info("WebSocket 연결 종료", {
          code: event.code,
          reason: event.reason,
        });

        setIsConnected(false);
        setStatus("disconnected");
        handlersRef.current.onDisconnected?.(event);

        clearPingTimer();

        if (shouldReconnectRef.current && event.code !== 1000) {
          scheduleReconnect(`code=${event.code}`);
        }
      };
    } catch (error) {
      logger.error("WebSocket 연결 중 예외 발생", error);
      setStatus("error");
      scheduleReconnect("exception");
    }
  }, [baseUrl, cleanupSocket, clearPingTimer, handleMessage, pingIntervalMs, scheduleReconnect]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const disconnect = useCallback((finalStatus: NotificationConnectionStatus = "disconnected") => {
    shouldReconnectRef.current = false;
    cleanupSocket();
    setIsConnected(false);
    setStatus(finalStatus);
  }, [cleanupSocket]);

  const sendMessage = useCallback((message: WSMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return;
    }
    logger.warn("WebSocket: 연결되어 있지 않아 메시지를 전송하지 못했습니다.", {
      message,
    });
  }, []);

  useEffect(() => {
    if (!enabled) {
      disconnect("idle");
      return () => undefined;
    }

    shouldReconnectRef.current = true;
    connect();

    return () => {
      shouldReconnectRef.current = false;
      disconnect("disconnected");
    };
  }, [enabled, connect, disconnect]);

  return {
    status,
    isConnected,
    reconnectAttempts,
    lastActivity,
    connect,
    disconnect,
    sendMessage,
  };
}
