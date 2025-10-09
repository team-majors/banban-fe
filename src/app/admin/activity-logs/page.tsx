"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import {
  AdminContainer,
  AdminPageHeader,
  AdminCard,
  AdminCardTitle,
  Actions,
  SectionLabel,
  SmallButton,
} from "@/components/admin/AdminUI";
import { Input } from "@/components/common/Input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getActivityLogs, getActivityLogsByUser, getActivityStats } from "@/remote/admin";
import type { ActivityLogsPage, ActivityStats } from "@/types/admin";
import styled from "styled-components";
import { useMemo, useState } from "react";

interface Filters {
  userId?: number;
  activityType?: string;
  targetType?: string;
  userRole?: string;
  startDate?: string;
  endDate?: string;
  page: number; // 1-based
  size: number;
}

export default function AdminActivityLogsPage() {
  const [filters, setFilters] = useState<Filters>({ page: 1, size: 20 });

  const { data: logs, isLoading, error, refetch } = useQuery<ActivityLogsPage>({
    queryKey: ["admin", "activity-logs", filters],
    queryFn: () =>
      getActivityLogs({
        userId: filters.userId,
        activityType: filters.activityType,
        targetType: filters.targetType,
        userRole: filters.userRole,
        startDate: filters.startDate,
        endDate: filters.endDate,
        page: filters.page,
        size: filters.size,
      }),
  });

  const { data: stats } = useQuery<ActivityStats>({
    queryKey: ["admin", "activity-logs", "stats"],
    queryFn: getActivityStats,
    staleTime: 60_000,
  });

  const pages = useMemo(() => Math.max(1, Math.ceil((logs?.total ?? 0) / (filters.size || 20))), [logs?.total, filters.size]);

  return (
    <RequireAuth>
      <AdminContainer>
        <AdminPageHeader>관리자 · 활동 로그</AdminPageHeader>

        <AdminCard>
          <AdminCardTitle>필터</AdminCardTitle>
          <Filters>
            <Input $width="160px">
              <Input.Label>User ID</Input.Label>
              <Input.Field
                $isValidate={true}
                type="number"
                placeholder="(optional)"
                onChange={(e) => setFilters((f) => ({ ...f, page: 1, userId: e.target.value ? Number(e.target.value) : undefined }))}
              />
            </Input>
            <div>
              <SectionLabel>Activity</SectionLabel>
              <Select onChange={(e) => setFilters((f) => ({ ...f, page: 1, activityType: e.target.value || undefined }))}>
                <option value="">(all)</option>
                <option value="LOGIN">LOGIN</option>
                <option value="LOGOUT">LOGOUT</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="LIKE">LIKE</option>
                <option value="UNLIKE">UNLIKE</option>
              </Select>
            </div>
            <div>
              <SectionLabel>Target</SectionLabel>
              <Select onChange={(e) => setFilters((f) => ({ ...f, page: 1, targetType: e.target.value || undefined }))}>
                <option value="">(all)</option>
                <option value="FEED">FEED</option>
                <option value="COMMENT">COMMENT</option>
                <option value="POLL">POLL</option>
                <option value="USER">USER</option>
              </Select>
            </div>
            <div>
              <SectionLabel>Role</SectionLabel>
              <Select onChange={(e) => setFilters((f) => ({ ...f, page: 1, userRole: e.target.value || undefined }))}>
                <option value="">(all)</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </Select>
            </div>
            <Input $width="240px">
              <Input.Label>Start</Input.Label>
              <Input.Field
                $isValidate={true}
                type="datetime-local"
                onChange={(e) => setFilters((f) => ({ ...f, page: 1, startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
              />
            </Input>
            <Input $width="240px">
              <Input.Label>End</Input.Label>
              <Input.Field
                $isValidate={true}
                type="datetime-local"
                onChange={(e) => setFilters((f) => ({ ...f, page: 1, endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
              />
            </Input>
            <div>
              <SectionLabel>Size</SectionLabel>
              <Select defaultValue={20} onChange={(e) => setFilters((f) => ({ ...f, page: 1, size: Number(e.target.value) }))}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Select>
            </div>
            <SmallButton as="button" onClick={() => refetch()}>적용</SmallButton>
          </Filters>
        </AdminCard>

        <AdminCard>
          <AdminCardTitle>통계</AdminCardTitle>
          {!stats ? (
            <p>로딩 중...</p>
          ) : (
            <StatsGrid>
              <div>
                <SectionLabel>Total</SectionLabel>
                <div style={{ fontWeight: 700 }}>{stats.totalActivities}</div>
              </div>
              <div>
                <SectionLabel>By Type</SectionLabel>
                <ul style={{ paddingLeft: 18 }}>
                  {Object.entries(stats.byType).map(([k, v]) => (
                    <li key={k}>{k}: {v}</li>
                  ))}
                </ul>
              </div>
              <div>
                <SectionLabel>By Role</SectionLabel>
                <ul style={{ paddingLeft: 18 }}>
                  {Object.entries(stats.byRole).map(([k, v]) => (
                    <li key={k}>{k}: {v}</li>
                  ))}
                </ul>
              </div>
              <div>
                <SectionLabel>By Target</SectionLabel>
                <ul style={{ paddingLeft: 18 }}>
                  {Object.entries(stats.byTargetType).map(([k, v]) => (
                    <li key={k}>{k}: {v}</li>
                  ))}
                </ul>
              </div>
            </StatsGrid>
          )}
        </AdminCard>

        <AdminCard>
          <AdminCardTitle>로그</AdminCardTitle>
          {isLoading && <p>로딩 중...</p>}
          {error && <p style={{ color: "#dc2626" }}>{(error as Error).message}</p>}
          {logs && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ minWidth: "100%", fontSize: 14 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#6b7280" }}>
                    <th style={{ padding: 8 }}>ID</th>
                    <th style={{ padding: 8 }}>User</th>
                    <th style={{ padding: 8 }}>Type</th>
                    <th style={{ padding: 8 }}>Target</th>
                    <th style={{ padding: 8 }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {(logs.logs ?? []).length === 0 ? (
                    <tr>
                      <td style={{ padding: 8 }} colSpan={5}>데이터가 없습니다.</td>
                    </tr>
                  ) : (
                    (logs.logs ?? []).map((l) => (
                      <tr key={l.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                        <td style={{ padding: 8 }}>{l.id}</td>
                        <td style={{ padding: 8 }}>{l.userId}</td>
                        <td style={{ padding: 8 }}>{l.activityType}</td>
                        <td style={{ padding: 8 }}>{l.targetType} #{l.targetId}</td>
                        <td style={{ padding: 8 }}>{new Date(l.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          <Pager>
            <SmallButton disabled={filters.page <= 1} onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, f.page - 1) }))}>이전</SmallButton>
            <span>{filters.page} / {pages}</span>
            <SmallButton disabled={!(logs?.hasNext)} onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}>다음</SmallButton>
          </Pager>
        </AdminCard>
      </AdminContainer>
    </RequireAuth>
  );
}

const Filters = styled.div`
  display: flex;
  gap: 12px;
  align-items: end;
  flex-wrap: wrap;
`;

const Select = styled.select`
  display: block;
  border: 1px solid #d5d7da;
  border-radius: 6px;
  padding: 8px 10px;
`;

const StatsGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, 1fr);
`;

const Pager = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
`;

