import { useToast } from "@/components/common/Toast/useToast"
import { apiFetch } from "@/lib/apiFetch"
import { useMutation } from "@tanstack/react-query"

interface useReportProps {
  targetType: string
  targetId: number
  reasonCode: string
  reasonDetail: string
}

const postReport = async ({ targetType, targetId, reasonCode, reasonDetail }: useReportProps) => {
  const body = JSON.stringify({
    target_type: targetType,
    target_id: targetId,
    reason_code: reasonCode,
    reason_detail: reasonDetail.trim() || null,
  })

  return apiFetch('/reports', {
    method: 'POST',
    body: body
  })
}

const useReport = ({ targetType, targetId, reasonCode, reasonDetail }: useReportProps) => {
  const toast = useToast();
  return useMutation({
    mutationFn: () => {
      return postReport({ targetType, targetId, reasonCode, reasonDetail })
    },
    onSuccess: () => {
      toast.showToast({ type: "info", message: "신고 완료 🚨 빠르게 확인 후 다시 안내드릴게요.", duration: 3000 });
    },
    onError: ({ message }) => {
      toast.showToast({ type: "error", message: message, duration: 3000 });
    }
  })
}

export default useReport;
