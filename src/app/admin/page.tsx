"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import { useQuery } from "@tanstack/react-query";
import {
  getAdminSystem,
  getPendingReports,
  getRecentActivityLogs,
} from "@/remote/admin";
import type {
  AdminSystemData,
  AdminReportsData,
  ActivityLogsPage,
} from "@/types/admin";
import {
  AdminContainer,
  AdminPageHeader,
  AdminCard,
  AdminCardTitle,
  SectionLabel,
} from "@/components/admin/AdminUI";

const tableHeaderClass =
  "px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";
const tableCellClass = "px-4 py-2 text-sm text-slate-700";

export default function AdminDashboardPage() {
  const {
    data: system,
    isLoading: systemLoading,
    error: systemError,
  } = useQuery<AdminSystemData>({
    queryKey: ["admin", "system"],
    queryFn: getAdminSystem,
  });

  const {
    data: reports,
    isLoading: reportsLoading,
    error: reportsError,
  } = useQuery<AdminReportsData>({
    queryKey: ["admin", "reports", "pending", 5, 0],
    queryFn: () => getPendingReports(5, 0),
  });

  const {
    data: logs,
    isLoading: logsLoading,
    error: logsError,
  } = useQuery<ActivityLogsPage>({
    queryKey: ["admin", "activity-logs", 1, 5],
    queryFn: () => getRecentActivityLogs(1, 5),
  });

  return (
    <RequireAuth>
      <AdminContainer>
        <AdminPageHeader>Admin Dashboard</AdminPageHeader>

        <AdminCard>
          <AdminCardTitle>시스템 상태</AdminCardTitle>
          {systemLoading && <p className="text-sm text-slate-500">로딩 중...</p>}
          {systemError && (
            <p className="text-sm text-red-600">
              {(systemError as Error).message}
            </p>
          )}
          {!systemLoading && !systemError && system && (
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <SectionLabel className="mb-3 text-slate-700">
                  성능 상태
                </SectionLabel>
                <dl className="space-y-2 text-sm text-slate-700">
                  <div>
                    <dt className="text-slate-500">상태</dt>
                    <dd className="font-semibold text-slate-900">
                      {system.performance.status} ({system.performance.grade})
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">평균 응답시간</dt>
                    <dd className="font-semibold text-slate-900">
                      {system.performance.avgResponseTimeMs}ms
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">오류율</dt>
                    <dd className="font-semibold text-slate-900">
                      {(system.performance.errorRate * 100).toFixed(2)}%
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <SectionLabel className="mb-3 text-slate-700">캐시</SectionLabel>
                <dl className="space-y-2 text-sm text-slate-700">
                  <div>
                    <dt className="text-slate-500">상태</dt>
                    <dd className="font-semibold text-slate-900">
                      {system.cache.status}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">히트율</dt>
                    <dd className="font-semibold text-slate-900">
                      {(system.cache.hitRate * 100).toFixed(1)}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">히트/미스</dt>
                    <dd className="font-semibold text-slate-900">
                      {system.cache.totalHits} / {system.cache.totalMisses}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <SectionLabel className="mb-3 text-slate-700">
                  권장사항
                </SectionLabel>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {(system.recommendations ?? []).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                  {(system.recommendations ?? []).length === 0 && (
                    <li className="text-slate-500">권장사항이 없습니다.</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </AdminCard>

        <AdminCard>
          <AdminCardTitle>대기 중 신고</AdminCardTitle>
          {reportsLoading && <p className="text-sm text-slate-500">로딩 중...</p>}
          {reportsError && (
            <p className="text-sm text-red-600">
              {(reportsError as Error).message}
            </p>
          )}
          {!reportsLoading && !reportsError && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className={tableHeaderClass}>ID</th>
                    <th className={tableHeaderClass}>대상</th>
                    <th className={tableHeaderClass}>사유</th>
                    <th className={tableHeaderClass}>상태</th>
                    <th className={tableHeaderClass}>신고일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white/95">
                  {(reports?.reports ?? []).length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-sm text-slate-500"
                      >
                        대기 중인 신고가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    (reports?.reports ?? []).map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70">
                        <td className={tableCellClass}>{r.id}</td>
                        <td className={tableCellClass}>
                          {r.targetType} #{r.targetId}
                        </td>
                        <td className={tableCellClass}>{r.reason}</td>
                        <td className={tableCellClass}>
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {r.status}
                          </span>
                        </td>
                        <td className={`${tableCellClass} whitespace-nowrap`}>
                          {new Date(r.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>

        <AdminCard>
          <AdminCardTitle>최근 활동 로그</AdminCardTitle>
          {logsLoading && <p className="text-sm text-slate-500">로딩 중...</p>}
          {logsError && (
            <p className="text-sm text-red-600">
              {(logsError as Error).message}
            </p>
          )}
          {!logsLoading && !logsError && logs && (
            <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white/95 text-sm">
              {(logs.logs ?? []).length === 0 ? (
                <li className="px-4 py-6 text-center text-slate-500">
                  로그가 없습니다.
                </li>
              ) : (
                (logs.logs ?? []).map((log) => (
                  <li
                    key={log.id}
                    className="flex flex-col gap-1 px-4 py-3 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {log.activityType}
                      </span>
                      <span className="text-sm text-slate-500">
                        by {log.userId} · {log.targetType} #{log.targetId}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 lg:text-sm">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))
              )}
            </ul>
          )}
        </AdminCard>
      </AdminContainer>
    </RequireAuth>
  );
}
