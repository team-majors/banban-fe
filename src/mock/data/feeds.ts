import type { MockFeed } from "../types/feeds";

const mockFeeds: MockFeed[] = Array.from({ length: 106 }, (_, i): MockFeed => {
  const id = i + 1;
  const isAdFeed = id % 20 === 0;
  const isPollFeed = id % 5 === 0 && !isAdFeed;

  return {
    feed_id: id,
    type: isAdFeed ? "AD" : isPollFeed ? "POLL" : "NORMAL",
    author: {
      user_id: id + 100,
      username: isAdFeed ? 'Ad' : `User${id}`,
      profile_image: `https://picsum.photos/200/200?random=${id}`,
    },
    content: `This is a mock feed content number ${id}. It's designed to test the UI and data fetching.`,
    ad_url: isAdFeed ? `https://picsum.photos/600/400?random=${id}` : null,
    ad_meta: isAdFeed ? {
      campaign_id: "ECO-202507",
      category: "바로 보기"
    } : null,
    created_at: new Date(
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
    ).toISOString(),
    like_count: Math.floor(Math.random() * 1000),
    comment_count: Math.floor(Math.random() * 200),
    is_liked: Math.random() > 0.5,
    is_mine: Math.random() > 0.8,
    user_vote_option_id: isPollFeed ? (Math.random() > 0.5 ? 1 : 2) : null,
  };
});

export { mockFeeds };
