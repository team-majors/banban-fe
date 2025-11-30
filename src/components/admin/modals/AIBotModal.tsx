"use client";

import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { useToast } from "@/components/common/Toast/useToast";
import {
  createAdminAIBot,
  updateAdminAIBot,
  generateAdminAIBotPersona,
} from "@/remote/admin";
import type {
  AdminAIBot,
  CreateAIBotPayload,
  UpdateAIBotPayload,
  GeneratePersonaResponse,
} from "@/types/admin";

interface AIBotModalProps {
  bot?: AdminAIBot;
  onClose: () => void;
  onSuccess: () => void;
}

interface AIBotForm {
  name: string;
  personaPrompt: string;
  feedIntervalMinutes: number;
  commentIntervalMinutes: number;
}

const PersonaLabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const GenerateButton = styled.button`
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #d5d7da;
  background-color: #ffffff;
  color: #111827;
  cursor: pointer;
  transition: background-color 0.18s ease;
  font-weight: 600;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: #f3f4f6;
  }

  &:disabled {
    background-color: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const AIBotModal = ({
  bot,
  onClose,
  onSuccess,
}: AIBotModalProps) => {
  const { showToast } = useToast();
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AIBotForm>({
    defaultValues: {
      name: bot?.name ?? "",
      personaPrompt: bot?.personaPrompt ?? "",
      feedIntervalMinutes: bot?.feedIntervalMinutes ?? 15,
      commentIntervalMinutes: bot?.commentIntervalMinutes ?? 10,
    },
    mode: "onBlur",
  });

  const botName = watch("name");

  const createMutation = useMutation({
    mutationFn: (payload: CreateAIBotPayload) =>
      createAdminAIBot(payload),
    onSuccess: () => {
      showToast({ type: "success", message: "AI 봇이 생성되었습니다." });
      qc.invalidateQueries({ queryKey: ["admin", "ai-bots"] });
      onSuccess();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "생성 실패";
      showToast({ type: "error", message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateAIBotPayload) =>
      updateAdminAIBot(bot!.id, payload),
    onSuccess: () => {
      showToast({ type: "success", message: "AI 봇이 수정되었습니다." });
      qc.invalidateQueries({ queryKey: ["admin", "ai-bots"] });
      onSuccess();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "수정 실패";
      showToast({ type: "error", message });
    },
  });

  const generatePersonaMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!name.trim()) {
        throw new Error("봇 이름을 입력해주세요.");
      }
      return generateAdminAIBotPersona(name);
    },
    onSuccess: (data: GeneratePersonaResponse) => {
      setValue("personaPrompt", data.personaPrompt);
      showToast({
        type: "success",
        message: "페르소나 프롬프트가 생성되었습니다.",
      });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "페르소나 생성 실패";
      showToast({ type: "error", message });
    },
  });

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    generatePersonaMutation.isPending;

  const onSubmit = (data: AIBotForm) => {
    if (bot) {
      updateMutation.mutate({
        name: data.name,
        personaPrompt: data.personaPrompt,
        feedIntervalMinutes: data.feedIntervalMinutes,
        commentIntervalMinutes: data.commentIntervalMinutes,
      });
    } else {
      createMutation.mutate({
        name: data.name,
        personaPrompt: data.personaPrompt,
        feedIntervalMinutes: data.feedIntervalMinutes,
        commentIntervalMinutes: data.commentIntervalMinutes,
      });
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      width="600px"
    >
      <Modal.Header>
        <Modal.Title>{bot ? "AI 봇 수정" : "AI 봇 생성"}</Modal.Title>
        <Modal.Description>
          {bot
            ? "AI 봇의 정보를 수정합니다."
            : "새로운 AI 봇을 생성합니다."}
        </Modal.Description>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input $width="100%">
            <Input.Label>봇 이름 *</Input.Label>
            <Input.Field
              $isValidate={!errors.name}
              type="text"
              placeholder="예: ChatBot Pro"
              {...register("name", {
                required: "봇 이름은 필수입니다.",
                minLength: {
                  value: 1,
                  message: "최소 1자 이상 입력해주세요.",
                },
                maxLength: {
                  value: 100,
                  message: "최대 100자까지 입력 가능합니다.",
                },
              })}
            />
            {errors.name && (
              <Input.ErrorMessage>{errors.name.message}</Input.ErrorMessage>
            )}
          </Input>

          <Input $width="100%">
            <PersonaLabelContainer>
              <Input.Label>페르소나 프롬프트 *</Input.Label>
              <GenerateButton
                type="button"
                onClick={() => {
                  if (botName.trim()) {
                    generatePersonaMutation.mutate(botName);
                  }
                }}
                disabled={
                  !botName.trim() ||
                  generatePersonaMutation.isPending ||
                  isLoading
                }
              >
                {generatePersonaMutation.isPending
                  ? "생성 중..."
                  : "페르소나 생성"}
              </GenerateButton>
            </PersonaLabelContainer>
            <textarea
              placeholder="AI 봇의 성격과 스타일을 정의하는 프롬프트"
              {...register("personaPrompt", {
                required: "페르소나 프롬프트는 필수입니다.",
                minLength: {
                  value: 10,
                  message: "최소 10자 이상 입력해주세요.",
                },
              })}
              style={{
                width: "100%",
                minHeight: "120px",
                padding: "10px",
                border: errors.personaPrompt ? "1px solid #ef4444" : "1px solid #cbd5e1",
                borderRadius: "8px",
                fontFamily: "inherit",
                fontSize: "14px",
              }}
            />
            {errors.personaPrompt && (
              <Input.ErrorMessage>
                {errors.personaPrompt.message}
              </Input.ErrorMessage>
            )}
          </Input>

          <Input $width="100%">
            <Input.Label>피드 생성 주기 (분) *</Input.Label>
            <Input.Field
              $isValidate={!errors.feedIntervalMinutes}
              type="number"
              placeholder="15"
              min="1"
              max="1440"
              {...register("feedIntervalMinutes", {
                required: "피드 생성 주기는 필수입니다.",
                min: {
                  value: 1,
                  message: "최소 1분 이상이어야 합니다.",
                },
                max: {
                  value: 1440,
                  message: "최대 1440분(24시간) 이하여야 합니다.",
                },
              })}
            />
            {errors.feedIntervalMinutes && (
              <Input.ErrorMessage>
                {errors.feedIntervalMinutes.message}
              </Input.ErrorMessage>
            )}
          </Input>

          <Input $width="100%">
            <Input.Label>댓글 생성 주기 (분) *</Input.Label>
            <Input.Field
              $isValidate={!errors.commentIntervalMinutes}
              type="number"
              placeholder="10"
              min="1"
              max="1440"
              {...register("commentIntervalMinutes", {
                required: "댓글 생성 주기는 필수입니다.",
                min: {
                  value: 1,
                  message: "최소 1분 이상이어야 합니다.",
                },
                max: {
                  value: 1440,
                  message: "최대 1440분(24시간) 이하여야 합니다.",
                },
              })}
            />
            {errors.commentIntervalMinutes && (
              <Input.ErrorMessage>
                {errors.commentIntervalMinutes.message}
              </Input.ErrorMessage>
            )}
          </Input>
        </form>
      </Modal.Body>
      <Modal.Actions direction="row" align="end">
        <Modal.Button
          $variant="secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          취소
        </Modal.Button>
        <Modal.Button
          $variant="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading
            ? bot
              ? "수정 중..."
              : "생성 중..."
            : bot
              ? "수정"
              : "생성"}
        </Modal.Button>
      </Modal.Actions>
    </Modal>
  );
};

export default AIBotModal;
