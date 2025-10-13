import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateProfileImage} from "@/remote/user";

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({file}: { file: File }) => updateProfileImage({file}),
    onSuccess: () => {
      // 프로필 정보 새로고침
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
    },
  });
};
