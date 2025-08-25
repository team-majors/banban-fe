/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiFetch } from "@/lib/apiFetch";
import { BanbanResponse } from "@/types/api";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

type VoteContext<T = any> = {
  previousSelectOption: T | undefined;
};

const fetchVote = async ({ id }: { id: number }): Promise<BanbanResponse> => {
  const res: BanbanResponse = await apiFetch("/polls/votes", {
    method: "POST",
    body: JSON.stringify({ poll_option_id: id }),
  });
  return res;
};

export const useVote = <TData = any>(
  options?: UseMutationOptions<
    BanbanResponse,
    Error,
    { id: number },
    VoteContext<TData>
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchVote,
    onMutate: async (): Promise<VoteContext<TData>> => {
      await queryClient.cancelQueries({ queryKey: ["polls"] });

      // 제네릭 타입으로 데이터 가져오기
      const previousData = queryClient.getQueryData<TData>(["polls"]);

      return {
        previousSelectOption: previousData,
      };
    },
    onError: (error, variables, context) => {
      if (context?.previousSelectOption) {
        queryClient.setQueryData<TData>(
          ["polls"],
          context.previousSelectOption,
        );
      }
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};
