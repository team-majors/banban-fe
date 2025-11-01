"use client";

import styled from "styled-components";
import {
  AdminCard,
  AdminCardTitle,
  SectionLabel,
  Actions,
  SmallButton,
} from "@/components/admin/AdminUI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearAllAdminCaches,
  getAdminHealthDetailed,
  getAdminMetrics,
  getAdminSystem,
  invalidateHotFeedCache,
  resetAdminPollCache,
  getPendingReports,
  getRecentActivityLogs,
} from "@/remote/admin";
import type {
  AdminHealthDetailed,
  AdminPollCachePurgeResult,
  AdminSystemData,
  AdminReportsData,
  ActivityLogsPage,
} from "@/types/admin";
import { useState } from "react";
import { Modal } from "@/components/common/Modal/Modal";
import { useToast } from "@/components/common/Toast/useToast";

const badgeClass =
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-slate-800";

const tableHeaderClass =
  "px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";
const tableCellClass = "px-4 py-2 text-sm text-slate-700";

export const SystemTab = () => {
  const qc = useQueryClient();
  const { showToast } = useToast();

  const {
    data: system,
    isLoading: sysLoading,
    error: sysError,
  } = useQuery<AdminSystemData>({
    queryKey: ["admin", "system"],
    queryFn: getAdminSystem,
  });

  const {
    data: health,
    isLoading: healthLoading,
    error: healthError,
  } = useQuery<AdminHealthDetailed>({
    queryKey: ["admin", "health", "detailed"],
    queryFn: getAdminHealthDetailed,
  });

  const {
    data: metrics,
    isLoading: metricLoading,
    error: metricError,
    refetch: refetchMetrics,
  } = useQuery<string>({
    queryKey: ["admin", "metrics"],
    queryFn: getAdminMetrics,
    staleTime: 10_000,
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

  const [confirm, setConfirm] = useState<null | "all" | "hot" | "poll">(null);
  const [pollCacheResult, setPollCacheResult] =
    useState<AdminPollCachePurgeResult | null>(null);
  const pollCacheExecutedAtLabel =
    pollCacheResult?.executedAt &&
    !Number.isNaN(new Date(pollCacheResult.executedAt).getTime())
      ? new Date(pollCacheResult.executedAt).toLocaleString()
      : null;

  const clearCacheMutation = useMutation({
    mutationFn: clearAllAdminCaches,
    onSuccess: (res) => {
      showToast({
        type: "success",
        message: res.message || "캐시가 삭제되었습니다.",
      });
      qc.invalidateQueries({ queryKey: ["feeds"] });
      setConfirm(null);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "실패했습니다";
      showToast({ type: "error", message: msg });
      setConfirm(null);
    },
  });

  const hotCacheMutation = useMutation({
    mutationFn: invalidateHotFeedCache,
    onSuccess: (res) => {
      showToast({
        type: "success",
        message: res.message || "핫 피드 캐시 무효화",
      });
      qc.invalidateQueries({ queryKey: ["feeds", "hot"] });
      setConfirm(null);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "실패했습니다";
      showToast({ type: "error", message: msg });
      setConfirm(null);
    },
  });

  const pollCacheMutation = useMutation({
    mutationFn: resetAdminPollCache,
    onSuccess: (res) => {
      setPollCacheResult(res);
      const deletedLabel =
        typeof res.totalDeleted === "number"
          ? ` (${res.totalDeleted.toLocaleString()}개 삭제)`
          : "";
      showToast({
        type: "success",
        message: `${res.message}${deletedLabel}`,
      });
      setConfirm(null);
      qc.invalidateQueries({ queryKey: ["polls"] });
      qc.invalidateQueries({ queryKey: ["admin", "polls"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "실패했습니다";
      showToast({ type: "error", message: msg });
      setConfirm(null);
    },
  });

  const statusColor = (status: string | undefined) => {
    switch (status) {
      case "healthy":
        return "bg-emerald-100";
      case "degraded":
        return "bg-amber-100";
      case "down":
        return "bg-rose-100";
      default:
        return "bg-slate-200";
    }
  };

  return (
    <>
      <Container>
        <AdminCard>
          <AdminCardTitle>시스템 상태</AdminCardTitle>
          {sysLoading && <p className="text-sm text-slate-500">로딩 중...</p>}
          {sysError && (
            <p className="text-sm text-red-600">
              {(sysError as Error).message}
            </p>
          )}
          {system && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100">
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">성능</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">상태</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">평균 응답시간</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">에러율</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-600">Server</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {system.performance.status} ({system.performance.grade})
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {system.performance.avgResponseTimeMs}ms
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        {(system.performance.errorRate * 100).toFixed(2)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100">
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">캐시</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">상태</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Hit Rate</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">Hit / Miss</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-600">Redis</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {system.cache.status}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {(system.cache.hitRate * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        {system.cache.totalHits} / {system.cache.totalMisses}
                      </td>
                    </tr>
                  </tbody>
                </table>
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
          <AdminCardTitle>세부 헬스 체크</AdminCardTitle>
          {healthLoading && <p className="text-sm text-slate-500">로딩 중...</p>}
          {healthError && (
            <p className="text-sm text-red-600">
              {(healthError as Error).message}
            </p>
          )}
          {health && (
            <>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100">
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">서비스</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">상태</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">상세정보</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">Database</td>
                      <td className="px-4 py-3">
                        <span
                          className={`${badgeClass} ${statusColor(
                            health.services.database?.status,
                          )}`}
                        >
                          {health.services.database?.status || "unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        type: {health.services.database?.type || "-"}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">Redis</td>
                      <td className="px-4 py-3">
                        <span
                          className={`${badgeClass} ${statusColor(
                            health.services.redis?.status,
                          )}`}
                        >
                          {health.services.redis?.status || "unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        ver: {health.services.redis?.redisVersion || "-"}, uptime:{" "}
                        {health.services.redis?.uptimeDays ?? "-"}d
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">OCI Storage</td>
                      <td className="px-4 py-3">
                        <span
                          className={`${badgeClass} ${statusColor(
                            health.services.ociStorage?.status,
                          )}`}
                        >
                          {health.services.ociStorage?.status || "unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        ns: {health.services.ociStorage?.namespace || "-"}, region:{" "}
                        {health.services.ociStorage?.region || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 rounded-xl bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
                env: {health.environment || "-"} · version:{" "}
                {health.version || "-"}
              </div>
            </>
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

        <AdminCard>
          <AdminCardTitle>캐시 관리</AdminCardTitle>
          <Actions className="gap-3">
            <SmallButton onClick={() => setConfirm("all")}>
              전체 캐시 삭제
            </SmallButton>
            <SmallButton onClick={() => setConfirm("hot")}>
              핫 피드 캐시 무효화
            </SmallButton>
            <SmallButton onClick={() => setConfirm("poll")}>
              투표 캐시 초기화
            </SmallButton>
          </Actions>
          {pollCacheResult && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                <span>최근 투표 캐시 초기화 결과</span>
                {pollCacheExecutedAtLabel && (
                  <span className="text-xs font-normal text-slate-500">
                    {pollCacheExecutedAtLabel}
                  </span>
                )}
              </div>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">삭제된 캐시 수</dt>
                  <dd className="font-semibold text-slate-900">
                    {pollCacheResult.totalDeleted.toLocaleString()}개
                  </dd>
                </div>
              </dl>
              {pollCacheResult.patterns.length > 0 ? (
                <div className="mt-3 rounded-lg bg-slate-50 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    패턴별 삭제
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-slate-600">
                    {pollCacheResult.patterns.map((pattern, index) => (
                      <li
                        key={`${pattern.pattern}-${index}`}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-white/70 px-2 py-1"
                      >
                        <span className="font-mono text-xs text-slate-700">
                          {pattern.pattern}
                        </span>
                        <span className="font-semibold text-slate-800">
                          {pattern.deleted.toLocaleString()}개
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-500">
                  삭제된 캐시 패턴이 없습니다.
                </p>
              )}
            </div>
          )}
        </AdminCard>

        <AdminCard>
          <AdminCardTitle>메트릭 (Prometheus)</AdminCardTitle>
          {metricLoading && <p className="text-sm text-slate-500">로딩 중...</p>}
          {metricError && (
            <p className="text-sm text-red-600">
              {(metricError as Error).message}
            </p>
          )}
          {metrics && (
            <pre className="mt-2 max-h-80 overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100">
{metrics}
            </pre>
          )}
          <Actions className="mt-4 justify-end">
            <SmallButton onClick={() => refetchMetrics()}>새로고침</SmallButton>
            <SmallButton
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(metrics || "");
                  showToast({ type: "success", message: "복사되었습니다." });
                } catch {
                  showToast({
                    type: "error",
                    message: "복사에 실패했습니다.",
                  });
                }
              }}
            >
              복사
            </SmallButton>
          </Actions>
        </AdminCard>

        <Modal isOpen={!!confirm} onClose={() => setConfirm(null)}>
          <Modal.Header>
            <h3 id="modal-title" className="text-lg font-semibold">
              정말 진행하시겠습니까?
            </h3>
          </Modal.Header>
          <Modal.Body>
            <div id="modal-content" className="text-sm text-slate-700">
              {confirm === "all"
                ? "Redis의 모든 캐시가 삭제됩니다. 신중히 진행하세요."
                : confirm === "hot"
                  ? "핫 피드 캐시가 무효화됩니다."
                  : "일일 투표, 사용자 기록 등 투표 관련 캐시 10종이 즉시 삭제됩니다."}
            </div>
          </Modal.Body>
          <Actions className="justify-end border-t border-slate-200 px-6 py-4">
            <SmallButton onClick={() => setConfirm(null)}>취소</SmallButton>
            <SmallButton
              onClick={() =>
                confirm === "all"
                  ? clearCacheMutation.mutate()
                  : confirm === "hot"
                    ? hotCacheMutation.mutate()
                    : pollCacheMutation.mutate()
              }
              disabled={
                clearCacheMutation.isPending ||
                hotCacheMutation.isPending ||
                pollCacheMutation.isPending
              }
            >
              확인
            </SmallButton>
          </Actions>
        </Modal>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
`;
