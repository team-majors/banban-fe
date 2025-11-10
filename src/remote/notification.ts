import { apiFetch } from "@/lib/apiFetch";
import type { Notification } from "@/types/notification";

export interface NotificationRequest {
  lastId?: number | null;
  size?: number;
}

export interface NotificationResponse {
  code: number;
  status: "SUCCESS" | "FAILURE";
  data: {
    notifications: Notification[];
    hasNext: boolean;
    unreadCount: number;
  };
}

export interface MarkNotificationsAsReadRequest {
  notification_ids: number[];
}

export interface MarkNotificationsAsReadResponse {
  code: number;
  status: "SUCCESS" | "FAILURE";
  data: {
    read_count: number;
  };
}

export interface MarkAllNotificationsAsReadResponse {
  code: number;
  status: "SUCCESS" | "FAILURE";
  data: {
    read_count: number;
  };
}

export const getNotifications = async ({
  lastId,
  size = 20,
}: NotificationRequest): Promise<NotificationResponse> => {
  const lastIdParam = lastId ? `last_id=${lastId}&` : "";
  const sizeParam = `size=${size}`;

  const res = await apiFetch(`/notifications?${lastIdParam}${sizeParam}`);

  return res as NotificationResponse;
};

export const markNotificationsAsRead = async (
  notificationIds: number[],
): Promise<MarkNotificationsAsReadResponse> => {
  const res = await apiFetch("/notifications/read", {
    method: "PUT",
    body: JSON.stringify({ notification_ids: notificationIds }),
  });

  return res as MarkNotificationsAsReadResponse;
};

export const markAllNotificationsAsRead =
  async (): Promise<MarkAllNotificationsAsReadResponse> => {
    const res = await apiFetch("/notifications/read-all", {
      method: "PUT",
    });

    return res as MarkAllNotificationsAsReadResponse;
  };

export interface DeleteReadNotificationsResponse {
  code: number;
  status: "SUCCESS" | "FAILURE";
  data: {
    deleted_count: number;
  };
}

export const deleteReadNotifications =
  async (): Promise<DeleteReadNotificationsResponse> => {
    const res = await apiFetch("/notifications/read", {
      method: "DELETE",
    });

    return res as DeleteReadNotificationsResponse;
  };
