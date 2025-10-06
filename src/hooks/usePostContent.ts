// import { useState, useCallback } from "react";
// import { useToast } from "../components/common/Toast/useToast";
// import { useQueryClient } from "@tanstack/react-query";
// import { apiFetch } from "../lib/apiFetch";

// interface CommentRequestBody {
//   feed_id: number;
//   content: string;
// }

// interface FeedRequestBody {
//   content: string;
// }

// export const usePostContent = () => {
//   const [isPosting, setIsPosting] = useState(false);
//   const { showToast } = useToast();
//   const queryClient = useQueryClient();

//   const postContent = useCallback(
//     async (content: string, actionType: string, feedId?: number) => {
//       if (!content.trim() || isPosting) return false;

//       setIsPosting(true);
//       try {
//         // actionType에 따라 다른 API 엔드포인트 사용
//         const endpoint = actionType === "댓글" ? "/comments/" : "/feeds/";

//         // request body 구성
//         let requestBody: CommentRequestBody | FeedRequestBody;

//         if (actionType === "댓글") {
//           if (feedId === undefined) {
//             throw new Error("댓글 등록 시 feedId가 필요합니다.");
//           }
//           requestBody = {
//             feed_id: feedId,
//             content: content.trim(),
//           };
//         } else {
//           requestBody = {
//             content: content.trim(),
//           };
//         }

//         await apiFetch(endpoint, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         });

//         showToast({
//           type: "success",
//           message: `${actionType}${
//             actionType === "댓글" ? "이" : "가"
//           } 성공적으로 등록되었습니다!`,
//           duration: 3000,
//         });

//         // actionType에 따라 다른 쿼리 무효화
//         const queryKey = actionType === "댓글" ? ["comments"] : ["feeds"];
//         queryClient.invalidateQueries({ queryKey });

//         return true;
//       } catch (error) {
//         console.error("Failed to post feed:", error);
//         showToast({
//           type: "error",
//           message: `${actionType} 등록에 실패했습니다. 다시 시도해주세요.`,
//           duration: 4000,
//         });
//         return false;
//       } finally {
//         setIsPosting(false);
//       }
//     },
//     [isPosting, showToast, queryClient],
//   );

//   return { isPosting, postContent };
// };

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../components/common/Toast/useToast";
import { apiFetch } from "../lib/apiFetch";

interface CommentRequestBody {
  feed_id: number;
  content: string;
}

interface FeedRequestBody {
  content: string;
}

type ActionType = "댓글" | "피드";

interface PostContentParams {
  actionType: ActionType;
  content: string;
  feedId?: number;
}

const postContent = async ({
  actionType,
  content,
  feedId,
}: PostContentParams) => {
  if (!content.trim()) throw new Error("내용이 비어있습니다.");

  const endpoint = actionType === "댓글" ? "/comments/" : "/feeds/";

  let requestBody: CommentRequestBody | FeedRequestBody;
  if (actionType === "댓글") {
    if (!feedId) throw new Error("댓글 등록 시 feedId가 필요합니다.");
    requestBody = { feed_id: feedId, content: content.trim() };
  } else {
    requestBody = { content: content.trim() };
  }

  return apiFetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
};

export const usePostContent = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postContent,
    onSuccess: (_, { actionType }) => {
      toast.showToast({
        type: "success",
        message: `${actionType}${
          actionType === "댓글" ? "이" : "가"
        } 성공적으로 등록되었습니다!`,
        duration: 3000,
      });

      const queryKey = actionType === "댓글" ? ["comments"] : ["feeds"];
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error, { actionType }) => {
      toast.showToast({
        type: "error",
        message: `${actionType} 등록에 실패했습니다. 다시 시도해주세요.`,
        duration: 4000,
      });
    },
  });
};
