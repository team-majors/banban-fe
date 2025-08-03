import STORAGE_KEYS from "@/constants/storageKeys";

export const saveAccessToken = (access_token: string) => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
};
export const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};
