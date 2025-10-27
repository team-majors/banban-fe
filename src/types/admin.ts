export type ReportStatus = "PENDING" | "CONFIRMED" | "REJECTED";

export type ReportTargetType = "FEED" | "COMMENT";

export interface AdminApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

export interface AdminReportItem {
  id: number;
  reporterId: number;
  targetType: ReportTargetType;
  targetId: number;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminReportsData {
  reports: AdminReportItem[];
  total: number;
}

export interface SystemPerformance {
  status: string; // healthy | degraded
  grade: string; // e.g., A
  avgResponseTimeMs: number;
  errorRate: number;
  requestsPerSecond: number;
  totalRequests: number;
}

export interface SystemCacheStatus {
  status: string; // healthy | degraded
  hitRate: number;
  totalHits: number;
  totalMisses: number;
}

export interface AdminSystemData {
  performance: SystemPerformance;
  cache: SystemCacheStatus;
  recommendations: string[];
}

export interface PollCachePatternStat {
  pattern: string;
  deleted: number;
}

export interface AdminPollCachePurgeResult {
  message: string;
  totalDeleted: number;
  patterns: PollCachePatternStat[];
  executedAt?: string;
}

export interface ActivityLogItem {
  id: number;
  userId: number;
  activityType: string; // enum ActivityType
  targetType: string; // enum TargetType
  targetId: number;
  userRole?: string; // USER | ADMIN
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ActivityLogsPage {
  logs: ActivityLogItem[];
  total: number;
  page: number;
  size: number;
  hasNext: boolean;
}

// Notifications
export type NotificationType = string; // e.g., 'SYSTEM'
export type NotificationTargetType = "FEED" | "COMMENT" | "POLL" | "USER";

export interface AdminNotification {
  id: number;
  userId: number;
  type: NotificationType;
  fromUserId?: number | null;
  targetType: NotificationTargetType;
  targetId: number;
  message?: string | null;
  isRead?: boolean;
  createdAt?: string;
}

// Activity stats
export interface ActivityStats {
  totalActivities: number;
  byType: Record<string, number>;
  byRole: Record<string, number>;
  byTargetType: Record<string, number>;
}

// System health detailed
export interface HealthServiceInfo {
  status: string; // healthy | degraded | unknown
  // database-only
  type?: string;
  // redis-only
  redisVersion?: string;
  uptimeDays?: number;
  // oci storage-only
  namespace?: string;
  region?: string;
}

export interface AdminHealthDetailed {
  status: string; // healthy | degraded
  services: {
    database?: HealthServiceInfo;
    redis?: HealthServiceInfo;
    ociStorage?: HealthServiceInfo; // camelCased from `oci_storage`
  };
  environment?: string;
  version?: string;
}

// User Management
export type UserRole = "USER" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface AdminUser {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  usernameUpdatedAt: string | null;
  deletedAt: string | null;
}

export interface AdminUsersData {
  code: number;
  status: "SUCCESS" | "FAILURE";
  data: {
    total: number;
    limit: number;
    offset: number;
    users: AdminUser[];
  };
}
