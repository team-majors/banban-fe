import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/auth";
import { getUserProfile } from "@/remote/user";

interface UserProfile extends User {
  profileImageUrl: string;
  role: string;
}

export default function useUserProfile() {
  return useQuery<UserProfile, Error>({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
}
