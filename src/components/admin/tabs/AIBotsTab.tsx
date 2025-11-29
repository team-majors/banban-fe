"use client";

import { useState } from "react";
import styled from "styled-components";
import {
  AdminCard,
  AdminCardTitle,
  Actions,
  SmallButton,
} from "@/components/admin/AdminUI";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminAIBots,
  deleteAdminAIBot,
  toggleAdminAIBotActivation,
  testAdminAIBotFeed,
  testAdminAIBotComment,
  getAdminAIBotActivityLog,
} from "@/remote/admin";
import type { AdminAIBot, AdminAIBotsData } from "@/types/admin";
import { useToast } from "@/components/common/Toast/useToast";
import { Modal } from "@/components/common/Modal/Modal";
import AIBotModal from "@/components/admin/modals/AIBotModal";
import AIBotActivityLogModal from "@/components/admin/modals/AIBotActivityLogModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const tableHeaderClass =
  "px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";
const tableCellClass = "px-4 py-2 text-sm text-slate-700";

const DEFAULT_LIMIT = 20;

export const AIBotsTab = () => {
  const { showToast } = useToast();
  const qc = useQueryClient();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<AdminAIBot | null>(null);
  const [activityLogBot, setActivityLogBot] = useState<AdminAIBot | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { data, isLoading, error } = useQuery<AdminAIBotsData>({
    queryKey: ["admin", "ai-bots", { page, limit }],
    queryFn: () =>
      getAdminAIBots({
        limit,
        offset: page * limit,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (botId: number) => deleteAdminAIBot(botId),
    onSuccess: () => {
      showToast({ type: "success", message: "AI 봇이 삭제되었습니다." });
      qc.invalidateQueries({ queryKey: ["admin", "ai-bots"] });
      setConfirmDelete(null);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "삭제 실패";
      showToast({ type: "error", message });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ botId, isActive }: { botId: number; isActive: boolean }) =>
      toggleAdminAIBotActivation(botId, isActive),
    onSuccess: () => {
      showToast({
        type: "success",
        message: "AI 봇 상태가 변경되었습니다.",
      });
      qc.invalidateQueries({ queryKey: ["admin", "ai-bots"] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "상태 변경 실패";
      showToast({ type: "error", message });
    },
  });

  const testFeedMutation = useMutation({
    mutationFn: (botId: number) => testAdminAIBotFeed(botId),
    onSuccess: (data) => {
      showToast({
        type: "success",
        message: data.message || "피드 생성 테스트가 완료되었습니다.",
      });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "테스트 실패";
      showToast({ type: "error", message });
    },
  });

  const testCommentMutation = useMutation({
    mutationFn: (botId: number) => testAdminAIBotComment(botId),
    onSuccess: (data) => {
      showToast({
        type: "success",
        message: data.message || "댓글 생성 테스트가 완료되었습니다.",
      });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "테스트 실패";
      showToast({ type: "error", message });
    },
  });

  const total = data?.total ?? 0;
  const hasNext = (page + 1) * limit < total;
  const hasPrev = page > 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR");
  };

  const bots = data?.bots ?? [];

  return (
    <Container>
      <AdminCard>
        <AdminCardTitle>AI 봇 목록</AdminCardTitle>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            총 {total}개 (페이지 {page + 1})
          </div>
          <SmallButton onClick={() => setCreateModalOpen(true)}>
            새 봇 생성
          </SmallButton>
        </div>

        {isLoading && <p className="text-sm text-slate-500">로딩 중...</p>}
        {error && (
          <p className="text-sm text-red-600">{(error as Error).message}</p>
        )}
        {!isLoading && !error && bots.length === 0 && (
          <p className="text-sm text-slate-500">AI 봇이 없습니다.</p>
        )}
        {!isLoading && !error && bots.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className={`${tableHeaderClass} w-20`}>ID</th>
                  <th className={tableHeaderClass}>이름</th>
                  <th className={tableHeaderClass}>Username</th>
                  <th className={tableHeaderClass}>상태</th>
                  <th className={`${tableHeaderClass} w-48`}>생성일</th>
                  <th className={`${tableHeaderClass} w-80`}>작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/95">
                {bots.map((bot) => (
                  <tr key={bot.id} className="hover:bg-slate-50/70">
                    <td className={tableCellClass}>{bot.id}</td>
                    <td className={tableCellClass} title={bot.name}>
                      <div className="max-w-xs truncate">{bot.name}</div>
                    </td>
                    <td className={tableCellClass}>{bot.username}</td>
                    <td className={tableCellClass}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            toggleMutation.mutate({
                              botId: bot.id,
                              isActive: !bot.isActive,
                            })
                          }
                          disabled={toggleMutation.isPending}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            bot.isActive
                              ? "bg-green-500"
                              : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              bot.isActive ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span className="text-xs">
                          {bot.isActive ? "활성" : "비활성"}
                        </span>
                      </div>
                    </td>
                    <td className={tableCellClass}>
                      {formatDate(bot.createdAt)}
                    </td>
                    <td className={tableCellClass}>
                      <Actions>
                        <SmallButton
                          onClick={() => setEditingBot(bot)}
                          disabled={editingBot !== null}
                        >
                          수정
                        </SmallButton>
                        <SmallButton
                          onClick={() => setActivityLogBot(bot)}
                          disabled={activityLogBot !== null}
                        >
                          로그
                        </SmallButton>
                        <SmallButton
                          onClick={() =>
                            testFeedMutation.mutate(bot.id)
                          }
                          disabled={testFeedMutation.isPending}
                        >
                          피드 테스트
                        </SmallButton>
                        <SmallButton
                          onClick={() =>
                            testCommentMutation.mutate(bot.id)
                          }
                          disabled={testCommentMutation.isPending}
                        >
                          댓글 테스트
                        </SmallButton>
                        <SmallButton
                          onClick={() =>
                            setConfirmDelete({ id: bot.id, name: bot.name })
                          }
                          style={{
                            color: "#dc2626",
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          삭제
                        </SmallButton>
                      </Actions>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !error && bots.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label htmlFor="limit" className="text-sm text-slate-600">
                페이지 크기:
              </label>
              <select
                id="limit"
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
                value={limit}
                onChange={(e) => {
                  setPage(0);
                  setLimit(Number(e.target.value));
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!hasPrev}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm disabled:opacity-50"
              >
                이전
              </button>
              <span className="text-sm text-slate-600">
                {page + 1} / {Math.ceil(total / limit) || 1}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </AdminCard>

      {/* Create/Edit Modal */}
      {createModalOpen && (
        <AIBotModal
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => {
            setCreateModalOpen(false);
            qc.invalidateQueries({ queryKey: ["admin", "ai-bots"] });
          }}
        />
      )}

      {editingBot && (
        <AIBotModal
          bot={editingBot}
          onClose={() => setEditingBot(null)}
          onSuccess={() => {
            setEditingBot(null);
            qc.invalidateQueries({ queryKey: ["admin", "ai-bots"] });
          }}
        />
      )}

      {/* Activity Log Modal */}
      {activityLogBot && (
        <AIBotActivityLogModal
          bot={activityLogBot}
          onClose={() => setActivityLogBot(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <Modal
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          width="400px"
        >
          <Modal.Header>
            <Modal.Title>AI 봇 삭제</Modal.Title>
            <Modal.Description>
              "{confirmDelete.name}" 봇을 삭제하시겠습니까? 이 작업은 되돌릴
              수 없습니다.
            </Modal.Description>
          </Modal.Header>
          <Modal.Actions direction="row" align="end">
            <Modal.Button
              $variant="secondary"
              onClick={() => setConfirmDelete(null)}
              disabled={deleteMutation.isPending}
            >
              취소
            </Modal.Button>
            <Modal.Button
              $variant="danger"
              onClick={() => deleteMutation.mutate(confirmDelete.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "삭제 중..." : "삭제"}
            </Modal.Button>
          </Modal.Actions>
        </Modal>
      )}
    </Container>
  );
};

export default AIBotsTab;
