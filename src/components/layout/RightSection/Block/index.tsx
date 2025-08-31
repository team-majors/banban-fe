import type { Feed } from "@/types/feeds";
import { AdBlock } from "./AdBlock";
import { FeedBlock } from "./FeedBlock";
import { CommentHeadBlock } from "./CommentHeadBlock";
import { CommentBlock } from "./CommentBlock";
import { CommentContent } from "@/types/comments";
import { Poll } from "@/types/poll";

type BlockType = "feed" | "ad" | "commentHead" | "comment";

type BlockProps =
  | { type: "feed" | "ad" | "commentHead"; feedProps: Feed; pollData: Poll }
  | { type: "comment"; commentProps: CommentContent; pollData: Poll };

const Block = (props: BlockProps) => {
  switch (props.type) {
    case "ad":
      return <AdBlock props={props.feedProps} />;
    case "feed":
      return <FeedBlock props={props.feedProps} pollData={props.pollData} />;
    case "commentHead":
      return <CommentHeadBlock props={props.feedProps} pollData={props.pollData} />;
    case "comment":
      return <CommentBlock props={props.commentProps} pollData={props.pollData} />;
    default:
      return null;
  }
};

export { Block };
export type { BlockType, BlockProps };