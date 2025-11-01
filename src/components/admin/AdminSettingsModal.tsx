"use client";

import { useState, ReactNode } from "react";
import styled from "styled-components";
import { Modal } from "@/components/common/Modal";
import { SystemTab } from "./tabs/SystemTab";
import { ReportsTab } from "./tabs/ReportsTab";
import { PollsTab } from "./tabs/PollsTab";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { ActivityLogsTab } from "./tabs/ActivityLogsTab";
import { UsersTab } from "./tabs/UsersTab";

interface AdminTab {
  id: string;
  label: string;
  component: ReactNode;
}

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSettingsModal = ({ isOpen, onClose }: AdminSettingsModalProps) => {
  const [activeTabId, setActiveTabId] = useState("system");

  const tabs: AdminTab[] = [
    {
      id: "system",
      label: "시스템",
      component: <SystemTab />,
    },
    {
      id: "reports",
      label: "신고 관리",
      component: <ReportsTab />,
    },
    {
      id: "polls",
      label: "투표 관리",
      component: <PollsTab />,
    },
    {
      id: "notifications",
      label: "알림 관리",
      component: <NotificationsTab />,
    },
    {
      id: "activity-logs",
      label: "활동 로그",
      component: <ActivityLogsTab />,
    },
    {
      id: "users",
      label: "사용자 관리",
      component: <UsersTab />,
    },
  ];

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCloseButton={true} width="1000px">
      <Modal.Layout>
        <ModalHeader>
          <ModalTitle>관리자 설정</ModalTitle>
        </ModalHeader>

        <ModalContainer>
          <TabNavigation>
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                $isActive={tab.id === activeTabId}
                onClick={() => setActiveTabId(tab.id)}
              >
                {tab.label}
              </TabButton>
            ))}
          </TabNavigation>

          <TabContent>{activeTab.component}</TabContent>
        </ModalContainer>
      </Modal.Layout>
    </Modal>
  );
};


const ModalHeader = styled.div`
  margin-bottom: 16px;
`;

const ModalTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #181d27;
`;

const ModalContainer = styled.div`
  display: flex;
  gap: 16px;
  height: 60vh;
  min-height: 400px;
`;

const TabNavigation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 160px;
  padding: 8px;
  background-color: #f9fafb;
  border-radius: 8px;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  padding: 10px 12px;
  border: 1px solid ${({ $isActive }) => ($isActive ? "#e5e7eb" : "transparent")};
  border-radius: 6px;
  background-color: ${({ $isActive }) => ($isActive ? "#ffffff" : "transparent")};
  color: ${({ $isActive }) => ($isActive ? "#181d27" : "#6b7280")};
  font-size: 14px;
  font-weight: ${({ $isActive }) => ($isActive ? "500" : "400")};
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  white-space: nowrap;

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? "#ffffff" : "#f3f4f6")};
    color: #181d27;
  }
`;

const TabContent = styled.div`
  flex: 1;
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow-y: auto;
`;
