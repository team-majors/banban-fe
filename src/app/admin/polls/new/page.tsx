"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import { Input } from "@/components/common/Input";
import { useToast } from "@/components/common/Toast/useToast";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  createAdminPoll,
  updateAdminPoll,
  updateAdminPollOption,
} from "@/remote/admin";
import type { Poll, PollOption } from "@/types/poll";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminContainer,
  AdminPageHeader,
  AdminCard,
  AdminCardTitle,
  SectionLabel,
  SmallButton,
  MetaRow,
  OptionIndex,
  Actions,
} from "@/components/admin/AdminUI";

interface CreatePollForm {
  title: string;
  pollDate: string;
  options: Array<{ content: string }>;
}

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:cursor-not-allowed disabled:opacity-60";
const inputInlineClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200";

export default function AdminPollCreatePage() {
  const { showToast } = useToast();
  const router = useRouter();

  const [createdPoll, setCreatedPoll] = useState<Poll | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePollForm>({
    defaultValues: {
      title: "",
      pollDate: "",
      options: [{ content: "" }, { content: "" }],
    },
    mode: "onBlur",
  });

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "options",
  });

  const createMutation = useMutation({
    mutationFn: createAdminPoll,
    onSuccess: (poll) => {
      setCreatedPoll(poll);
      showToast({ type: "success", message: "투표가 생성되었습니다." });
      reset({
        title: "",
        pollDate: "",
        options: [{ content: "" }, { content: "" }],
      });
      try {
        router.replace(`/admin/polls/${poll.id}?poll_date=${poll.pollDate}`);
      } catch {
        // ignore navigation errors
      }
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "생성 실패";
      showToast({ type: "error", message });
    },
  });

  const updateMetaMutation = useMutation({
    mutationFn: ({
      pollId,
      title,
      pollDate,
    }: {
      pollId: number;
      title?: string;
      pollDate?: string;
    }) => updateAdminPoll(pollId, { title, pollDate }),
    onSuccess: (poll) => {
      setCreatedPoll(poll);
      showToast({ type: "success", message: "투표 정보가 수정되었습니다." });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "수정 실패";
      showToast({ type: "error", message });
    },
  });

  const updateOptionMutation = useMutation({
    mutationFn: ({
      pollId,
      option,
    }: {
      pollId: number;
      option: PollOption;
    }) => updateAdminPollOption(pollId, option.id, { content: option.content }),
    onSuccess: (updated) => {
      setCreatedPoll((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          options: prev.options.map((o) =>
            o.id === updated.id ? { ...o, content: updated.content } : o,
          ),
        };
      });
      showToast({ type: "success", message: "옵션이 수정되었습니다." });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "옵션 수정 실패";
      showToast({ type: "error", message });
    },
  });

  const onCreate = (data: CreatePollForm) => {
    if ((data.options ?? []).length < 2) {
      showToast({ type: "error", message: "옵션은 최소 2개 필요합니다." });
      return;
    }
    const empty = data.options.findIndex((o) => !o.content.trim());
    if (empty !== -1) {
      showToast({
        type: "error",
        message: `옵션 ${empty + 1}를 입력하세요.`,
      });
      return;
    }
    createMutation.mutate(data);
  };

  return (
    <RequireAuth>
      <AdminContainer>
        <AdminPageHeader>관리자 · 투표 관리</AdminPageHeader>

        <AdminCard>
          <AdminCardTitle>투표 생성</AdminCardTitle>
          <form
            onSubmit={handleSubmit(onCreate)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-wrap items-end gap-3">
              <Input $width="100%">
                <Input.Label>제목</Input.Label>
                <Input.Field
                  $isValidate={!errors.title}
                  placeholder="투표 제목을 입력하세요"
                  maxLength={255}
                  {...register("title", { required: true, maxLength: 255 })}
                />
                {errors.title && (
                  <Input.ErrorMessage>
                    제목은 1-255자입니다.
                  </Input.ErrorMessage>
                )}
              </Input>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <Input $width="260px">
                <Input.Label>투표 날짜</Input.Label>
                <Input.Field
                  $isValidate={!errors.pollDate}
                  type="date"
                  {...register("pollDate", { required: true })}
                />
                {errors.pollDate && (
                  <Input.ErrorMessage>날짜를 선택하세요.</Input.ErrorMessage>
                )}
              </Input>
            </div>

            <div className="flex flex-col gap-3">
              <SectionLabel>옵션 (최소 2개)</SectionLabel>

              <div className="space-y-3">
                {fields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-[40px_minmax(0,1fr)_auto_auto_auto]"
                  >
                    <OptionIndex className="justify-self-start">
                      {idx + 1}
                    </OptionIndex>
                    <Input $width="100%">
                      <Input.Field
                        $isValidate={true}
                        placeholder="옵션 내용을 입력하세요"
                        {...register(`options.${idx}.content` as const, {
                          required: true,
                        })}
                      />
                    </Input>

                    <SmallButton
                      type="button"
                      onClick={() => {
                        if (fields.length <= 2) {
                          showToast({
                            type: "error",
                            message: "옵션은 최소 2개가 필요합니다.",
                          });
                          return;
                        }
                        remove(idx);
                      }}
                    >
                      삭제
                    </SmallButton>
                    <SmallButton
                      type="button"
                      onClick={() => idx > 0 && swap(idx, idx - 1)}
                    >
                      ▲
                    </SmallButton>
                    <SmallButton
                      type="button"
                      onClick={() =>
                        idx < fields.length - 1 && swap(idx, idx + 1)
                      }
                    >
                      ▼
                    </SmallButton>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={primaryButtonClass}
                onClick={() => append({ content: "" })}
              >
                옵션 추가
              </button>
            </div>

            <Actions className="justify-end">
              <button
                type="submit"
                className={primaryButtonClass}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "생성 중..." : "투표 생성"}
              </button>
            </Actions>
          </form>
        </AdminCard>

        {createdPoll && (
          <AdminCard>
            <AdminCardTitle>최근 생성된 투표</AdminCardTitle>
            <MetaRow>
              <Input $width="100%">
                <Input.Label>제목</Input.Label>
                <Input.Field
                  $isValidate={true}
                  defaultValue={createdPoll.title}
                  onChange={(e) =>
                    setCreatedPoll((prev) =>
                      prev ? { ...prev, title: e.target.value } : prev,
                    )
                  }
                />
              </Input>
            </MetaRow>
            <MetaRow>
              <Input $width="260px">
                <Input.Label>투표 날짜</Input.Label>
                <Input.Field
                  $isValidate={true}
                  type="date"
                  defaultValue={createdPoll.pollDate}
                  onChange={(e) =>
                    setCreatedPoll((prev) =>
                      prev ? { ...prev, pollDate: e.target.value } : prev,
                    )
                  }
                />
              </Input>
              <button
                className={primaryButtonClass}
                onClick={() =>
                  updateMetaMutation.mutate({
                    pollId: createdPoll.id,
                    title: createdPoll.title,
                    pollDate: createdPoll.pollDate,
                  })
                }
                disabled={updateMetaMutation.isPending}
              >
                {updateMetaMutation.isPending
                  ? "저장 중..."
                  : "제목/날짜 저장"}
              </button>
            </MetaRow>

            <SectionLabel className="mt-4">옵션 수정</SectionLabel>
            <div className="mt-3 space-y-3">
              {(createdPoll.options ?? []).map((opt) => (
                <div
                  key={opt.id}
                  className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-[40px_minmax(0,1fr)_auto]"
                >
                  <OptionIndex className="justify-self-start">
                    #{opt.optionOrder}
                  </OptionIndex>
                  <input
                    className={inputInlineClass}
                    defaultValue={opt.content}
                    onChange={(e) =>
                      setCreatedPoll((prev) =>
                        prev
                          ? {
                              ...prev,
                              options: prev.options.map((o) =>
                                o.id === opt.id
                                  ? { ...o, content: e.target.value }
                                  : o,
                              ),
                            }
                          : prev,
                      )
                    }
                  />
                  <SmallButton
                    type="button"
                    onClick={() =>
                      updateOptionMutation.mutate({
                        pollId: createdPoll.id,
                        option: opt,
                      })
                    }
                    disabled={updateOptionMutation.isPending}
                  >
                    저장
                  </SmallButton>
                </div>
              ))}
            </div>
          </AdminCard>
        )}
      </AdminContainer>
    </RequireAuth>
  );
}
