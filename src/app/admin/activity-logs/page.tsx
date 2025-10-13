"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import {
  AdminContainer,
  AdminPageHeader,
  AdminCard,
  AdminCardTitle,
  SectionLabel,
  SmallButton,
} from "@/components/admin/AdminUI";
import { Input } from "@/components/common/Input";
import { useQuery } from "@tanstack/react-query";
import { getActivityLogs, getActivityStats } from "@/remote/admin";
import type { ActivityLogsPage, ActivityStats } from "@/types/admin";
import { useMemo, useState } from "react";

const selectClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200";
const tableHeaderClass =
  "px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";
const tableCellClass = "px-4 py-2 text-sm text-slate-700";

interface Filters {
  userId?: number;
  activityType?: string;
  targetType?: string;
  userRole?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  size: number;
}

export default function AdminActivityLogsPage() {
  const [filters, setFilters] = useState<Filters>({ page: 1, size: 20 });

  const {
    data: logs,
    isLoading,
    error,
    refetch,
  } = useQuery<ActivityLogsPage>({
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

  const pages = useMemo(
    () => Math.max(1, Math.ceil((logs?.total ?? 0) / (filters.size || 20))),
    [logs?.total, filters.size],
  );

  return (
    <RequireAuth>
      <AdminContainer>
        <AdminPageHeader>관리자 · 활동 로그</AdminPageHeader>

        <AdminCard>
          <AdminCardTitle>필터</AdminCardTitle>
          <div className="flex flex-wrap items-end gap-3">
            <Input $width="160px">
              <Input.Label>User ID</Input.Label>
              <Input.Field
                $isValidate={true}
                type="number"
                placeholder="(optional)"
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    page: 1,
                    userId: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
            </Input>

            <div className="flex flex-col text-sm text-slate-600">
              <SectionLabel className="text-xs text-slate-500">
                Activity
              </SectionLabel>
              <select
                className={selectClass}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    page: 1,
                    activityType: e.target.value || undefined,
                  }))
                }
              >
                <option value="">(all)</option>
                <option value="LOGIN">LOGIN</option>
                <option value="LOGOUT">LOGOUT</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="LIKE">LIKE</option>
                <option value="UNLIKE">UNLIKE</option>
              </select>
            </div>

            <div className="flex flex-col text-sm text-slate-600">
              <SectionLabel className="text-xs text-slate-500">
                Target
              </SectionLabel>
              <select
                className={selectClass}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    page: 1,
                    targetType: e.target.value || undefined,
                  }))
                }
              >
                <option value="">(all)</option>
                <option value="FEED">FEED</option>
                <option value="COMMENT">COMMENT</option>
                <option value="POLL">POLL</option>
                <option value="USER">USER</option>
              </select>
            </div>

            <div className="flex flex-col text-sm text-slate-600">
              <SectionLabel className="text-xs text-slate-500">
                Role
              </SectionLabel>
              <select
                className={selectClass}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    page: 1,
                    userRole: e.target.value || undefined,
                  }))
                }
              >
                <option value="">(all)</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <Input $width="240px">
              <Input.Label>Start</Input.Label>
              <Input.Field
                $isValidate={true}
                type="datetime-local"
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    page: 1,
                    startDate: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : undefined,
                  }))
                }
              />
            </Input>

            <Input $width="240px">
              <Input.Label>End</Input.Label>
              <Input.Field
                $isValidate={true}
                type="datetime-local"
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    page: 1,
                    endDate: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : undefined,
                  }))
                }
              />
            </Input>

            <div className="flex flex-col text-sm text-slate-600">
              <SectionLabel className="text-xs text-slate-500">
                Size
              </SectionLabel>
              <select
                className={selectClass}
                defaultValue={20}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    page: 1,
                    size: Number(e.target.value),
                  }))
                }
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <SmallButton onClick={() => refetch()}>적용</SmallButton>
          </div>
        </AdminCard>

        <AdminCard>
          <AdminCardTitle>통계</AdminCardTitle>
          {!stats ? (
            <p className="text-sm text-slate-500">로딩 중...</p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <SectionLabel className="mb-2 text-slate-700">
                  Total
                </SectionLabel>
                <p className="text-2xl font-semibold text-slate-900">
                  {stats.totalActivities}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <SectionLabel className="mb-2 text-slate-700">
                  By Type
                </SectionLabel>
                <ul className="space-y-1 text-sm text-slate-700">
                  {Object.entries(stats.byType).map(([k, v]) => (
                    <li key={k} className="flex justify-between">
                      <span>{k}</span>
                      <span className="font-semibold text-slate-900">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <SectionLabel className="mb-2 text-slate-700">
                  By Role
                </SectionLabel>
                <ul className="space-y-1 text-sm text-slate-700">
                  {Object.entries(stats.byRole).map(([k, v]) => (
                    <li key={k} className="flex justify-between">
                      <span>{k}</span>
                      <span className="font-semibold text-slate-900">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <SectionLabel className="mb-2 text-slate-700">
                  By Target
                </SectionLabel>
                <ul className="space-y-1 text-sm text-slate-700">
                  {Object.entries(stats.byTargetType).map(([k, v]) => (
                    <li key={k} className="flex justify-between">
                      <span>{k}</span>
                      <span className="font-semibold text-slate-900">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </AdminCard>

        <AdminCard>
          <AdminCardTitle>로그</AdminCardTitle>
          {isLoading && <p className="text-sm text-slate-500">로딩 중...</p>}
          {error && (
            <p className="text-sm text-red-600">{(error as Error).message}</p>
          )}
          {logs && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className={tableHeaderClass}>ID</th>
                    <th className={tableHeaderClass}>User</th>
                    <th className={tableHeaderClass}>Type</th>
                    <th className={tableHeaderClass}>Target</th>
                    <th className={tableHeaderClass}>Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white/95">
                  {(logs.logs ?? []).length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-sm text-slate-500"
                      >
                        데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    (logs.logs ?? []).map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/70">
                        <td className={tableCellClass}>{l.id}</td>
                        <td className={tableCellClass}>{l.userId}</td>
                        <td className={tableCellClass}>{l.activityType}</td>
                        <td className={tableCellClass}>
                          {l.targetType} #{l.targetId}
                        </td>
                        <td className={`${tableCellClass} whitespace-nowrap`}>
                          {new Date(l.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50/70 px-4 py-3">
            <SmallButton
              disabled={filters.page <= 1}
              onClick={() =>
                setFilters((f) => ({ ...f, page: Math.max(1, f.page - 1) }))
              }
            >
              이전
            </SmallButton>
            <span className="text-sm text-slate-600">
              {filters.page} / {pages}
            </span>
            <SmallButton
              disabled={!logs?.hasNext}
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            >
              다음
            </SmallButton>
          </div>
        </AdminCard>
      </AdminContainer>
    </RequireAuth>
  );
}
