/* eslint-disable @typescript-eslint/no-explicit-any */
export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[API] ${message}`, data);
    }
  },

  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[API WARNING] ${message}`, data);
    }
  },

  error: (message: string, error?: any) => {
    console.error(`[API ERROR] ${message}`, error);

    // 운영 환경에서는 에러 모니터링 서비스로 전송
    if (process.env.NODE_ENV === "production") {
      // 예: Sentry, LogRocket 등으로 전송
      // sendToErrorMonitoring(message, error);
    }
  },

  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[API DEBUG] ${message}`, data);
    }
  },
};
