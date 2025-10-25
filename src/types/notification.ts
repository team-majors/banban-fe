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

export interface FromUser {
  id: number;
  username: string;
  profileImage: string | null;
}

export interface Notification {
  id: number;
  type: NotificationType;
  targetType: TargetType;
  targetId: number;
  relatedId?: number;
  fromUser?: FromUser;
  message: string;
  isRead: boolean;
  isExpired: boolean;
  createdAt: string;
  readAt?: string | null;
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
  related_id?: number;
  message: string;
  is_read: boolean;
  is_expired: boolean;
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
