import { TokenRequestResponse } from "@/types/auth";

export async function getToken({
  code,
  provider,
}: {
  code: string;
  provider: "kakao" | "naver";
}) {
  const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/oauth/${provider}/callback?code=${code}`;

  const response = await fetch(targetUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data: TokenRequestResponse;
  try {
    data = await response.json();
  } catch {
    throw new Error("서버 응답을 파싱하는 데 실패했습니다.");
  }

  return { data, response };
}
