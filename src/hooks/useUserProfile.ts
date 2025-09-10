import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "./useUserVoteInfo";
import { User } from "@/types/auth";

interface UserProfile extends User {
  profile_image_url: string;
  role: string;
}

export default function useUserProfile() {
  return useQuery<UserProfile, Error>({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
}
