"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  AdminContainer,
  AdminPageHeader,
  AdminCard,
  AdminCardTitle,
  Actions,
  SmallButton,
  SectionLabel,
} from "@/components/admin/AdminUI";
import { Input } from "@/components/common/Input";
import { getAdminPolls, type AdminPollListParams } from "@/remote/admin";
import type { Poll } from "@/types/poll";
import { useToast } from "@/components/common/Toast/useToast";

export default function AdminPollListPage() {
  const { showToast } = useToast();
  const qc = useQueryClient();

  const [params, setParams] = useState<AdminPollListParams>({ page: 1, size: 20 });

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "polls", params],
    queryFn: () => getAdminPolls(params),
  });

  // 테스트 투표 비활성화 요구에 따라 제거

  const polls = data?.polls ?? [];
  const hasNext = data?.hasNext ?? false;

  return (
    <AdminContainer>
      <AdminPageHeader>관리자 · 투표 관리</AdminPageHeader>

      <AdminCard>
        <AdminCardTitle>목록</AdminCardTitle>
        <div style={{ display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <SectionLabel>페이지 크기</SectionLabel>
            <select
              value={params.size}
              onChange={(e) => setParams((p) => ({ ...p, page: 1, size: Number(e.target.value) }))}
              style={{ border: "1px solid #d5d7da", borderRadius: 6, padding: "8px 10px" }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Link href="/admin/polls/new" style={{ textDecoration: "none" }}>
              <SmallButton>➕ 새 투표</SmallButton>
            </Link>
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <AdminCardTitle>투표 목록</AdminCardTitle>
        {isLoading && <p>로딩 중...</p>}
        {error && <p style={{ color: "#dc2626" }}>{(error as Error).message}</p>}
        {!isLoading && !error && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ minWidth: "100%", fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#6b7280" }}>
                  <th style={{ padding: 8 }}>ID</th>
                  <th style={{ padding: 8 }}>제목</th>
                  <th style={{ padding: 8 }}>투표일</th>
                  <th style={{ padding: 8 }}>총 투표수</th>
                  <th style={{ padding: 8 }}>옵션 수</th>
                  <th style={{ padding: 8 }}>액션</th>
                </tr>
              </thead>
              <tbody>
                {polls.length === 0 ? (
                  <tr>
                    <td style={{ padding: 8 }} colSpan={6}>데이터가 없습니다.</td>
                  </tr>
                ) : (
                  polls.map((p: Poll) => (
                    <tr key={p.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                      <td style={{ padding: 8 }}>{p.id}</td>
                      <td style={{ padding: 8 }}>{p.title}</td>
                      <td style={{ padding: 8 }}>{p.pollDate}</td>
                      <td style={{ padding: 8 }}>{p.totalVotes ?? 0}</td>
                      <td style={{ padding: 8 }}>{p.options?.length ?? 0}</td>
                      <td style={{ padding: 8 }}>
                        <Actions>
                          <Link href={`/admin/polls/${p.id}?poll_date=${p.pollDate}`} style={{ textDecoration: "none" }}>
                            <SmallButton>수정</SmallButton>
                          </Link>
                        </Actions>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <SmallButton
            onClick={() => setParams((p) => ({ ...p, page: Math.max(1, (p.page || 1) - 1) }))}
            disabled={(params.page || 1) <= 1}
          >
            이전
          </SmallButton>
          <span>페이지 {params.page}</span>
          <SmallButton
            onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) + 1 }))}
            disabled={!hasNext}
          >
            다음
          </SmallButton>
        </div>
      </AdminCard>
    </AdminContainer>
  );
}
