"use client";

import styled from "styled-components";
import { DefaultButton } from "@/components/common/Button";

export const AdminContainer = styled.main`
  margin: 0 auto;
  max-width: 960px;
  padding: 12px 16px 60px; /* match Sidebar inner padding for top alignment */
`;

export const AdminPageHeader = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 16px 0; /* reset default top margin */
`;

export const AdminCard = styled.section`
  background: #ffffff;
  border: 1px solid #e9eaeb;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(10, 13, 18, 0.05);
  padding: 16px;
  margin-bottom: 16px;
`;

export const AdminCardTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0; /* reset default top margin */
`;

export const SectionLabel = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #374151;
`;

export const SmallButton = styled(DefaultButton)`
  padding: 4px 10px;
  font-size: 12px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
`;

export const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 220px;
`;

export const MetaLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

export const MetaValue = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

export const OptionIndex = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d5d7da;
  border-radius: 6px;
  font-size: 12px;
  color: #6b7280;
`;
