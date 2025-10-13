/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import RequireAuth from "@/components/auth/RequireAuth";
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
import { useToast } from "@/components/common/Toast/useToast";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { postAdminNotification } from "@/remote/admin";
import type {
  AdminNotification,
  NotificationTargetType,
  NotificationType,
} from "@/types/admin";
import { useState } from "react";

interface NotificationForm {
  userId: number;
  type: NotificationType;
  fromUserId?: number | null;
  targetType: NotificationTargetType;
  targetId: number;
  message?: string;
}

const selectClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200";
const tableHeaderClass =
  "px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";
const tableCellClass = "px-4 py-2 text-sm text-slate-700";

export default function AdminNotificationsPage() {
  const { showToast } = useToast();
  const [sent, setSent] = useState<AdminNotification[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NotificationForm>({
    defaultValues: {
      type: "SYSTEM",
      targetType: "FEED",
    } as any,
  });

  const mutation = useMutation({
    mutationFn: postAdminNotification,
    onSuccess: (data) => {
      setSent((prev) => [data, ...prev].slice(0, 8));
      showToast({ type: "success", message: "알림을 발송했습니다." });
      reset({ type: "SYSTEM", targetType: "FEED" } as any);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "발송 실패";
      showToast({ type: "error", message: msg });
    },
  });

  const onSubmit = (v: NotificationForm) => {
    mutation.mutate({
      userId: Number(v.userId),
      type: v.type,
      fromUserId: v.fromUserId ? Number(v.fromUserId) : null,
      targetType: v.targetType,
      targetId: Number(v.targetId),
      message: v.message?.trim() || undefined,
    });
  };

  return (
    <RequireAuth>
      <AdminContainer>
        <AdminPageHeader>관리자 · 알림 관리</AdminPageHeader>

        <AdminCard>
          <AdminCardTitle>알림 발송</AdminCardTitle>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-wrap items-end gap-3">
              <Input $width="200px">
                <Input.Label>User ID</Input.Label>
                <Input.Field
                  $isValidate={!errors.userId}
                  type="number"
                  placeholder="123"
                  {...register("userId", { required: true, min: 1 })}
                />
                {errors.userId && (
                  <Input.ErrorMessage>필수 입력</Input.ErrorMessage>
                )}
              </Input>
              <Input $width="200px">
                <Input.Label>From User ID</Input.Label>
                <Input.Field
                  $isValidate={true}
                  type="number"
                  placeholder="(optional)"
                  {...register("fromUserId")}
                />
              </Input>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col text-sm text-slate-600">
                <SectionLabel className="text-xs text-slate-500">
                  Type
                </SectionLabel>
                <select
                  className={selectClass}
                  {...register("type", { required: true })}
                >
                  <option value="SYSTEM">SYSTEM</option>
                </select>
              </div>
              <div className="flex flex-col text-sm text-slate-600">
                <SectionLabel className="text-xs text-slate-500">
                  Target Type
                </SectionLabel>
                <select
                  className={selectClass}
                  {...register("targetType", { required: true })}
                >
                  <option value="FEED">FEED</option>
                  <option value="COMMENT">COMMENT</option>
                  <option value="POLL">POLL</option>
                  <option value="USER">USER</option>
                </select>
              </div>
              <Input $width="200px">
                <Input.Label>Target ID</Input.Label>
                <Input.Field
                  $isValidate={!errors.targetId}
                  type="number"
                  placeholder="456"
                  {...register("targetId", { required: true, min: 1 })}
                />
                {errors.targetId && (
                  <Input.ErrorMessage>필수 입력</Input.ErrorMessage>
                )}
              </Input>
            </div>

            <div className="flex flex-col">
              <Input $width="100%">
                <Input.Label>Message</Input.Label>
                <Input.Field
                  $isValidate={true}
                  placeholder="(선택) 255자 이내"
                  maxLength={255}
                  {...register("message")}
                />
              </Input>
            </div>

            <Actions className="justify-end">
              <SmallButton type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "발송 중..." : "발송"}
              </SmallButton>
            </Actions>
          </form>
        </AdminCard>

        <AdminCard>
          <AdminCardTitle>최근 발송 (로컬)</AdminCardTitle>
          {sent.length === 0 ? (
            <p className="text-sm text-slate-500">발송 내역이 없습니다.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className={tableHeaderClass}>ID</th>
                    <th className={tableHeaderClass}>User</th>
                    <th className={tableHeaderClass}>Type</th>
                    <th className={tableHeaderClass}>Target</th>
                    <th className={tableHeaderClass}>Message</th>
                    <th className={tableHeaderClass}>Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white/95">
                  {sent.map((n) => (
                    <tr key={n.id} className="hover:bg-slate-50/70">
                      <td className={tableCellClass}>{n.id}</td>
                      <td className={tableCellClass}>{n.userId}</td>
                      <td className={tableCellClass}>{n.type}</td>
                      <td className={tableCellClass}>
                        {n.targetType} #{n.targetId}
                      </td>
                      <td className={tableCellClass}>{n.message ?? ""}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>
                        {n.createdAt
                          ? new Date(n.createdAt).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>
      </AdminContainer>
    </RequireAuth>
  );
}
