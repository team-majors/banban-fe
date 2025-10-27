/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import {
  AdminContainer,
  AdminPageHeader,
  AdminCard,
  AdminCardTitle,
  SmallButton,
} from "@/components/admin/AdminUI";
import { Input } from "@/components/common/Input";
import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "@/remote/admin";
import type { AdminUsersData, UserRole, UserStatus } from "@/types/admin";
import { useToast } from "@/components/common/Toast/useToast";

const selectClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200";
const tableHeaderClass =
  "px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";
const tableCellClass = "px-4 py-2 text-sm text-slate-700";
const badgeClass =
  "inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700";

const DEFAULT_LIMIT = 20;

export default function AdminUsersPage() {
  const { showToast } = useToast();

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [role, setRole] = useState<UserRole | undefined>(undefined);
  const [status, setStatus] = useState<UserStatus | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const { data, isLoading, error, refetch } = useQuery<AdminUsersData>({
    queryKey: [
      "admin",
      "users",
      { offset, limit, role, status, search, includeDeleted },
    ],
    queryFn: () =>
      getAdminUsers({
        limit,
        offset,
        role,
        status,
        search: search || undefined,
        include_deleted: includeDeleted,
      }),
  });

  const total = data?.data?.total ?? 0;
  const users = data?.data?.users ?? [];
  const hasNext = offset + limit < total;
  const hasPrev = offset > 0;

  const handleSearch = () => {
    if (search.trim().length === 0) {
      showToast({
        type: "info",
        message: "검색어는 최소 1글자 이상이어야 합니다.",
        duration: 2000,
      });
      return;
    }
    setOffset(0);
    refetch();
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleString();
    } catch {
      return date;
    }
  };

  const getRoleColor = (role: UserRole) => {
    return role === "ADMIN" ? "bg-purple-100 text-purple-700" : badgeClass;
  };

  const getStatusColor = (status: UserStatus) => {
    return status === "ACTIVE"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  };

  return (
    <RequireAuth>
      <AdminContainer>
        <AdminPageHeader>관리자 · 사용자 관리</AdminPageHeader>

        <AdminCard>
          <AdminCardTitle>필터 및 검색</AdminCardTitle>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col text-sm text-slate-600">
              <label
                className="text-xs font-semibold text-slate-500"
                htmlFor="role"
              >
                역할
              </label>
              <select
                id="role"
                className={selectClass}
                value={role ?? ""}
                onChange={(e) => {
                  setOffset(0);
                  setRole(
                    (e.target.value || undefined) as UserRole | undefined
                  );
                }}
              >
                <option value="">(모두)</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div className="flex flex-col text-sm text-slate-600">
              <label
                className="text-xs font-semibold text-slate-500"
                htmlFor="status"
              >
                상태
              </label>
              <select
                id="status"
                className={selectClass}
                value={status ?? ""}
                onChange={(e) => {
                  setOffset(0);
                  setStatus(
                    (e.target.value || undefined) as UserStatus | undefined
                  );
                }}
              >
                <option value="">(모두)</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <Input $width="240px">
              <Input.Label>검색 (email/username)</Input.Label>
              <Input.Field
                $isValidate={true}
                type="text"
                placeholder="최소 1글자"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Input>

            <div className="flex flex-col text-sm text-slate-600">
              <label
                className="text-xs font-semibold text-slate-500"
                htmlFor="size"
              >
                페이지당 수
              </label>
              <select
                id="size"
                className={selectClass}
                value={limit}
                onChange={(e) => {
                  setOffset(0);
                  setLimit(Number(e.target.value));
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeDeleted}
                onChange={(e) => {
                  setOffset(0);
                  setIncludeDeleted(e.target.checked);
                }}
              />
              <span className="text-slate-600">삭제된 사용자 포함</span>
            </label>

            <SmallButton onClick={handleSearch}>검색</SmallButton>
          </div>
        </AdminCard>

        <AdminCard>
          <AdminCardTitle>사용자 목록</AdminCardTitle>
          {isLoading && <p className="text-sm text-slate-500">로딩 중...</p>}
          {error && (
            <p className="text-sm text-red-600">{(error as Error).message}</p>
          )}
          {!isLoading && !error && (
            <>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className={tableHeaderClass}>ID</th>
                      <th className={tableHeaderClass}>Email</th>
                      <th className={tableHeaderClass}>Username</th>
                      <th className={tableHeaderClass}>역할</th>
                      <th className={tableHeaderClass}>상태</th>
                      <th className={tableHeaderClass}>가입일</th>
                      <th className={tableHeaderClass}>삭제 여부</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white/95">
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-6 text-center text-sm text-slate-500"
                        >
                          데이터가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user.id}
                          className={`hover:bg-slate-50/70 ${
                            user.isDeleted ? "opacity-50" : ""
                          }`}
                        >
                          <td className={tableCellClass}>{user.id}</td>
                          <td className={tableCellClass}>{user.email}</td>
                          <td className={tableCellClass}>{user.username}</td>
                          <td className={tableCellClass}>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleColor(
                                user.role,
                              )}`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className={tableCellClass}>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                                user.status,
                              )}`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                            {formatDate(user.createdAt)}
                          </td>
                          <td className={tableCellClass}>
                            {user.isDeleted ? (
                              <span className="text-xs text-red-600 font-semibold">
                                삭제됨 ({formatDate(user.deletedAt || "")})
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  총 {total}명 중 {offset + 1}–{Math.min(offset + limit, total)}
                </div>
                <div className="flex gap-2">
                  <SmallButton
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                    disabled={!hasPrev}
                  >
                    이전
                  </SmallButton>
                  <SmallButton
                    onClick={() => setOffset(offset + limit)}
                    disabled={!hasNext}
                  >
                    다음
                  </SmallButton>
                </div>
              </div>
            </>
          )}
        </AdminCard>
      </AdminContainer>
    </RequireAuth>
  );
}
