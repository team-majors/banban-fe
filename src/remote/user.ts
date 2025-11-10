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
  const response = await apiFetch("/users/profile/username", {
    method: "PUT",
    body: JSON.stringify({
      username,
    }),
  });

  return response;
};

export const updateProfileImage = async ({ file }: { file: File }) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiFetch("/users/profile/image", {
    method: "PUT",
    body: formData,
    // FormData 사용 시 Content-Type 자동 설정되므로 헤더 제외
  });

  return response;
};

export const deleteProfileImage = async () => {
  const response = await apiFetch("/users/profile/image", {
    method: "DELETE",
  });

  return response;
};

export const getProfileImageUrl = async (userId: number): Promise<string> => {
  const response: ApiResponse<{ profileImageUrl: string }> = await apiFetch(
    `/users/${userId}/profile-image-url`,
  );
  return response.data.profileImageUrl;
};

export const getDefaultProfileImagePreview = async (): Promise<string> => {
  const response: ApiResponse<{ profileImageUrl: string }> = await apiFetch(
    "/users/profile/default-image-preview",
  );
  return response.data.profileImageUrl;
};
