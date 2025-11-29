"use client";

import { useState } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/common/Modal";
import { getAdminAIBotActivityLog } from "@/remote/admin";
import type { AdminAIBot, AIBotActivityLogsData } from "@/types/admin";

interface AIBotActivityLogModalProps {
  bot: AdminAIBot;
  onClose: () => void;
}

const LogContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`;

const LogItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: start;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8fafc;
  }
`;

const LogType = styled.span`
  font-weight: 600;
  font-size: 12px;
  color: #475569;
  background-color: #e2e8f0;
  padding: 4px 8px;
  border-radius: 4px;
  min-width: 80px;
  text-align: center;
`;

const LogContent = styled.div`
  flex: 1;
  margin-left: 12px;
`;

const LogDescription = styled.p`
  font-size: 13px;
  color: #334155;
  margin-bottom: 4px;
`;

const LogTime = styled.p`
  font-size: 11px;
  color: #94a3b8;
`;

export const AIBotActivityLogModal = ({
  bot,
  onClose,
}: AIBotActivityLogModalProps) => {
  const [limit] = useState(20);

  const { data, isLoading, error } = useQuery<AIBotActivityLogsData>({
    queryKey: ["admin", "ai-bots", bot.id, "activity-log"],
    queryFn: () =>
      getAdminAIBotActivityLog(bot.id, {
        limit,
        offset: 0,
      }),
  });

  const logs = data?.logs ?? [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR");
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      width="600px"
    >
      <Modal.Header>
        <Modal.Title>AI 봇 활동 로그</Modal.Title>
        <Modal.Description>
          "{bot.name}" 봇의 활동 이력을 확인합니다.
        </Modal.Description>
      </Modal.Header>
      <Modal.Body>
        {isLoading && (
          <p style={{ textAlign: "center", color: "#94a3b8" }}>로딩 중...</p>
        )}
        {error && (
          <p style={{ textAlign: "center", color: "#dc2626" }}>
            {(error as Error).message}
          </p>
        )}
        {!isLoading && !error && logs.length === 0 && (
          <p style={{ textAlign: "center", color: "#94a3b8" }}>
            활동 로그가 없습니다.
          </p>
        )}
        {!isLoading && !error && logs.length > 0 && (
          <LogContainer>
            {logs.map((log) => (
              <LogItem key={log.id}>
                <LogType>{log.activityType}</LogType>
                <LogContent>
                  <LogDescription>{log.description}</LogDescription>
                  <LogTime>{formatDate(log.createdAt)}</LogTime>
                </LogContent>
              </LogItem>
            ))}
          </LogContainer>
        )}
        {!isLoading && !error && logs.length > 0 && (
          <div style={{ marginTop: "12px", fontSize: "12px", color: "#94a3b8" }}>
            총 {data?.total ?? 0}개 항목 (최근 {logs.length}개 표시)
          </div>
        )}
      </Modal.Body>
      <Modal.Actions direction="row" align="end">
        <Modal.Button $variant="secondary" onClick={onClose}>
          닫기
        </Modal.Button>
      </Modal.Actions>
    </Modal>
  );
};

export default AIBotActivityLogModal;
