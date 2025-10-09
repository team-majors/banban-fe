"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  SectionLabel,
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

  const { data: poll, isLoading, error, refetch } = useQuery<Poll>({
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
    mutationFn: (opt: PollOption) => updateAdminPollOption(pollId, opt.id, { content: opt.content }),
    onSuccess: () => {
      showToast({ type: "success", message: "옵션 저장" });
      refetch();
    },
    onError: (e: unknown) => {
      const m = e instanceof Error ? e.message : "옵션 저장 실패";
      showToast({ type: "error", message: m });
    },
  });

  // 미구현 API(삭제/추가/삭제/순서)는 UI에서 숨김 처리

  // 테스트 투표는 요구사항상 제거

  if (isLoading) return <AdminContainer>로딩 중...</AdminContainer>;
  if (error || !localPoll) return <AdminContainer>에러 또는 데이터 없음</AdminContainer>;

  const options = localPoll?.options ?? [];

  return (
    <AdminContainer>
      <AdminPageHeader>관리자 · 투표 수정</AdminPageHeader>

      <AdminCard>
        <AdminCardTitle>메타데이터</AdminCardTitle>
        <div style={{ display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
          <Input $width="420px">
            <Input.Label>제목</Input.Label>
            <Input.Field
              $isValidate={true}
              defaultValue={localPoll.title}
              onChange={(e) => setLocalPoll({ ...localPoll, title: e.target.value })}
            />
          </Input>
          <Input $width="200px">
            <Input.Label>투표일</Input.Label>
            <Input.Field
              $isValidate={true}
              type="date"
              defaultValue={localPoll.pollDate}
              onChange={(e) => setLocalPoll({ ...localPoll, pollDate: e.target.value })}
            />
          </Input>
          <SmallButton onClick={() => saveMeta.mutate()} disabled={saveMeta.isPending}>
            {saveMeta.isPending ? "저장 중..." : "저장"}
          </SmallButton>
        </div>
      </AdminCard>

      <AdminCard>
        <AdminCardTitle>옵션</AdminCardTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {options.map((opt, idx) => (
            <div key={opt.id} style={{ display: "grid", gridTemplateColumns: "28px 1fr auto auto", gap: 8, alignItems: "center" }}>
              <OptionIndex>#{opt.optionOrder}</OptionIndex>
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
              <SmallButton onClick={() => saveOption.mutate(options[idx])}>저장</SmallButton>
              <div style={{ gridColumn: "2 / -1", color: "#6b7280", fontSize: 12 }}>
                투표 수: {opt.voteCount ?? 0}
              </div>
            </div>
          ))}
        </div>
        {/* 옵션 추가/삭제/순서 변경은 백엔드 미구현으로 숨김 */}
      </AdminCard>

      <AdminCard>
        <AdminCardTitle>기타</AdminCardTitle>
        <Actions>
          <SmallButton onClick={() => router.push("/admin/polls")}>목록으로</SmallButton>
        </Actions>
      </AdminCard>
    </AdminContainer>
  );
}
