export type NotificationType =
  | "COMMENT"
  | "LIKE"
  | "MENTION"
  | "FEED"
  | "VOTE"
  | "SYSTEM";
export type TargetType = "FEED" | "COMMENT" | "POLL" | "USER";

export type NotificationConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "error";

export type WSMessageType =
  | "connected"
  | "notification"
  | "ping"
  | "pong"
  | "error"
  | "system";

export interface Notification {
  id: number;
  user_id: number;
  notification_type: NotificationType;
  /**
   * @deprecated WebSocket 메시지 필드와 일치하지 않습니다. notification_type을 사용하세요.
   */
  type?: NotificationType;
  from_user_id?: number;
  target_type: TargetType;
  target_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at?: string | null;
}

export interface WSMessage {
  type: WSMessageType;
  [key: string]: unknown;
}

export interface WSNotificationMessage extends WSMessage {
  type: "notification";
  id: number;
  user_id: number;
  notification_type: NotificationType;
  from_user_id?: number;
  target_type: TargetType;
  target_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at?: string | null;
}

export interface WSConnectedMessage extends WSMessage {
  type: "connected";
  message?: string;
  user_id: number;
  connected_at: string;
}

export interface WSPingMessage extends WSMessage {
  type: "ping";
  timestamp: number;
}

export interface WSPongMessage extends WSMessage {
  type: "pong";
  timestamp: number;
}

export interface WSErrorMessage extends WSMessage {
  type: "error";
  message: string;
  error_code?: string;
  timestamp?: string;
}

export interface WSSystemMessage extends WSMessage {
  type: "system";
  message: string;
  timestamp: string;
}
