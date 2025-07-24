import { Feed } from "@/types/feeds";

export const mockFeeds: Feed[] = Array.from({ length: 32 }, (_, i): Feed => {
  const id = i + 1;
  const isAdminFeed = id % 20 === 0;

  return {
    id: id,
    type: isAdminFeed ? "ADMIN" : "USER",
    user: {
      userId: id + 100,
      username: `User${id}`,
      profileImage: `https://picsum.photos/200/200?random=${id}`,
    },
    content: `This is a mock feed content number ${id}. It's designed to test the UI and data fetching.`,
    adUrl: isAdminFeed ? `https://picsum.photos/600/400?random=${id}` : null,
    adMeta: isAdminFeed ? `This is an ad meta for feed ${id}` : null,
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
    ),
    likeCount: Math.floor(Math.random() * 1000),
    commentCount: Math.floor(Math.random() * 200),
    isLiked: Math.random() > 0.5,
    isMine: Math.random() > 0.8,
  };
});