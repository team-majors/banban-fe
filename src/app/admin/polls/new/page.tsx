"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import { Input } from "@/components/common/Input";
import { DefaultButton } from "@/components/common/Button";
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
import styled from "styled-components";
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

export default function AdminPollCreatePage() {
  const { showToast } = useToast();
  const router = useRouter();

  const [createdPoll, setCreatedPoll] = useState<Poll | null>(null);

  // Create form
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
      reset({ title: "", pollDate: "", options: [{ content: "" }, { content: "" }] });
      // 생성 후 수정 화면으로 이동 (백엔드 가이드)
      try {
        router.replace(`/admin/polls/${poll.id}?poll_date=${poll.pollDate}`);
      } catch {}
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
    }: { pollId: number; title?: string; pollDate?: string }) =>
      updateAdminPoll(pollId, { title, pollDate }),
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
    }: { pollId: number; option: PollOption }) =>
      updateAdminPollOption(pollId, option.id, { content: option.content }),
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
      showToast({ type: "error", message: `옵션 ${empty + 1}를 입력하세요.` });
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
          <Form onSubmit={handleSubmit(onCreate)}>
            <FieldRow>
              <Input $width="100%">
                <Input.Label>제목</Input.Label>
                <Input.Field
                  $isValidate={!errors.title}
                  placeholder="투표 제목을 입력하세요"
                  maxLength={255}
                  {...register("title", { required: true, maxLength: 255 })}
                />
                {errors.title && (
                  <Input.ErrorMessage>제목은 1-255자입니다.</Input.ErrorMessage>
                )}
              </Input>
            </FieldRow>

            <FieldRow>
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
            </FieldRow>

            <FieldRow>
              <SectionLabel>옵션 (최소 2개)</SectionLabel>

              <OptionsList>
                {fields.map((field, idx) => (
                  <OptionRow key={field.id}>
                    <OptionIndex>{idx + 1}</OptionIndex>
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
                      onClick={() => idx < fields.length - 1 && swap(idx, idx + 1)}
                    >
                      ▼
                    </SmallButton>
                  </OptionRow>
                ))}
              </OptionsList>

              <DefaultButton
                type="button"
                onClick={() => append({ content: "" })}
              >
                옵션 추가
              </DefaultButton>
            </FieldRow>

            <Actions>
              <DefaultButton type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "생성 중..." : "투표 생성"}
              </DefaultButton>
            </Actions>
          </Form>
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
              <DefaultButton
                onClick={() =>
                  updateMetaMutation.mutate({
                    pollId: createdPoll.id,
                    title: createdPoll.title,
                    pollDate: createdPoll.pollDate,
                  })
                }
                disabled={updateMetaMutation.isPending}
              >
                {updateMetaMutation.isPending ? "저장 중..." : "제목/날짜 저장"}
              </DefaultButton>
            </MetaRow>

            <SectionLabel>옵션 수정</SectionLabel>
            <OptionsList>
              {(createdPoll.options ?? []).map((opt) => (
                <OptionRow key={opt.id}>
                  <OptionIndex>#{opt.optionOrder}</OptionIndex>
                  <InlineInput
                    defaultValue={opt.content}
                    onChange={(e) =>
                      setCreatedPoll((prev) =>
                        prev
                          ? {
                              ...prev,
                              options: prev.options.map((o) =>
                                o.id === opt.id ? { ...o, content: e.target.value } : o,
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
                </OptionRow>
              ))}
            </OptionsList>
          </AdminCard>
        )}
      </AdminContainer>
    </RequireAuth>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const OptionRow = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr auto auto auto;
  gap: 8px;
  align-items: center;
`;

const InlineInput = styled.input`
  width: 100%;
  border: 1px solid #d5d7da;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 1px 2px rgba(10, 13, 18, 0.05);
`;
