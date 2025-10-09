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
import styled from "styled-components";
import { useMutation } from "@tanstack/react-query";
import { postAdminNotification } from "@/remote/admin";
import type { AdminNotification, NotificationTargetType, NotificationType } from "@/types/admin";
import { useState } from "react";

interface NotificationForm {
  userId: number;
  type: NotificationType;
  fromUserId?: number | null;
  targetType: NotificationTargetType;
  targetId: number;
  message?: string;
}

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
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Input $width="200px">
                <Input.Label>User ID</Input.Label>
                <Input.Field
                  $isValidate={!errors.userId}
                  type="number"
                  placeholder="123"
                  {...register("userId", { required: true, min: 1 })}
                />
                {errors.userId && <Input.ErrorMessage>필수 입력</Input.ErrorMessage>}
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
            </Row>

            <Row>
              <div>
                <SectionLabel>Type</SectionLabel>
                <Select {...register("type", { required: true })}>
                  <option value="SYSTEM">SYSTEM</option>
                </Select>
              </div>
              <div>
                <SectionLabel>Target Type</SectionLabel>
                <Select {...register("targetType", { required: true })}>
                  <option value="FEED">FEED</option>
                  <option value="COMMENT">COMMENT</option>
                  <option value="POLL">POLL</option>
                  <option value="USER">USER</option>
                </Select>
              </div>
              <Input $width="200px">
                <Input.Label>Target ID</Input.Label>
                <Input.Field
                  $isValidate={!errors.targetId}
                  type="number"
                  placeholder="456"
                  {...register("targetId", { required: true, min: 1 })}
                />
                {errors.targetId && <Input.ErrorMessage>필수 입력</Input.ErrorMessage>}
              </Input>
            </Row>

            <Row>
              <Input $width="100%">
                <Input.Label>Message</Input.Label>
                <Input.Field
                  $isValidate={true}
                  placeholder="(선택) 255자 이내"
                  maxLength={255}
                  {...register("message")}
                />
              </Input>
            </Row>

            <Actions>
              <SmallButton as="button" type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "발송 중..." : "발송"}
              </SmallButton>
            </Actions>
          </Form>
        </AdminCard>

        <AdminCard>
          <AdminCardTitle>최근 발송 (로컬)</AdminCardTitle>
          {sent.length === 0 ? (
            <p>발송 내역이 없습니다.</p>
          ) : (
            <table style={{ width: "100%", fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#6b7280" }}>
                  <th style={{ padding: 8 }}>ID</th>
                  <th style={{ padding: 8 }}>User</th>
                  <th style={{ padding: 8 }}>Type</th>
                  <th style={{ padding: 8 }}>Target</th>
                  <th style={{ padding: 8 }}>Message</th>
                  <th style={{ padding: 8 }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {sent.map((n) => (
                  <tr key={n.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td style={{ padding: 8 }}>{n.id}</td>
                    <td style={{ padding: 8 }}>{n.userId}</td>
                    <td style={{ padding: 8 }}>{n.type}</td>
                    <td style={{ padding: 8 }}>
                      {n.targetType} #{n.targetId}
                    </td>
                    <td style={{ padding: 8 }}>{n.message ?? ""}</td>
                    <td style={{ padding: 8 }}>{n.createdAt ? new Date(n.createdAt).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminCard>
      </AdminContainer>
    </RequireAuth>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  align-items: end;
  flex-wrap: wrap;
`;

const Select = styled.select`
  display: block;
  border: 1px solid #d5d7da;
  border-radius: 6px;
  padding: 8px 10px;
`;
