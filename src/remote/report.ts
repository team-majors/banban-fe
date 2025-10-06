import { apiFetch } from "@/lib/apiFetch";

export interface ReportRequest {
  targetType: string;
  targetId: number;
  reasonCode: string;
  reasonDetail: string;
}

export const postReport = async ({
  targetType,
  targetId,
  reasonCode,
  reasonDetail,
}: ReportRequest) => {
  return apiFetch("/reports/", {
    method: "POST",
    body: JSON.stringify({
      target_type: targetType,
      target_id: targetId,
      reason_code: reasonCode,
      reason_detail: reasonDetail.trim() || null,
    }),
  });
};
