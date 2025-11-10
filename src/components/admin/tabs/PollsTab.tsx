"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styled from "styled-components";
import dynamic from "next/dynamic";
import {
  AdminCard,
  AdminCardTitle,
  Actions,
  SmallButton,
  SectionLabel,
} from "@/components/admin/AdminUI";
import { getAdminPolls, type AdminPollListParams } from "@/remote/admin";
import type { Poll } from "@/types/poll";

const PollCreateModal = dynamic(
  () =>
    import("../modals/PollCreateModal").then((mod) => mod.PollCreateModal),
  { ssr: false, loading: () => null },
);

const PollEditModal = dynamic(
  () => import("../modals/PollEditModal").then((mod) => mod.PollEditModal),
  { ssr: false, loading: () => null },
);

const selectClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200";
const tableHeaderClass =
  "px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";
const tableCellClass = "px-4 py-2 text-sm text-slate-700";

export const PollsTab = () => {
  const qc = useQueryClient();
  const [params, setParams] = useState<AdminPollListParams>({
    page: 1,
    size: 20,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPoll, setEditingPoll] = useState<{
    id: number;
    pollDate: string;
  } | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "polls", params],
    queryFn: () => getAdminPolls(params),
  });

  const polls = data?.polls ?? [];
  const hasNext = data?.hasNext ?? false;

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    // 투표 생성 후 목록 갱신 (완료 여부와 관계없이)
    qc.invalidateQueries({ queryKey: ["admin", "polls"] });
  };

  const handleEditModalClose = () => {
    setEditingPoll(null);
    // 투표 수정 후 목록 갱신
    qc.invalidateQueries({ queryKey: ["admin", "polls"] });
  };

  return (
    <Container>
      <AdminCard>
        <AdminCardTitle>목록</AdminCardTitle>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <SectionLabel className="text-xs text-slate-500">
              페이지 크기
            </SectionLabel>
            <select
              value={params.size}
              onChange={(e) =>
                setParams((p) => ({
                  ...p,
                  page: 1,
                  size: Number(e.target.value),
                }))
              }
              className={selectClass}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="ml-auto">
            <SmallButton onClick={() => setIsCreateModalOpen(true)}>
              ➕ 새 투표
            </SmallButton>
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <AdminCardTitle>투표 목록</AdminCardTitle>
        {isLoading && <p className="text-sm text-slate-500">로딩 중...</p>}
        {error && (
          <p className="text-sm text-red-600">
            {(error as Error).message}
          </p>
        )}
        {!isLoading && !error && (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className={tableHeaderClass}>ID</th>
                  <th className={tableHeaderClass}>제목</th>
                  <th className={tableHeaderClass}>투표일</th>
                  <th className={tableHeaderClass}>총 투표수</th>
                  <th className={tableHeaderClass}>옵션 수</th>
                  <th className={tableHeaderClass}>액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/95">
                {polls.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-sm text-slate-500"
                    >
                      데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  polls.map((p: Poll) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className={tableCellClass}>{p.id}</td>
                      <td className={`${tableCellClass} font-semibold text-slate-900`}>
                        {p.title}
                      </td>
                      <td className={tableCellClass}>{p.pollDate}</td>
                      <td className={tableCellClass}>{p.totalVotes ?? 0}</td>
                      <td className={tableCellClass}>
                        {p.options?.length ?? 0}
                      </td>
                      <td className={tableCellClass}>
                        <Actions className="justify-start">
                          <SmallButton
                            onClick={() =>
                              setEditingPoll({
                                id: p.id,
                                pollDate: p.pollDate,
                              })
                            }
                          >
                            수정
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

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50/70 px-4 py-3">
          <SmallButton
            onClick={() =>
              setParams((p) => ({
                ...p,
                page: Math.max(1, (p.page || 1) - 1),
              }))
            }
            disabled={(params.page || 1) <= 1}
          >
            이전
          </SmallButton>
          <span className="text-sm text-slate-600">
            페이지 {params.page}
          </span>
          <SmallButton
            onClick={() =>
              setParams((p) => ({ ...p, page: (p.page || 1) + 1 }))}
            disabled={!hasNext}
          >
            다음
          </SmallButton>
        </div>
      </AdminCard>

      <PollCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
      />

      {editingPoll && (
        <PollEditModal
          isOpen={!!editingPoll}
          onClose={handleEditModalClose}
          pollId={editingPoll.id}
          pollDate={editingPoll.pollDate}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
