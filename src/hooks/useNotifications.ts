import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "@/remote/notification";
import type { NotificationResponse } from "@/remote/notification";

export const useNotifications = () => {
  return useInfiniteQuery<NotificationResponse>({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      getNotifications({ lastId: pageParam as number | null, size: 20 }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.hasNext) {
        return undefined;
      }
      const lastNotification =
        lastPage.data.notifications[lastPage.data.notifications.length - 1];
      return lastNotification?.id ?? undefined;
    },
  });
};
