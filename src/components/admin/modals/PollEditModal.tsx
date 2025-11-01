"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { useToast } from "@/components/common/Toast/useToast";
import {
  updateAdminPoll,
  updateAdminPollOption,
} from "@/remote/admin";
import { fetchPoll } from "@/remote/poll";
import type { Poll, PollOption } from "@/types/poll";

interface PollEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  pollId: number;
  pollDate: string;
}

const SectionLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 12px;
`;

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
`;

const OptionItem = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: 40px 1fr auto;
  align-items: center;
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
  white-space: nowrap;

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
  width: 100%;

  &:hover:not(:disabled) {
    background-color: #111827;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const VoteCountText = styled.p`
  font-size: 12px;
  color: #64748b;
  margin: 8px 0 0 0;
`;

export const PollEditModal = ({
  isOpen,
  onClose,
  pollId,
  pollDate,
}: PollEditModalProps) => {
  const { showToast } = useToast();
  const [localPoll, setLocalPoll] = useState<Poll | null>(null);

  const {
    data: poll,
    isLoading,
    error,
  } = useQuery<Poll>({
    queryKey: ["admin", "poll", pollId, pollDate],
    queryFn: () => fetchPoll(pollDate),
    enabled: isOpen && !!pollDate && Number.isFinite(pollId),
  });

  useEffect(() => {
    if (poll) {
      setLocalPoll(poll);
    }
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
      showToast({ type: "success", message: "옵션이 저장되었습니다." });
    },
    onError: (e: unknown) => {
      const m = e instanceof Error ? e.message : "옵션 저장 실패";
      showToast({ type: "error", message: m });
    },
  });

  const handleClose = () => {
    setLocalPoll(null);
    onClose();
  };

  const options = localPoll?.options ?? [];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width="600px">
      <Modal.Layout>
        <ModalHeader>
          <ModalTitle>투표 수정</ModalTitle>
        </ModalHeader>

        {isLoading && (
          <LoadingText>로딩 중...</LoadingText>
        )}

        {error && !isLoading && (
          <ErrorText>{(error as Error).message}</ErrorText>
        )}

        {!isLoading && !error && localPoll && (
          <EditContent>
            <div>
              <SectionLabel>메타데이터</SectionLabel>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <Input $width="100%">
                  <Input.Label>제목</Input.Label>
                  <Input.Field
                    $isValidate={true}
                    defaultValue={localPoll.title}
                    onChange={(e) =>
                      setLocalPoll({ ...localPoll, title: e.target.value })
                    }
                  />
                </Input>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <Input $width="260px">
                  <Input.Label>투표 날짜</Input.Label>
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
                  style={{ height: "fit-content", marginTop: "24px" }}
                >
                  {saveMeta.isPending ? "저장 중..." : "저장"}
                </SmallButton>
              </div>
            </div>

            <div>
              <SectionLabel>옵션</SectionLabel>
              <OptionContainer>
                {options.map((opt, idx) => (
                  <div key={opt.id}>
                    <OptionItem>
                      <OptionIndex>#{opt.optionOrder}</OptionIndex>
                      <Input $width="100%">
                        <Input.Field
                          $isValidate={true}
                          defaultValue={opt.content}
                          onChange={(e) => {
                            const copy = [...options];
                            copy[idx] = { ...opt, content: e.target.value };
                            setLocalPoll({
                              ...localPoll,
                              options: copy,
                            });
                          }}
                        />
                      </Input>
                      <SmallButton
                        onClick={() => saveOption.mutate(options[idx])}
                        disabled={saveOption.isPending}
                      >
                        {saveOption.isPending ? "저장중" : "저장"}
                      </SmallButton>
                    </OptionItem>
                    <VoteCountText>투표 수: {opt.voteCount ?? 0}</VoteCountText>
                  </div>
                ))}
              </OptionContainer>
            </div>
          </EditContent>
        )}

        <Modal.Actions direction="column">
          <PrimaryButton onClick={handleClose}>닫기</PrimaryButton>
        </Modal.Actions>
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

const EditContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
  max-height: 50vh;
  overflow-y: auto;
`;

const LoadingText = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 16px 0;
`;

const ErrorText = styled.p`
  font-size: 14px;
  color: #dc2626;
  margin: 16px 0;
`;
