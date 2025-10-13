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
  isTimeout: boolean;
  lastActivity: number | null;
  reconnectAttempts: number;
  addNotification: (notification: Notification) => void;
  setNotifications: (notifications: Notification[]) => void;
  setUnreadCount: (count: number) => void;
  markAsRead: (notificationIds: number[]) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  setConnectionStatus: (status: NotificationConnectionStatus) => void;
  setIsTimeout: (value: boolean) => void;
  setLastActivity: (timestamp: number | null) => void;
  setReconnectAttempts: (count: number) => void;
  resetConnectionState: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  connectionStatus: "idle",
  isTimeout: false,
  lastActivity: null,
  reconnectAttempts: 0,

  addNotification: (notification) =>
    set((state) => {
      const isDuplicate = state.notifications.some((n) => n.id === notification.id);
      if (isDuplicate) {
        return state;
      }
      const newNotifications = [notification, ...state.notifications].slice(
        0,
        MAX_NOTIFICATIONS,
      );
      return {
        notifications: newNotifications,
        unreadCount: state.unreadCount + 1,
      };
    }),

  setNotifications: (notifications) => set({ notifications }),

  setUnreadCount: (count) => set({ unreadCount: count }),

  markAsRead: (notificationIds) =>
    set((state) => {
      let unreadCountToDecrease = 0;
      const updatedNotifications = state.notifications.map((n) => {
        if (notificationIds.includes(n.id) && !n.is_read) {
          unreadCountToDecrease++;
          return { ...n, is_read: true };
        }
        return n;
      });

      return {
        notifications: updatedNotifications,
        unreadCount: Math.max(0, state.unreadCount - unreadCountToDecrease),
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    })),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  setIsTimeout: (value) => set({ isTimeout: value }),

  setLastActivity: (timestamp) => set({ lastActivity: timestamp }),

  setReconnectAttempts: (count) => set({ reconnectAttempts: count }),

  resetConnectionState: () =>
    set({
      connectionStatus: "idle",
      isTimeout: false,
      lastActivity: null,
      reconnectAttempts: 0,
    }),
}));
