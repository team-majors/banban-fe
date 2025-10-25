/**
 * JWT 토큰의 payload를 디코딩합니다
 * @param token JWT 토큰 (access_token)
 * @returns 디코딩된 payload 객체
 */
export function decodeJWT(token: string | null | undefined) {
  if (!token) return null;

  try {
    // JWT는 3개 부분으로 나뉨: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("Invalid JWT format");
      return null;
    }

    // payload 부분 (두 번째)을 base64 디코딩
    const payload = parts[1];
    const decoded = atob(payload);
    const parsed = JSON.parse(decoded);

    return parsed;
  } catch (error) {
    console.warn("Failed to decode JWT:", error);
    return null;
  }
}

/**
 * JWT 토큰에서 role 정보를 추출합니다
 * @param token JWT 토큰 (access_token)
 * @returns role 값 (예: "ADMIN", "USER", null)
 */
export function getRoleFromJWT(token: string | null | undefined): string | null {
  const decoded = decodeJWT(token);
  return decoded?.role ?? null;
}

/**
 * 사용자가 관리자 권한을 가지고 있는지 확인합니다
 * @param token JWT 토큰 (access_token)
 * @returns true if role is "ADMIN", false otherwise
 */
export function isAdmin(token: string | null | undefined): boolean {
  const role = getRoleFromJWT(token);
  return role === "ADMIN";
}
