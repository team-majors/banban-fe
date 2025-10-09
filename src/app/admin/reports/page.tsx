"use client";

import { useMemo, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import {
  AdminContainer,
  AdminPageHeader,
  AdminCard,
  AdminCardTitle,
  Actions,
  SmallButton,
  SectionLabel,
} from "@/components/admin/AdminUI";
import { Input } from "@/components/common/Input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminReportsList,
  getAdminReportsByTarget,
  updateAdminReportStatus,
  getAdminReportCountByTarget,
} from "@/remote/admin";
import type {
  AdminReportsData,
  AdminReportItem,
  ReportStatus,
  ReportTargetType,
} from "@/types/admin";
import styled from "styled-components";
import { useToast } from "@/components/common/Toast/useToast";
import { Modal } from "@/components/common/Modal/Modal";
import Link from "next/link";

const DEFAULT_LIMIT = 20;

export default function AdminReportsPage() {
  const { showToast } = useToast();
  const qc = useQueryClient();

  const [status, setStatus] = useState<ReportStatus>("PENDING");
  const [page, setPage] = useState(0); // offset = page * limit
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [targetType, setTargetType] = useState<ReportTargetType | undefined>(
    undefined,
  );
  const [targetId, setTargetId] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const { data, isLoading, error, refetch } = useQuery<AdminReportsData>({
    queryKey: [
      "admin",
      "reports",
      { status, page, limit, userId, targetType, targetId, startDate, endDate },
    ],
    queryFn: () =>
      getAdminReportsList({
        reportStatus: status,
        userId,
        targetType,
        targetId,
        startDate,
        endDate,
        limit,
        offset: page * limit,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, next }: { id: number; next: ReportStatus }) =>
      updateAdminReportStatus(id, next),
    onSuccess: () => {
      showToast({ type: "success", message: "신고 상태가 변경되었습니다." });
      qc.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "변경 실패";
      showToast({ type: "error", message });
    },
  });

  const total = data?.total ?? 0;
  const hasNext = (page + 1) * limit < total;
  const hasPrev = page > 0;

  // Target detail modal state
  const [target, setTarget] = useState<{ type: ReportTargetType; id: number } | null>(
    null,
  );
  const targetKey = useMemo(
    () =>
      target ? ["admin", "reports", "target", target.type, target.id] : undefined,
    [target],
  );

  // selection for bulk action
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const allSelected = useMemo(() => {
    const ids = (data?.reports ?? []).map((r) => r.id);
    return ids.length > 0 && ids.every((id) => selected.has(id));
  }, [selected, data?.reports]);

  const toggleAll = () => {
    const ids = (data?.reports ?? []).map((r) => r.id);
    setSelected((prev) => {
      const next = new Set<number>(prev);
      if (ids.length && ids.every((id) => next.has(id))) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set<number>(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const [confirm, setConfirm] = useState<null | { ids: number[]; to: ReportStatus }>(null);

  const {
    data: targetReports,
    isLoading: targetLoading,
    error: targetError,
  } = useQuery<{ reports: AdminReportItem[] }>(
    {
      queryKey: targetKey as any,
      queryFn: () => getAdminReportsByTarget(target!.type, target!.id),
      enabled: !!target,
    },
  );

  return (
    <RequireAuth>
      <AdminContainer>
        <AdminPageHeader>관리자 · 신고 관리</AdminPageHeader>

        <AdminCard>
          <AdminCardTitle>필터</AdminCardTitle>
          <Filters>
            <div>
              <label htmlFor="status">상태</label>
              <Select
                id="status"
                value={status}
                onChange={(e) => {
                  setPage(0);
                  setStatus(e.target.value as ReportStatus);
                }}
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="REJECTED">REJECTED</option>
              </Select>
            </div>
            <Input $width="160px">
              <Input.Label>User ID</Input.Label>
              <Input.Field
                $isValidate={true}
                type="number"
                placeholder="(opt)"
                onChange={(e) => {
                  setPage(0);
                  setUserId(e.target.value ? Number(e.target.value) : undefined);
                }}
              />
            </Input>
            <div>
              <label>대상 타입</label>
              <Select
                value={targetType ?? ""}
                onChange={(e) => {
                  setPage(0);
                  setTargetType((e.target.value || undefined) as ReportTargetType | undefined);
                }}
              >
                <option value="">(all)</option>
                <option value="FEED">FEED</option>
                <option value="COMMENT">COMMENT</option>
              </Select>
            </div>
            <Input $width="160px">
              <Input.Label>Target ID</Input.Label>
              <Input.Field
                $isValidate={true}
                type="number"
                placeholder="(opt)"
                onChange={(e) => {
                  setPage(0);
                  setTargetId(e.target.value ? Number(e.target.value) : undefined);
                }}
              />
            </Input>
            <Input $width="240px">
              <Input.Label>Start</Input.Label>
              <Input.Field
                $isValidate={true}
                type="datetime-local"
                onChange={(e) => {
                  setPage(0);
                  setStartDate(e.target.value ? new Date(e.target.value).toISOString() : undefined);
                }}
              />
            </Input>
            <Input $width="240px">
              <Input.Label>End</Input.Label>
              <Input.Field
                $isValidate={true}
                type="datetime-local"
                onChange={(e) => {
                  setPage(0);
                  setEndDate(e.target.value ? new Date(e.target.value).toISOString() : undefined);
                }}
              />
            </Input>
            <div>
              <label>Size</label>
              <Select
                value={limit}
                onChange={(e) => {
                  setPage(0);
                  setLimit(Number(e.target.value));
                }}
              >
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
          <AdminCardTitle>신고 목록</AdminCardTitle>
          {isLoading && <p>로딩 중...</p>}
          {error && (
            <p style={{ color: "#dc2626" }}>{(error as Error).message}</p>
          )}
          {!isLoading && !error && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ minWidth: "100%", fontSize: 14 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#6b7280" }}>
                    <th style={{ padding: 8 }}>
                      <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                    </th>
                    <th style={{ padding: 8 }}>ID</th>
                    <th style={{ padding: 8 }}>Reporter</th>
                    <th style={{ padding: 8 }}>Target</th>
                    <th style={{ padding: 8 }}>Count</th>
                    <th style={{ padding: 8 }}>Reason</th>
                    <th style={{ padding: 8 }}>Status</th>
                    <th style={{ padding: 8 }}>Created</th>
                    <th style={{ padding: 8 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.reports ?? []).length === 0 ? (
                    <tr>
                      <td style={{ padding: 8 }} colSpan={8}>
                        데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    (data?.reports ?? []).map((r) => (
                      <tr key={r.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                        <td style={{ padding: 8 }}>
                          <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleOne(r.id)} />
                        </td>
                        <td style={{ padding: 8 }}>{r.id}</td>
                        <td style={{ padding: 8 }}>{r.reporterId}</td>
                        <td style={{ padding: 8 }}>
                          {r.targetType} #{r.targetId}
                          {r.targetType === "FEED" ? (
                            <Link
                              href={`/?feedId=${r.targetId}&tab=comments`}
                              style={{ marginLeft: 6, textDecoration: "underline" }}
                              title="피드로 이동"
                            >
                              열기
                            </Link>
                          ) : (
                            <SmallButton
                              style={{ marginLeft: 6 }}
                              onClick={() => setTarget({ type: r.targetType, id: r.targetId })}
                            >
                              보기
                            </SmallButton>
                          )}
                        </td>
                        <td style={{ padding: 8 }}>
                          <CountCell type={r.targetType} id={r.targetId} />
                        </td>
                        <td style={{ padding: 8 }}>{r.reason}</td>
                        <td style={{ padding: 8 }}>{r.status}</td>
                        <td style={{ padding: 8 }}>
                          {new Date(r.createdAt).toLocaleString()}
                        </td>
                        <td style={{ padding: 8 }}>
                          <Actions>
                            <SmallButton onClick={() => setConfirm({ ids: [r.id], to: "PENDING" })} disabled={r.status === "PENDING"}>대기</SmallButton>
                            <SmallButton onClick={() => setConfirm({ ids: [r.id], to: "CONFIRMED" })} disabled={r.status === "CONFIRMED"}>확인</SmallButton>
                            <SmallButton onClick={() => setConfirm({ ids: [r.id], to: "REJECTED" })} disabled={r.status === "REJECTED"}>거부</SmallButton>
                          </Actions>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <Actions style={{ marginTop: 8 }}>
            <SmallButton
              onClick={() => setConfirm({ ids: Array.from(selected), to: "PENDING" })}
              disabled={selected.size === 0}
            >
              선택 대기
            </SmallButton>
            <SmallButton
              onClick={() => setConfirm({ ids: Array.from(selected), to: "CONFIRMED" })}
              disabled={selected.size === 0}
            >
              선택 확인
            </SmallButton>
            <SmallButton
              onClick={() => setConfirm({ ids: Array.from(selected), to: "REJECTED" })}
              disabled={selected.size === 0}
            >
              선택 거부
            </SmallButton>
          </Actions>

          <Pagination>
            <SmallButton disabled={!hasPrev} onClick={() => hasPrev && setPage((p) => p - 1)}>
              이전
            </SmallButton>
            <span>
              {page + 1} / {Math.max(1, Math.ceil(total / limit))}
            </span>
            <SmallButton disabled={!hasNext} onClick={() => hasNext && setPage((p) => p + 1)}>
              다음
            </SmallButton>
          </Pagination>
        </AdminCard>

        <Modal isOpen={!!target} onClose={() => setTarget(null)}>
          <Modal.Header>
            <h3 id="modal-title">대상 신고 상세</h3>
          </Modal.Header>
          <Modal.Body>
            {target && (
              <div id="modal-content" style={{ textAlign: "left" }}>
                <SectionLabel>
                  Target: {target.type} #{target.id}
                </SectionLabel>
                {targetLoading && <p>로딩 중...</p>}
                {targetError && (
                  <p style={{ color: "#dc2626" }}>{(targetError as Error).message}</p>
                )}
                <div style={{ marginTop: 6, color: "#6b7280" }}>
                  총 신고 {(targetReports?.reports ?? []).length}건
                </div>
                <ul style={{ marginTop: 6, maxHeight: 260, overflow: "auto" }}>
                  {(targetReports?.reports ?? []).map((tr) => (
                    <li key={tr.id} style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
                      #{tr.id} • {tr.reason} • {tr.status} •
                      <span style={{ color: "#6b7280" }}> {new Date(tr.createdAt).toLocaleString()}</span>
                    </li>
                  ))}
                  {(targetReports?.reports ?? []).length === 0 && (
                    <li>데이터 없음</li>
                  )}
                </ul>
              </div>
            )}
          </Modal.Body>
        </Modal>

        <Modal isOpen={!!confirm} onClose={() => setConfirm(null)}>
          <Modal.Header>
            <h3 id="modal-title">상태 변경 확인</h3>
          </Modal.Header>
          <Modal.Body>
            <div id="modal-content" style={{ textAlign: "left" }}>
              {confirm && (
                <>
                  <div style={{ marginBottom: 6 }}>총 {confirm.ids.length}건을 {confirm.to} 상태로 변경하시겠습니까?</div>
                </>
              )}
            </div>
          </Modal.Body>
          <Actions>
            <SmallButton onClick={() => setConfirm(null)}>취소</SmallButton>
            <SmallButton
              onClick={async () => {
                if (!confirm) return;
                for (const id of confirm.ids) {
                  await updateMutation.mutateAsync({ id, next: confirm.to });
                }
                setSelected(new Set());
                setConfirm(null);
              }}
              disabled={updateMutation.isPending}
            >
              확인
            </SmallButton>
          </Actions>
        </Modal>
      </AdminContainer>
    </RequireAuth>
  );
}

function CountCell({ type, id }: { type: ReportTargetType; id: number }) {
  const { data, isLoading, error } = useQuery<number>({
    queryKey: ["admin", "reports", "count", type, id],
    queryFn: () => getAdminReportCountByTarget(type, id),
    staleTime: 60_000,
  });
  if (isLoading) return <span style={{ color: "#6b7280" }}>...</span>;
  if (error) return <span style={{ color: "#dc2626" }}>err</span>;
  return <span>{data ?? 0}</span>;
}

const Filters = styled.div`
  display: flex;
  gap: 12px;
  align-items: end;
  flex-wrap: wrap;
`;

const Select = styled.select`
  display: block;
  margin-top: 4px;
  border: 1px solid #d5d7da;
  border-radius: 6px;
  padding: 6px 10px;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
`;
