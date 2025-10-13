/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useToast } from "@/components/common/Toast/useToast";
import { Modal } from "@/components/common/Modal/Modal";
import Link from "next/link";

const selectClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200";
const tableHeaderClass =
  "px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";
const tableCellClass = "px-4 py-2 text-sm text-slate-700";
const badgeClass =
  "inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700";

const DEFAULT_LIMIT = 20;

export default function AdminReportsPage() {
  const { showToast } = useToast();
  const qc = useQueryClient();

  const [status, setStatus] = useState<ReportStatus>("PENDING");
  const [page, setPage] = useState(0);
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

  const [target, setTarget] = useState<{
    type: ReportTargetType;
    id: number;
  } | null>(null);

  const targetKey = useMemo(
    () =>
      target
        ? ["admin", "reports", "target", target.type, target.id]
        : undefined,
    [target],
  );

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

  const [confirm, setConfirm] = useState<null | {
    ids: number[];
    to: ReportStatus;
  }>(null);

  const {
    data: targetReports,
    isLoading: targetLoading,
    error: targetError,
  } = useQuery<{ reports: AdminReportItem[] }>({
    queryKey: targetKey as any,
    queryFn: () => getAdminReportsByTarget(target!.type, target!.id),
    enabled: !!target,
  });

  return (
    <RequireAuth>
      <AdminContainer>
        <AdminPageHeader>관리자 · 신고 관리</AdminPageHeader>

        <AdminCard>
          <AdminCardTitle>필터</AdminCardTitle>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col text-sm text-slate-600">
              <label
                className="text-xs font-semibold text-slate-500"
                htmlFor="status"
              >
                상태
              </label>
              <select
                id="status"
                className={selectClass}
                value={status}
                onChange={(e) => {
                  setPage(0);
                  setStatus(e.target.value as ReportStatus);
                }}
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <Input $width="160px">
              <Input.Label>User ID</Input.Label>
              <Input.Field
                $isValidate={true}
                type="number"
                placeholder="(opt)"
                onChange={(e) => {
                  setPage(0);
                  setUserId(
                    e.target.value ? Number(e.target.value) : undefined,
                  );
                }}
              />
            </Input>

            <div className="flex flex-col text-sm text-slate-600">
              <label
                className="text-xs font-semibold text-slate-500"
                htmlFor="targetType"
              >
                대상 타입
              </label>
              <select
                id="targetType"
                className={selectClass}
                value={targetType ?? ""}
                onChange={(e) => {
                  setPage(0);
                  setTargetType(
                    (e.target.value || undefined) as
                      | ReportTargetType
                      | undefined,
                  );
                }}
              >
                <option value="">(all)</option>
                <option value="FEED">FEED</option>
                <option value="COMMENT">COMMENT</option>
              </select>
            </div>

            <Input $width="160px">
              <Input.Label>Target ID</Input.Label>
              <Input.Field
                $isValidate={true}
                type="number"
                placeholder="(opt)"
                onChange={(e) => {
                  setPage(0);
                  setTargetId(
                    e.target.value ? Number(e.target.value) : undefined,
                  );
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
                  setStartDate(
                    e.target.value
                      ? new Date(e.target.value).toISOString()
                      : undefined,
                  );
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
                  setEndDate(
                    e.target.value
                      ? new Date(e.target.value).toISOString()
                      : undefined,
                  );
                }}
              />
            </Input>

            <div className="flex flex-col text-sm text-slate-600">
              <label
                className="text-xs font-semibold text-slate-500"
                htmlFor="size"
              >
                Size
              </label>
              <select
                id="size"
                className={selectClass}
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
              </select>
            </div>

            <SmallButton onClick={() => refetch()}>적용</SmallButton>
          </div>
        </AdminCard>

        <AdminCard>
          <AdminCardTitle>신고 목록</AdminCardTitle>
          {isLoading && <p className="text-sm text-slate-500">로딩 중...</p>}
          {error && (
            <p className="text-sm text-red-600">{(error as Error).message}</p>
          )}
          {!isLoading && !error && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className={`${tableHeaderClass} w-12`}>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 accent-slate-700"
                        checked={allSelected}
                        onChange={toggleAll}
                      />
                    </th>
                    <th className={tableHeaderClass}>ID</th>
                    <th className={tableHeaderClass}>Reporter</th>
                    <th className={tableHeaderClass}>Target</th>
                    <th className={tableHeaderClass}>Count</th>
                    <th className={tableHeaderClass}>Reason</th>
                    <th className={tableHeaderClass}>Status</th>
                    <th className={tableHeaderClass}>Created</th>
                    <th className={tableHeaderClass}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white/95">
                  {(data?.reports ?? []).length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-6 text-center text-sm text-slate-500"
                      >
                        데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    (data?.reports ?? []).map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70">
                        <td className={`${tableCellClass} w-12`}>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 accent-slate-700"
                            checked={selected.has(r.id)}
                            onChange={() => toggleOne(r.id)}
                          />
                        </td>
                        <td className={tableCellClass}>{r.id}</td>
                        <td className={tableCellClass}>{r.reporterId}</td>
                        <td className={`${tableCellClass} space-x-2`}>
                          <span>
                            {r.targetType} #{r.targetId}
                          </span>
                          {r.targetType === "FEED" ? (
                            <Link
                              href={`/?feedId=${r.targetId}&tab=comments`}
                              className="text-xs font-semibold text-slate-600 underline underline-offset-4"
                              title="피드로 이동"
                            >
                              열기
                            </Link>
                          ) : (
                            <SmallButton
                              className="px-2 py-1 text-[11px]"
                              onClick={() =>
                                setTarget({
                                  type: r.targetType,
                                  id: r.targetId,
                                })
                              }
                            >
                              보기
                            </SmallButton>
                          )}
                        </td>
                        <td className={tableCellClass}>
                          <CountCell type={r.targetType} id={r.targetId} />
                        </td>
                        <td className={tableCellClass}>{r.reason}</td>
                        <td className={tableCellClass}>
                          <span className={badgeClass}>{r.status}</span>
                        </td>
                        <td className={`${tableCellClass} whitespace-nowrap`}>
                          {new Date(r.createdAt).toLocaleString()}
                        </td>
                        <td className={tableCellClass}>
                          <Actions className="justify-start">
                            <SmallButton
                              onClick={() =>
                                setConfirm({ ids: [r.id], to: "PENDING" })
                              }
                              disabled={r.status === "PENDING"}
                            >
                              대기
                            </SmallButton>
                            <SmallButton
                              onClick={() =>
                                setConfirm({ ids: [r.id], to: "CONFIRMED" })
                              }
                              disabled={r.status === "CONFIRMED"}
                            >
                              확인
                            </SmallButton>
                            <SmallButton
                              onClick={() =>
                                setConfirm({ ids: [r.id], to: "REJECTED" })
                              }
                              disabled={r.status === "REJECTED"}
                            >
                              거부
                            </SmallButton>
                          </Actions>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <Actions className="mt-4 border-t border-slate-100 pt-4">
            <SmallButton
              onClick={() =>
                setConfirm({ ids: Array.from(selected), to: "PENDING" })
              }
              disabled={selected.size === 0}
            >
              선택 대기
            </SmallButton>
            <SmallButton
              onClick={() =>
                setConfirm({ ids: Array.from(selected), to: "CONFIRMED" })
              }
              disabled={selected.size === 0}
            >
              선택 확인
            </SmallButton>
            <SmallButton
              onClick={() =>
                setConfirm({ ids: Array.from(selected), to: "REJECTED" })
              }
              disabled={selected.size === 0}
            >
              선택 거부
            </SmallButton>
          </Actions>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50/70 px-4 py-3">
            <SmallButton
              className="px-3 py-1.5"
              disabled={!hasPrev}
              onClick={() => hasPrev && setPage((p) => p - 1)}
            >
              이전
            </SmallButton>
            <span className="text-sm text-slate-600">
              {page + 1} / {Math.max(1, Math.ceil(total / limit))}
            </span>
            <SmallButton
              className="px-3 py-1.5"
              disabled={!hasNext}
              onClick={() => hasNext && setPage((p) => p + 1)}
            >
              다음
            </SmallButton>
          </div>
        </AdminCard>

        <Modal isOpen={!!target} onClose={() => setTarget(null)}>
          <Modal.Header>
            <h3 id="modal-title" className="text-lg font-semibold">
              대상 신고 상세
            </h3>
          </Modal.Header>
          <Modal.Body>
            {target && (
              <div id="modal-content" className="space-y-3 text-left">
                <SectionLabel>
                  Target: {target.type} #{target.id}
                </SectionLabel>
                {targetLoading && (
                  <p className="text-sm text-slate-500">로딩 중...</p>
                )}
                {targetError && (
                  <p className="text-sm text-red-600">
                    {(targetError as Error).message}
                  </p>
                )}
                <div className="text-xs text-slate-500">
                  총 신고 {(targetReports?.reports ?? []).length}건
                </div>
                <ul className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
                  {(targetReports?.reports ?? []).map((tr) => (
                    <li
                      key={tr.id}
                      className="flex flex-col gap-1 rounded-lg bg-slate-50/60 px-3 py-2"
                    >
                      <div className="text-sm font-semibold text-slate-900">
                        #{tr.id} • {tr.status}
                      </div>
                      <div>{tr.reason}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(tr.createdAt).toLocaleString()}
                      </div>
                    </li>
                  ))}
                  {(targetReports?.reports ?? []).length === 0 && (
                    <li className="text-center text-sm text-slate-500">
                      데이터 없음
                    </li>
                  )}
                </ul>
              </div>
            )}
          </Modal.Body>
          <Actions className="justify-end border-t border-slate-200 px-6 py-4">
            <SmallButton onClick={() => setTarget(null)}>닫기</SmallButton>
          </Actions>
        </Modal>

        <Modal isOpen={!!confirm} onClose={() => setConfirm(null)}>
          <Modal.Header>
            <h3 id="modal-title" className="text-lg font-semibold">
              상태 변경 확인
            </h3>
          </Modal.Header>
          <Modal.Body>
            <div id="modal-content" className="space-y-3 text-left">
              {confirm && (
                <p className="text-sm text-slate-700">
                  총 {confirm.ids.length}건을 {confirm.to} 상태로
                  변경하시겠습니까?
                </p>
              )}
            </div>
          </Modal.Body>
          <Actions className="justify-end border-t border-slate-200 px-6 py-4">
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

  if (isLoading) return <span className="text-xs text-slate-400">...</span>;
  if (error) return <span className="text-xs text-red-500">err</span>;
  return <span className="font-semibold text-slate-900">{data ?? 0}</span>;
}
