import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProfileImage } from "@/remote/user";
import { useAuthStore } from "@/store/useAuthStore";

export const useDeleteProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfileImage,
    onSuccess: async () => {
      // Zustand 스토어에서 사용자 정보 최신화
      await useAuthStore.getState().checkAuth({ silent: true });

      // React Query 캐시 무효화 (추가 캐시 레이어 지원용)
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};
