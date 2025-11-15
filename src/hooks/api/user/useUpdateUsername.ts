import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUsername } from "@/remote/user";

export const useUpdateUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUsername,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
