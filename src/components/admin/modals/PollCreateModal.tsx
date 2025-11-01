"use client";

import styled from "styled-components";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { useToast } from "@/components/common/Toast/useToast";
import {
  createAdminPoll,
  updateAdminPoll,
  updateAdminPollOption,
} from "@/remote/admin";
import type { Poll, PollOption } from "@/types/poll";

interface PollCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (poll: Poll) => void;
}

interface CreatePollForm {
  title: string;
  pollDate: string;
  options: Array<{ content: string }>;
}

const SectionLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 12px;
`;

const OptionContainer = styled.div`
  display: grid;
  gap: 12px;
  margin-bottom: 12px;
`;

const OptionItem = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: 40px 1fr auto auto auto;
  align-items: start;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
  padding: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OptionIndex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  background-color: #e2e8f0;
  border-radius: 4px;
  padding: 4px 8px;
  min-width: 40px;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;

    button {
      flex: 1;
      min-width: 40px;
    }
  }
`;

const SmallButton = styled.button`
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background-color: #f1f5f9;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #e2e8f0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled.button`
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background-color: #1f2937;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #111827;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AddOptionButton = styled(PrimaryButton)`
  width: 100%;
  margin-bottom: 12px;
`;

export const PollCreateModal = ({
  isOpen,
  onClose,
  onCreated,
}: PollCreateModalProps) => {
  const { showToast } = useToast();
  const [step, setStep] = useState<"form" | "edit">("form");
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
      setStep("edit");
      showToast({ type: "success", message: "투표가 생성되었습니다." });
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
        message: `옵션 ${empty + 1}을 입력하세요.`,
      });
      return;
    }
    createMutation.mutate(data);
  };

  const handleClose = () => {
    reset();
    setCreatedPoll(null);
    setStep("form");
    onClose();
  };

  const handleCreateComplete = () => {
    if (createdPoll) {
      onCreated?.(createdPoll);
    }
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width="600px">
      <Modal.Layout>
        <ModalHeader>
          <ModalTitle>
            {step === "form" ? "투표 생성" : "투표 수정"}
          </ModalTitle>
        </ModalHeader>

        {step === "form" ? (
          <form onSubmit={handleSubmit(onCreate)}>
            <FormContent>
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

              <div>
                <SectionLabel>옵션 (최소 2개)</SectionLabel>
                <OptionContainer>
                  {fields.map((field, idx) => (
                    <OptionItem key={field.id}>
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
                      <ButtonGroup>
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
                          disabled={idx === 0}
                        >
                          ▲
                        </SmallButton>
                        <SmallButton
                          type="button"
                          onClick={() =>
                            idx < fields.length - 1 && swap(idx, idx + 1)
                          }
                          disabled={idx === fields.length - 1}
                        >
                          ▼
                        </SmallButton>
                      </ButtonGroup>
                    </OptionItem>
                  ))}
                </OptionContainer>
                <AddOptionButton
                  type="button"
                  onClick={() => append({ content: "" })}
                >
                  + 옵션 추가
                </AddOptionButton>
              </div>
            </FormContent>

            <Modal.Actions direction="column">
              <PrimaryButton type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "생성 중..." : "투표 생성"}
              </PrimaryButton>
            </Modal.Actions>
          </form>
        ) : (
          <EditContent>
            {createdPoll && (
              <>
                <div>
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
                </div>

                <div>
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
                </div>

                <div>
                  <SectionLabel>옵션</SectionLabel>
                  <OptionContainer>
                    {(createdPoll.options ?? []).map((opt) => (
                      <OptionItem key={opt.id}>
                        <OptionIndex>#{opt.optionOrder}</OptionIndex>
                        <Input $width="100%">
                          <Input.Field
                            $isValidate={true}
                            defaultValue={opt.content}
                            onChange={(e) =>
                              setCreatedPoll((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      options: prev.options.map((o) =>
                                        o.id === opt.id
                                          ? {
                                              ...o,
                                              content: e.target.value,
                                            }
                                          : o,
                                      ),
                                    }
                                  : prev,
                              )
                            }
                          />
                        </Input>
                        <SmallButton
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
                      </OptionItem>
                    ))}
                  </OptionContainer>
                </div>
              </>
            )}

            <Modal.Actions direction="column">
              <PrimaryButton
                onClick={() =>
                  createdPoll &&
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
              </PrimaryButton>
              <PrimaryButton
                onClick={handleCreateComplete}
                style={{ backgroundColor: "#6b7280" }}
              >
                완료
              </PrimaryButton>
            </Modal.Actions>
          </EditContent>
        )}
      </Modal.Layout>
    </Modal>
  );
};

const ModalHeader = styled.div`
  margin-bottom: 16px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #111827;
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
`;

const EditContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
  max-height: 50vh;
  overflow-y: auto;
`;
