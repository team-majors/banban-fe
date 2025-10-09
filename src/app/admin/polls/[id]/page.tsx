"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateAdminPoll, updateAdminPollOption } from "@/remote/admin";
import type { Poll, PollOption } from "@/types/poll";
import {
  AdminContainer,
  AdminPageHeader,
  AdminCard,
  AdminCardTitle,
  Actions,
  SmallButton,
  OptionIndex,
} from "@/components/admin/AdminUI";
import { Input } from "@/components/common/Input";
import { useToast } from "@/components/common/Toast/useToast";
import { fetchPoll } from "@/remote/poll";

export default function AdminPollEditPage() {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const pollId = Number(params.id);
  const pollDate = search.get("poll_date") || undefined;

  const {
    data: poll,
    isLoading,
    error,
    refetch,
  } = useQuery<Poll>({
    queryKey: ["admin", "poll", pollId, pollDate],
    queryFn: () => fetchPoll(pollDate!),
    enabled: !!pollDate && Number.isFinite(pollId),
  });

  const [localPoll, setLocalPoll] = useState<Poll | null>(null);
  useEffect(() => {
    if (poll) setLocalPoll(poll);
  }, [poll]);

  const saveMeta = useMutation({
    mutationFn: () =>
      updateAdminPoll(pollId, {
        title: localPoll?.title,
        pollDate: localPoll?.pollDate,
      }),
    onSuccess: (p) => {
      setLocalPoll(p);
      showToast({ type: "success", message: "저장되었습니다." });
      qc.invalidateQueries({ queryKey: ["admin", "polls"] });
    },
    onError: (e: unknown) => {
      const m = e instanceof Error ? e.message : "저장 실패";
      showToast({ type: "error", message: m });
    },
  });

  const saveOption = useMutation({
    mutationFn: (opt: PollOption) =>
      updateAdminPollOption(pollId, opt.id, { content: opt.content }),
    onSuccess: () => {
      showToast({ type: "success", message: "옵션 저장" });
      refetch();
    },
    onError: (e: unknown) => {
      const m = e instanceof Error ? e.message : "옵션 저장 실패";
      showToast({ type: "error", message: m });
    },
  });

  if (isLoading) {
    return (
      <AdminContainer>
        <p className="text-sm text-slate-500">로딩 중...</p>
      </AdminContainer>
    );
  }

  if (error || !localPoll) {
    return (
      <AdminContainer>
        <p className="text-sm text-red-600">에러 또는 데이터 없음</p>
      </AdminContainer>
    );
  }

  const options = localPoll?.options ?? [];

  return (
    <AdminContainer>
      <AdminPageHeader>관리자 · 투표 수정</AdminPageHeader>

      <AdminCard>
        <AdminCardTitle>메타데이터</AdminCardTitle>
        <div className="flex flex-wrap items-end gap-3">
          <Input $width="420px">
            <Input.Label>제목</Input.Label>
            <Input.Field
              $isValidate={true}
              defaultValue={localPoll.title}
              onChange={(e) =>
                setLocalPoll({ ...localPoll, title: e.target.value })
              }
            />
          </Input>
          <Input $width="200px">
            <Input.Label>투표일</Input.Label>
            <Input.Field
              $isValidate={true}
              type="date"
              defaultValue={localPoll.pollDate}
              onChange={(e) =>
                setLocalPoll({ ...localPoll, pollDate: e.target.value })
              }
            />
          </Input>
          <SmallButton
            onClick={() => saveMeta.mutate()}
            disabled={saveMeta.isPending}
          >
            {saveMeta.isPending ? "저장 중..." : "저장"}
          </SmallButton>
        </div>
      </AdminCard>

      <AdminCard>
        <AdminCardTitle>옵션</AdminCardTitle>
        <div className="space-y-4">
          {options.map((opt, idx) => (
            <div
              key={opt.id}
              className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
            >
              <div className="grid gap-3 md:grid-cols-[40px_minmax(0,1fr)_auto] md:items-center">
                <OptionIndex className="justify-self-start">
                  #{opt.optionOrder}
                </OptionIndex>
                <Input $width="100%">
                  <Input.Field
                    $isValidate={true}
                    defaultValue={opt.content}
                    onChange={(e) => {
                      const copy = [...options];
                      copy[idx] = { ...opt, content: e.target.value };
                      setLocalPoll({ ...localPoll, options: copy });
                    }}
                  />
                </Input>
                <SmallButton
                  className="mt-2 md:mt-0"
                  onClick={() => saveOption.mutate(options[idx])}
                  disabled={saveOption.isPending}
                >
                  저장
                </SmallButton>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                투표 수: {opt.voteCount ?? 0}
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard>
        <AdminCardTitle>기타</AdminCardTitle>
        <Actions>
          <SmallButton onClick={() => router.push("/admin/polls")}>
            목록으로
          </SmallButton>
        </Actions>
      </AdminCard>
    </AdminContainer>
  );
}
