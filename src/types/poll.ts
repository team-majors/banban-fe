export interface PollOption {
  id: number;
  content: string;
  voteCount: number;
  optionOrder: number;
}

export interface Poll {
  id: number;
  title: string;
  pollDate: string;
  totalVotes: number | null;
  options: PollOption[];
  hasVoted: boolean;
  votedOptionId: number | null;
  votedAt: string | null;
}
