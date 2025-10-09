"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import { useQuery } from "@tanstack/react-query";
import {
  getAdminSystem,
  getPendingReports,
  getRecentActivityLogs,
} from "@/remote/admin";
import type { AdminSystemData, AdminReportsData, ActivityLogsPage } from "@/types/admin";
import styled from "styled-components";
import {
  AdminContainer,
  AdminPageHeader,
  AdminCard,
  AdminCardTitle,
  SectionLabel,
} from "@/components/admin/AdminUI";

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

        {/* System status */}
        <AdminCard>
          <AdminCardTitle>시스템 상태</AdminCardTitle>
          {systemLoading && <p>로딩 중...</p>}
          {systemError && (
            <p className="text-red-600">{(systemError as Error).message}</p>
          )}
          {!systemLoading && !systemError && system && (
            <SystemGrid>
              <SystemBox>
                <SectionLabel>성능 상태</SectionLabel>
                <div>
                  {system.performance.status} ({system.performance.grade})
                </div>
                <div>평균 응답시간: {system.performance.avgResponseTimeMs}ms</div>
                <div>오류율: {(system.performance.errorRate * 100).toFixed(2)}%</div>
              </SystemBox>
              <SystemBox>
                <SectionLabel>캐시</SectionLabel>
                <div>{system.cache.status}</div>
                <div>히트율: {(system.cache.hitRate * 100).toFixed(1)}%</div>
                <div>히트/미스: {system.cache.totalHits} / {system.cache.totalMisses}</div>
              </SystemBox>
              <SystemBox>
                <SectionLabel>권장사항</SectionLabel>
                <ul style={{ paddingLeft: 18 }}>
                  {(system.recommendations ?? []).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </SystemBox>
            </SystemGrid>
          )}
        </AdminCard>

        {/* Pending reports */}
        <AdminCard>
          <AdminCardTitle>대기 중 신고</AdminCardTitle>
          {reportsLoading && <p>로딩 중...</p>}
          {reportsError && (
            <p className="text-red-600">{(reportsError as Error).message}</p>
          )}
          {!reportsLoading && !reportsError && reports && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ minWidth: "100%", fontSize: 14 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#6b7280" }}>
                    <th style={{ padding: 8 }}>ID</th>
                    <th style={{ padding: 8 }}>대상</th>
                    <th style={{ padding: 8 }}>사유</th>
                    <th style={{ padding: 8 }}>상태</th>
                    <th style={{ padding: 8 }}>신고일</th>
                  </tr>
                </thead>
                <tbody>
                  {(reports.reports ?? []).length === 0 ? (
                    <tr>
                      <td style={{ padding: 8 }} colSpan={5}>
                        대기 중인 신고가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    (reports.reports ?? []).map((r) => (
                      <tr key={r.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                        <td style={{ padding: 8 }}>{r.id}</td>
                        <td style={{ padding: 8 }}>{r.targetType} #{r.targetId}</td>
                        <td style={{ padding: 8 }}>{r.reason}</td>
                        <td style={{ padding: 8 }}>{r.status}</td>
                        <td style={{ padding: 8 }}>{new Date(r.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>

        {/* Recent activity logs */}
        <AdminCard>
          <AdminCardTitle>최근 활동 로그</AdminCardTitle>
          {logsLoading && <p>로딩 중...</p>}
          {logsError && (
            <p className="text-red-600">{(logsError as Error).message}</p>
          )}
          {!logsLoading && !logsError && logs && (
            <ul style={{ borderTop: "1px solid #e5e7eb" }}>
              {(logs.logs ?? []).length === 0 ? (
                <li style={{ padding: "8px 0", fontSize: 14 }}>로그가 없습니다.</li>
              ) : (
                (logs.logs ?? []).map((log) => (
                  <li key={log.id} style={{ padding: "8px 0", fontSize: 14, borderBottom: "1px solid #e5e7eb" }}>
                    <span style={{ fontWeight: 600 }}>{log.activityType}</span>{" "}
                    <span style={{ color: "#6b7280" }}>
                      by {log.userId} on {log.targetType} #{log.targetId}
                    </span>
                    <span style={{ marginLeft: 8, color: "#9ca3af" }}>
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

const SystemGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, 1fr);
`;

const SystemBox = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
`;
