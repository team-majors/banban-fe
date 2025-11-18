import { useToast } from "@/components/common/Toast/useToast";
import { postReport, ReportRequest } from "@/remote/report";
import { useMutation } from "@tanstack/react-query";

const useReportMutation = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: (data: ReportRequest) => postReport(data),
    onSuccess: () => {
      toast.showToast({
        type: "info",
        message: "신고 완료 🚨 빠르게 확인 후 다시 안내드릴게요.",
        duration: 3000,
      });
    },
    onError: ({ message }) => {
      toast.showToast({ type: "error", message: message, duration: 3000 });
    },
  });
};

export default useReportMutation;
