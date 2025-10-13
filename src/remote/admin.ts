/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiFetch } from "@/lib/apiFetch";
import type {
  ActivityLogsPage,
  AdminApiResponse,
  AdminReportsData,
  AdminSystemData,
} from "@/types/admin";
import type { Poll } from "@/types/poll";
import type {
  ReportStatus,
  ReportTargetType,
  AdminHealthDetailed,
  AdminNotification,
  NotificationType,
  NotificationTargetType,
  ActivityStats,
} from "@/types/admin";
import STORAGE_KEYS from "@/constants/storageKeys";

export async function getAdminSystem(): Promise<AdminSystemData> {
  const res = await apiFetch<AdminApiResponse<AdminSystemData>>(
    "/admin/system",
  );
  const data = res.data as Partial<AdminSystemData>;
  return {
    performance: data.performance ?? {
      status: "unknown",
      grade: "-",
      avgResponseTimeMs: 0,
      errorRate: 0,
      requestsPerSecond: 0,
      totalRequests: 0,
    },
    cache: data.cache ?? {
      status: "unknown",
      hitRate: 0,
      totalHits: 0,
      totalMisses: 0,
    },
    recommendations: data.recommendations ?? [],
  };
}

export async function getPendingReports(
  limit = 5,
  offset = 0,
): Promise<AdminReportsData> {
  const res = await apiFetch<AdminApiResponse<AdminReportsData>>(
    `/admin/reports?report_status=PENDING&limit=${limit}&offset=${offset}`,
  );
  const data = res.data as Partial<AdminReportsData>;
  return {
    reports: data.reports ?? [],
    total: data.total ?? 0,
  };
}

export async function getAdminReports(
  status: ReportStatus,
  limit = 20,
  offset = 0,
): Promise<AdminReportsData> {
  const res = await apiFetch<AdminApiResponse<AdminReportsData>>(
    `/admin/reports?report_status=${status}&limit=${limit}&offset=${offset}`,
  );
  const data = res.data as Partial<AdminReportsData>;
  return {
    reports: data.reports ?? [],
    total: data.total ?? 0,
  };
}

export async function getAdminReportsList(params: {
  reportStatus?: ReportStatus;
  userId?: number;
  targetType?: ReportTargetType;
  targetId?: number;
  startDate?: string; // ISO 8601
  endDate?: string; // ISO 8601
  limit?: number;
  offset?: number;
}): Promise<AdminReportsData> {
  const q = new URLSearchParams();
  if (params.reportStatus) q.set("report_status", params.reportStatus);
  if (params.userId) q.set("user_id", String(params.userId));
  if (params.targetType) q.set("target_type", params.targetType);
  if (params.targetId) q.set("target_id", String(params.targetId));
  if (params.startDate) q.set("start_date", params.startDate);
  if (params.endDate) q.set("end_date", params.endDate);
  q.set("limit", String(params.limit ?? 20));
  q.set("offset", String(params.offset ?? 0));

  const res = await apiFetch<AdminApiResponse<AdminReportsData>>(
    `/admin/reports?${q.toString()}`,
  );
  const data = res.data as Partial<AdminReportsData>;
  return {
    reports: data.reports ?? [],
    total: data.total ?? 0,
  };
}

export async function getAdminReportCountByTarget(
  targetType: ReportTargetType,
  targetId: number,
): Promise<number> {
  const res = await apiFetch<AdminApiResponse<{ count: number }>>(
    `/admin/reports/count/target/${targetType}/${targetId}`,
  );
  return res.data?.count ?? 0;
}

export async function updateAdminReportStatus(
  reportId: number,
  status: ReportStatus,
): Promise<{ id: number; status: ReportStatus; updatedAt?: string }> {
  const res = await apiFetch<
    AdminApiResponse<{ id: number; status: ReportStatus; updatedAt?: string }>
  >(`/admin/reports/${reportId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
  return res.data;
}

export async function getAdminReportsByTarget(
  targetType: ReportTargetType,
  targetId: number,
): Promise<{ reports: AdminReportsData["reports"] }> {
  const res = await apiFetch<
    AdminApiResponse<{ reports: AdminReportsData["reports"] }>
  >(`/admin/reports/target/${targetType}/${targetId}`);
  return { reports: res.data?.reports ?? [] };
}

// Polls
export async function createAdminPoll(payload: {
  title: string;
  pollDate: string; // YYYY-MM-DD
  options: Array<{ content: string }>;
}): Promise<Poll> {
  const body = {
    title: payload.title,
    poll_date: payload.pollDate,
    options: payload.options.map((o) => ({ content: o.content })),
  };
  const res = await apiFetch<AdminApiResponse<Poll>>("/admin/polls", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function updateAdminPoll(
  pollId: number,
  payload: { title?: string; pollDate?: string },
): Promise<Poll> {
  const body: Record<string, unknown> = {};
  if (payload.title !== undefined) body.title = payload.title;
  if (payload.pollDate !== undefined) body.poll_date = payload.pollDate;

  const res = await apiFetch<AdminApiResponse<Poll>>(`/admin/polls/${pollId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function updateAdminPollOption(
  pollId: number,
  optionId: number,
  payload: { content: string },
): Promise<{
  id: number;
  content: string;
  voteCount: number;
  optionOrder: number;
}> {
  const res = await apiFetch<
    AdminApiResponse<{
      id: number;
      content: string;
      voteCount: number;
      optionOrder: number;
    }>
  >(`/admin/polls/${pollId}/options/${optionId}`, {
    method: "PUT",
    body: JSON.stringify({ content: payload.content }),
  });
  return res.data;
}

export async function adminVote(payload: {
  pollId: number;
  pollOptionId: number;
}): Promise<{
  id: number;
  userId: number;
  pollId: number;
  pollOptionId: number;
  createdAt: string;
}> {
  const res = await apiFetch<
    AdminApiResponse<{
      id: number;
      userId: number;
      pollId: number;
      pollOptionId: number;
      createdAt: string;
    }>
  >("/admin/votes", {
    method: "POST",
    body: JSON.stringify({
      poll_id: payload.pollId,
      poll_option_id: payload.pollOptionId,
    }),
  });
  return res.data;
}

// Polls list/search
export interface AdminPollListParams {
  page?: number;
  size?: number;
}

export async function getAdminPolls(params: AdminPollListParams): Promise<{
  polls: Poll[];
  page: number;
  size: number;
  hasNext: boolean;
}> {
  const q = new URLSearchParams();
  q.set("page", String(params.page ?? 1));
  q.set("size", String(params.size ?? 10));

  // Note: using public list endpoint as per backend guidance
  const res = await apiFetch<
    AdminApiResponse<{
      items: Poll[];
      page: number;
      size: number;
      has_next: boolean;
    }>
  >(`/polls/list?${q.toString()}`);

  const d = res.data as any;
  // camelcase-keys turns has_next -> hasNext
  return {
    polls: d.items ?? [],
    page: d.page ?? params.page ?? 1,
    size: d.size ?? params.size ?? 10,
    hasNext: d.hasNext ?? d.has_next ?? false,
  };
}

export async function getAdminPoll(pollId: number): Promise<Poll> {
  const res = await apiFetch<AdminApiResponse<Poll>>(`/admin/polls/${pollId}`);
  return res.data;
}

export async function deleteAdminPoll(
  pollId: number,
): Promise<{ message?: string; deleted_poll_id?: number }> {
  const res = await apiFetch<
    AdminApiResponse<{ message?: string; deleted_poll_id?: number }>
  >(`/admin/polls/${pollId}`, { method: "DELETE" });
  return res.data;
}

export async function addAdminPollOption(
  pollId: number,
  content: string,
): Promise<{
  id: number;
  content: string;
  voteCount: number;
  optionOrder: number;
}> {
  const res = await apiFetch<
    AdminApiResponse<{
      id: number;
      content: string;
      voteCount: number;
      optionOrder: number;
    }>
  >(`/admin/polls/${pollId}/options`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  return res.data;
}

export async function deleteAdminPollOption(
  pollId: number,
  optionId: number,
): Promise<{ message?: string; deleted_option_id?: number }> {
  const res = await apiFetch<
    AdminApiResponse<{ message?: string; deleted_option_id?: number }>
  >(`/admin/polls/${pollId}/options/${optionId}`, { method: "DELETE" });
  return res.data;
}

export async function reorderAdminPollOptions(
  pollId: number,
  optionIds: number[],
): Promise<{
  message?: string;
  options?: Array<{ id: number; optionOrder: number }>;
}> {
  const res = await apiFetch<
    AdminApiResponse<{
      message?: string;
      options?: Array<{ id: number; optionOrder: number }>;
    }>
  >(`/admin/polls/${pollId}/options/reorder`, {
    method: "PUT",
    body: JSON.stringify({ option_ids: optionIds }),
  });
  return res.data;
}

export async function getRecentActivityLogs(
  page = 1,
  size = 5,
): Promise<ActivityLogsPage> {
  const res = await apiFetch<AdminApiResponse<ActivityLogsPage>>(
    `/admin/activity-logs?page=${page}&size=${size}`,
  );
  const data = res.data as Partial<ActivityLogsPage>;
  return {
    logs: data.logs ?? [],
    total: data.total ?? 0,
    page: data.page ?? page,
    size: data.size ?? size,
    hasNext: data.hasNext ?? false,
  };
}

// System - health detailed
export async function getAdminHealthDetailed(): Promise<AdminHealthDetailed> {
  const res = await apiFetch<AdminApiResponse<AdminHealthDetailed>>(
    "/admin/health/detailed",
  );
  const d = (res.data || {}) as Partial<AdminHealthDetailed>;
  return {
    status: d.status ?? "unknown",
    services: {
      database: d.services?.database ?? { status: "unknown" },
      redis: d.services?.redis ?? { status: "unknown" },
      ociStorage: d.services?.ociStorage ?? { status: "unknown" },
    },
    environment: d.environment,
    version: d.version,
  };
}

// System - metrics (text/plain)
export async function getAdminMetrics(): Promise<string> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      : null;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/metrics`,
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "text/plain, */*",
      },
      credentials: "include",
    },
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.text();
}

// System - cache actions
export async function clearAllAdminCaches(): Promise<{
  message: string;
  deletedKeys?: number;
}> {
  const res = await apiFetch<
    AdminApiResponse<{ message: string; deletedKeys?: number }>
  >("/admin/cache/clear", { method: "POST" });
  return res.data;
}

export async function invalidateHotFeedCache(): Promise<{ message: string }> {
  const res = await apiFetch<AdminApiResponse<{ message: string }>>(
    "/admin/feeds/hot/cache",
    { method: "DELETE" },
  );
  return res.data;
}

// Notifications
export async function postAdminNotification(payload: {
  userId: number;
  type: NotificationType;
  fromUserId?: number | null;
  targetType: NotificationTargetType;
  targetId: number;
  message?: string | null;
}): Promise<AdminNotification> {
  const body: any = {
    user_id: payload.userId,
    type: payload.type,
    from_user_id: payload.fromUserId ?? null,
    target_type: payload.targetType,
    target_id: payload.targetId,
    message: payload.message ?? null,
  };
  const res = await apiFetch<AdminApiResponse<AdminNotification>>(
    "/admin/notifications",
    { method: "POST", body: JSON.stringify(body) },
  );
  return res.data;
}

// Activity logs
export async function getActivityLogs(params: {
  userId?: number;
  activityType?: string;
  targetType?: string;
  userRole?: string;
  startDate?: string; // ISO 8601
  endDate?: string; // ISO 8601
  page?: number; // 1-based
  size?: number;
}): Promise<ActivityLogsPage> {
  const q = new URLSearchParams();
  if (params.userId) q.set("user_id", String(params.userId));
  if (params.activityType) q.set("activity_type", params.activityType);
  if (params.targetType) q.set("target_type", params.targetType);
  if (params.userRole) q.set("user_role", params.userRole);
  if (params.startDate) q.set("start_date", params.startDate);
  if (params.endDate) q.set("end_date", params.endDate);
  q.set("page", String(params.page ?? 1));
  q.set("size", String(params.size ?? 20));

  const res = await apiFetch<AdminApiResponse<ActivityLogsPage>>(
    `/admin/activity-logs?${q.toString()}`,
  );
  // normalize
  const d = res.data as Partial<ActivityLogsPage> & { has_next?: boolean };
  return {
    logs: d.logs ?? [],
    total: d.total ?? 0,
    page: d.page ?? params.page ?? 1,
    size: d.size ?? params.size ?? 20,
    hasNext: (d as any).hasNext ?? d.has_next ?? false,
  };
}

export async function getActivityStats(): Promise<ActivityStats> {
  const res = await apiFetch<AdminApiResponse<ActivityStats>>(
    "/admin/activity-logs/stats",
  );
  const d = res.data as any;
  return {
    totalActivities: d.total_activities ?? d.totalActivities ?? 0,
    byType: d.by_type ?? d.byType ?? {},
    byRole: d.by_role ?? d.byRole ?? {},
    byTargetType: d.by_target_type ?? d.byTargetType ?? {},
  } as ActivityStats;
}

export async function getActivityLogsByUser(
  userId: number,
  page = 1,
  size = 20,
): Promise<{
  userId: number;
  logs: ActivityLogsPage["logs"];
  total: number;
  page: number;
  size: number;
}> {
  const res = await apiFetch<
    AdminApiResponse<{
      user_id: number;
      logs: ActivityLogsPage["logs"];
      total: number;
      page: number;
      size: number;
    }>
  >(`/admin/activity-logs/users/${userId}?page=${page}&size=${size}`);
  const d = res.data as any;
  return {
    userId: d.user_id ?? userId,
    logs: d.logs ?? [],
    total: d.total ?? 0,
    page: d.page ?? page,
    size: d.size ?? size,
  };
}
