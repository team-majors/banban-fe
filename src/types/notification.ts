export enum NotificationType {
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  MENTION = "MENTION",
  REPLY = "REPLY",
  SYSTEM = "SYSTEM",
  VOTE = "VOTE",
}

export enum NotificationTargetType {
  FEED = "FEED",
  COMMENT = "COMMENT",
  USER = "USER",
  POLL = "POLL",
}

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  from_user_id: number | null;
  target_type: NotificationTargetType;
  target_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

export interface SSEConnectedEvent {
  message: string;
}

export interface SSEHeartbeatEvent {
  timestamp: string;
}

export interface SSEErrorEvent {
  message?: string;
}

export type NotificationConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "error";
