"use client";

"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import {
  AdminContainer,
  AdminPageHeader,
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
} from "@/remote/admin";
import type { AdminHealthDetailed, AdminSystemData } from "@/types/admin";
import styled from "styled-components";
import { useState } from "react";
import { Modal } from "@/components/common/Modal/Modal";
import { useToast } from "@/components/common/Toast/useToast";

export default function AdminSystemPage() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  const { data: system, isLoading: sysLoading, error: sysError } =
    useQuery<AdminSystemData>({
      queryKey: ["admin", "system"],
      queryFn: getAdminSystem,
    });

  const { data: health, isLoading: healthLoading, error: healthError } =
    useQuery<AdminHealthDetailed>({
      queryKey: ["admin", "health", "detailed"],
      queryFn: getAdminHealthDetailed,
    });

  const { data: metrics, isLoading: metricLoading, error: metricError, refetch: refetchMetrics } =
    useQuery<string>({
      queryKey: ["admin", "metrics"],
      queryFn: getAdminMetrics,
      staleTime: 10_000,
    });

  const [confirm, setConfirm] = useState<null | "all" | "hot">(null);

  const clearCacheMutation = useMutation({
    mutationFn: clearAllAdminCaches,
    onSuccess: (res) => {
      showToast({ type: "success", message: res.message || "캐시가 삭제되었습니다." });
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
      showToast({ type: "success", message: res.message || "핫 피드 캐시 무효화" });
      qc.invalidateQueries({ queryKey: ["feeds", "hot"] });
      setConfirm(null);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "실패했습니다";
      showToast({ type: "error", message: msg });
      setConfirm(null);
    },
  });

  return (
    <RequireAuth>
      <AdminContainer>
        <AdminPageHeader>관리자 · 시스템</AdminPageHeader>

        <AdminCard>
          <AdminCardTitle>시스템 상태</AdminCardTitle>
          {sysLoading && <p>로딩 중...</p>}
          {sysError && (
            <p style={{ color: "#dc2626" }}>{(sysError as Error).message}</p>
          )}
          {system && (
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(3, 1fr)" }}>
              <div>
                <SectionLabel>성능</SectionLabel>
                <div>
                  status: {system.performance.status} ({system.performance.grade})
                </div>
                <div>avg: {system.performance.avgResponseTimeMs}ms</div>
                <div>error: {(system.performance.errorRate * 100).toFixed(2)}%</div>
              </div>
              <div>
                <SectionLabel>캐시</SectionLabel>
                <div>status: {system.cache.status}</div>
                <div>hit: {(system.cache.hitRate * 100).toFixed(1)}%</div>
                <div>H/M: {system.cache.totalHits} / {system.cache.totalMisses}</div>
              </div>
              <div>
                <SectionLabel>권장사항</SectionLabel>
                <ul style={{ paddingLeft: 18 }}>
                  {(system.recommendations ?? []).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </AdminCard>

        <AdminCard>
          <AdminCardTitle>세부 헬스 체크</AdminCardTitle>
          {healthLoading && <p>로딩 중...</p>}
          {healthError && (
            <p style={{ color: "#dc2626" }}>{(healthError as Error).message}</p>
          )}
          {health && (
            <HealthGrid>
              <div>
                <SectionLabel>Database</SectionLabel>
                <Badge $status={health.services.database?.status || "unknown"}>
                  {health.services.database?.status || "unknown"}
                </Badge>
                <div style={{ color: "#6b7280" }}>type: {health.services.database?.type || "-"}</div>
              </div>
              <div>
                <SectionLabel>Redis</SectionLabel>
                <Badge $status={health.services.redis?.status || "unknown"}>
                  {health.services.redis?.status || "unknown"}
                </Badge>
                <div style={{ color: "#6b7280" }}>
                  ver: {health.services.redis?.redisVersion || "-"}, uptime: {health.services.redis?.uptimeDays ?? "-"}d
                </div>
              </div>
              <div>
                <SectionLabel>OCI Storage</SectionLabel>
                <Badge $status={health.services.ociStorage?.status || "unknown"}>
                  {health.services.ociStorage?.status || "unknown"}
                </Badge>
                <div style={{ color: "#6b7280" }}>
                  ns: {health.services.ociStorage?.namespace || "-"}, region: {health.services.ociStorage?.region || "-"}
                </div>
              </div>
            </HealthGrid>
          )}
          {health && (
            <div style={{ marginTop: 8, color: "#6b7280" }}>
              env: {health.environment || "-"}, version: {health.version || "-"}
            </div>
          )}
        </AdminCard>

        <AdminCard>
          <AdminCardTitle>캐시 관리</AdminCardTitle>
          <Actions>
            <SmallButton onClick={() => setConfirm("all")}>
              전체 캐시 삭제
            </SmallButton>
            <SmallButton onClick={() => setConfirm("hot")}>
              핫 피드 캐시 무효화
            </SmallButton>
          </Actions>
        </AdminCard>

        <AdminCard>
          <AdminCardTitle>메트릭 (Prometheus)</AdminCardTitle>
          {metricLoading && <p>로딩 중...</p>}
          {metricError && (
            <p style={{ color: "#dc2626" }}>{(metricError as Error).message}</p>
          )}
          {metrics && (
            <pre style={{ maxHeight: 320, overflow: "auto", background: "#0b1020", color: "#e5e7eb", padding: 12, borderRadius: 8 }}>
{metrics}
            </pre>
          )}
          <Actions>
            <SmallButton onClick={() => refetchMetrics()}>새로고침</SmallButton>
            <SmallButton
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(metrics || "");
                } catch {
                  // ignore
                }
              }}
            >
              복사
            </SmallButton>
          </Actions>
        </AdminCard>

        <Modal isOpen={!!confirm} onClose={() => setConfirm(null)}>
          <Modal.Header>
            <h3 id="modal-title">정말 진행하시겠습니까?</h3>
          </Modal.Header>
          <Modal.Body>
            <div id="modal-content" style={{ marginTop: 8 }}>
              {confirm === "all"
                ? "Redis의 모든 캐시가 삭제됩니다. 신중히 진행하세요."
                : "핫 피드 캐시가 무효화됩니다."}
            </div>
          </Modal.Body>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
            <SmallButton onClick={() => setConfirm(null)}>취소</SmallButton>
            <SmallButton
              onClick={() =>
                confirm === "all" ? clearCacheMutation.mutate() : hotCacheMutation.mutate()
              }
              disabled={clearCacheMutation.isPending || hotCacheMutation.isPending}
            >
              확인
            </SmallButton>
          </div>
        </Modal>
      </AdminContainer>
    </RequireAuth>
  );
}

const HealthGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, 1fr);
`;

const Badge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  margin: 4px 0;
  color: #111827;
  background: ${({ $status }) =>
    $status === "healthy"
      ? "#d1fae5" // green-100
      : $status === "degraded"
      ? "#fef3c7" // amber-100
      : "#e5e7eb"}; // gray-200
`;
