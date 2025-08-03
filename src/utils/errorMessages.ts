/* eslint-disable @typescript-eslint/no-explicit-any */
export const HTTP_STATUS_MESSAGES = {
  400: "잘못된 요청입니다.",
  401: "인증이 필요합니다.",
  403: "권한이 없습니다.",
  404: "요청한 리소스를 찾을 수 없습니다.",
  409: "데이터 충돌이 발생했습니다.",
  422: "입력 데이터를 확인해주세요.",
  429: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
  500: "서버 오류가 발생했습니다.",
  502: "서버 연결에 문제가 있습니다.",
  503: "서비스를 일시적으로 사용할 수 없습니다.",
  504: "서버 응답 시간이 초과되었습니다.",
} as const;

export const DEFAULT_ERROR_MESSAGE = "알 수 없는 오류가 발생했습니다.";

/**
 * HTTP 상태 코드에 따른 사용자 친화적인 에러 메시지를 반환
 * @param status HTTP 상태 코드
 * @returns 사용자 친화적인 에러 메시지
 */
export function getErrorMessage(status: number): string {
  return (
    HTTP_STATUS_MESSAGES[status as keyof typeof HTTP_STATUS_MESSAGES] ||
    DEFAULT_ERROR_MESSAGE
  );
}

/**
 * 특정 컨텍스트에 맞는 에러 메시지를 반환
 * @param status HTTP 상태 코드
 * @param context 에러 발생 컨텍스트 (예: 'login', 'signup', 'profile')
 * @returns 컨텍스트에 맞는 에러 메시지
 */
export function getContextualErrorMessage(
  status: number,
  context?: string,
): string {
  const baseMessage = getErrorMessage(status);

  if (!context) return baseMessage;

  // 컨텍스트별 특화 메시지
  const contextualMessages: Record<string, Record<number, string>> = {
    auth: {
      401: "로그인이 필요합니다.",
      403: "계정이 비활성화되었거나 권한이 없습니다.",
      422: "이메일 또는 비밀번호를 확인해주세요.",
      429: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.",
    },
    signup: {
      409: "이미 가입된 이메일입니다.",
      422: "회원가입 정보를 다시 확인해주세요.",
    },
    profile: {
      404: "사용자 정보를 찾을 수 없습니다.",
      403: "본인의 정보만 수정할 수 있습니다.",
    },
    upload: {
      413: "파일 크기가 너무 큽니다.",
      415: "지원하지 않는 파일 형식입니다.",
      422: "파일 업로드에 실패했습니다.",
    },
  };

  return contextualMessages[context]?.[status] || baseMessage;
}

/**
 * 에러 응답에서 메시지를 추출
 * @param errorResponse 서버 에러 응답
 * @param status HTTP 상태 코드
 * @param context 에러 발생 컨텍스트
 * @returns 최종 에러 메시지
 */
export function extractErrorMessage(
  errorResponse: any,
  status: number,
  context?: string,
): string {
  // 서버에서 제공한 메시지가 있으면 우선 사용
  if (errorResponse?.message && typeof errorResponse.message === "string") {
    return errorResponse.message;
  }

  // 서버에서 제공한 에러 배열이 있으면 첫 번째 에러 사용
  if (
    errorResponse?.errors &&
    Array.isArray(errorResponse.errors) &&
    errorResponse.errors.length > 0
  ) {
    return errorResponse.errors[0].message || errorResponse.errors[0];
  }

  // 컨텍스트별 메시지 반환
  return getContextualErrorMessage(status, context);
}
