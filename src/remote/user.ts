import { apiFetch } from "@/lib/apiFetch";
import { ApiResponse } from "@/types/api";
import { UserProfile } from "@/types/auth";

export const getUserProfile = async (): Promise<UserProfile> => {
  const response: ApiResponse<UserProfile> = await apiFetch("/users/profile");
  return response.data;
};

export const getUserProfileImage = async ({ url }: { url: string }) => {
  const response: { data: string } = await apiFetch(url.replace("/api", ""), {
    method: "GET",
  });

  return response;
};

export const updateUsername = async ({ username }: { username: string }) => {
  const response = await apiFetch("/users/profile/username/", {
    method: "PUT",
    body: JSON.stringify({
      username,
    }),
  });

  return response;
};

export const updateProfileImage = async ({ file }: { file: string }) => {
  const response = await apiFetch("/users/profile/image/", {
    method: "PUT",
    body: JSON.stringify({
      file,
    }),
  });

  return response;
};
