export interface PollOption {
  id: number;
  content: string;
  vote_count: number | null;
  option_order: number;
}

export interface Poll {
  id: number;
  title: string;
  poll_date: string;
  total_votes: number | null;
  options: PollOption[];
  has_voted: boolean;
  voted_option_id: number | null;
  voted_at: string | null;
}
