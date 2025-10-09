import { create } from "zustand";
import type {
  Notification,
  NotificationConnectionStatus,
} from "@/types/notification";

const MAX_NOTIFICATIONS = 100;

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  connectionStatus: NotificationConnectionStatus;
  lastHeartbeat: number | null;
  isTimeout: boolean;
  addNotification: (notification: Notification) => void;
  incrementUnread: () => void;
  markAsRead: (notificationIds: number[]) => void;
  markAllRead: () => void;
  clearAll: () => void;
  setConnectionStatus: (status: NotificationConnectionStatus) => void;
  setLastHeartbeat: (timestamp: number | null) => void;
  setTimeoutState: (value: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  connectionStatus: "idle",
  lastHeartbeat: null,
  isTimeout: false,

  addNotification: (notification) =>
    set((state) => {
      const deduped = state.notifications.filter((item) => item.id !== notification.id);
      deduped.unshift(notification);

      return {
        notifications: deduped.slice(0, MAX_NOTIFICATIONS),
      };
    }),

  incrementUnread: () =>
    set((state) => ({
      unreadCount: state.unreadCount + 1,
    })),

  markAsRead: (notificationIds) =>
    set((state) => {
      if (notificationIds.length === 0) {
        return state;
      }

      const unreadToSubtract = state.notifications.reduce((count, item) => {
        if (!item.is_read && notificationIds.includes(item.id)) {
          return count + 1;
        }
        return count;
      }, 0);

      return {
        notifications: state.notifications.map((item) =>
          notificationIds.includes(item.id) ? { ...item, is_read: true } : item,
        ),
        unreadCount: Math.max(0, state.unreadCount - unreadToSubtract),
      };
    }),

  markAllRead: () =>
    set((state) => {
      if (state.unreadCount === 0) {
        return state;
      }

      return {
        notifications: state.notifications.map((item) =>
          item.is_read ? item : { ...item, is_read: true },
        ),
        unreadCount: 0,
      };
    }),

  clearAll: () =>
    set({
      notifications: [],
      unreadCount: 0,
      lastHeartbeat: null,
      isTimeout: false,
      connectionStatus: "idle",
    }),

  setConnectionStatus: (status) =>
    set(() => ({
      connectionStatus: status,
    })),

  setLastHeartbeat: (timestamp) =>
    set(() => ({
      lastHeartbeat: timestamp,
    })),

  setTimeoutState: (value) =>
    set(() => ({
      isTimeout: value,
    })),
}));
