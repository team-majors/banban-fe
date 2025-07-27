import type { MockReplyContent } from "../types/reply";

const mockReplies: MockReplyContent[] = (() => {
  const arr: MockReplyContent[] = [];

  const created_at = new Date(
    Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
  ).toISOString();

  for (let feedId = 1; feedId <= 107; feedId++) {
    for (let i = 0; i < 20; i++) {
      arr.push({
        id: feedId * 1000 + i,
        feed_id: feedId,
        content: `Feed ${feedId}의 댓글 ${i}번입니다.`,
        author: {
          user_id: 1000 + ((feedId + i) % 50),
          username: `User${((feedId + i) % 50) + 1}`,
          profile_image: `https://picsum.photos/200/200?random=${feedId + i}`,
        },
        created_at: created_at,
        updated_at: created_at,
        like_count: Math.floor(Math.random() * 100),
        is_liked: false,
        is_mine: false,
        mentioned_users: [
          {
            user_id: 1000 + ((feedId + i + 1) % 50),
            username: `User${((feedId + i + 1) % 50) + 1}`,
            profile_image: `https://picsum.photos/200/200?random=${
              feedId + i + 1
            }`,
          },
          {
            user_id: 1000 + ((feedId + i + 2) % 50),
            username: `User${((feedId + i + 2) % 50) + 1}`,
            profile_image: `https://picsum.photos/200/200?random=${
              feedId + i + 2
            }`,
          },
        ],
        user_vote_option_id:
          Math.random() > 0.5 ? null : Math.random() > 0.5 ? 1 : 2,
      });
    }
  }
  return arr;
})();

export { mockReplies };
