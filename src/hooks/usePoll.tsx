import { fetchPoll } from "@/remote/poll";
import { Poll } from "@/types/poll";
import normalizeDate from "@/utils/normalizeDate";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useMemo } from "react";

const POLL_QUERY_KEYS = {
  all: ["polls"] as const,
  lists: () => [...POLL_QUERY_KEYS.all, "list"] as const,
  list: (date?: string) =>
    [...POLL_QUERY_KEYS.lists(), date ?? "current"] as const,
  details: () => [...POLL_QUERY_KEYS.all, "detail"] as const,
  detail: (date?: string) =>
    [...POLL_QUERY_KEYS.details(), date ?? "current"] as const,
} as const;

const POLL_CONFIG = {
  staleTime: 1000 * 60, // 1분
  gcTime: 1000 * 60 * 5, // 5분
  refetchOnWindowFocus: false,
} as const;

export const usePoll = (date?: string) => {
  const normalizedDate = useMemo(() => normalizeDate(date), [date]);

  const queryOptions: UseQueryOptions<Poll, Error> = useMemo(
    () => ({
      queryKey: POLL_QUERY_KEYS.list(normalizedDate),
      queryFn: () => fetchPoll(normalizedDate),
      ...POLL_CONFIG,
    }),
    [normalizedDate],
  );

  return useQuery(queryOptions);
};

export default usePoll;
