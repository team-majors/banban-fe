import AuthManager from "@/components/auth/AuthManager";
import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import { pretendardSans } from "../../public/fonts/variables";
import { NextProvider } from "./providers";
import GlobalModalRenderer from "@/components/common/GlobalModalRenderer";
import Header from "@/components/layout/Header";
import StyledComponentsRegistry from "@/lib/registry";
import NotificationListener from "@/components/notification/NotificationListener";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://www.banban.today";

const defaultTitle = "ban:ban";
const defaultDescription =
  "하루 한 번 주어지는 밸런스 게임 주제로 토론하고 의견을 나누는 소셜 플랫폼";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${defaultTitle}`,
  },
  description: defaultDescription,
  keywords: [
    "banban",
    "밸런스 게임",
    "소셜 플랫폼",
    "토론",
    "데일리 투표",
    "커뮤니티",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: defaultTitle,
    description: defaultDescription,
    siteName: defaultTitle,
    locale: "ko_KR",
    images: [
      {
        url: `${siteUrl}/banban_og.jpg`,
        width: 1200,
        height: 630,
        alt: "ban:ban - 오늘의 밸런스 게임",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [`${siteUrl}/banban_logo.png`],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#3f13ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendardSans.variable} antialiased h-dvh`}>
        <StyledComponentsRegistry>
          <NextProvider>
            <AuthManager />
            <NotificationListener />
            <Header />
            {children}
          </NextProvider>
          <GlobalModalRenderer />
        </StyledComponentsRegistry>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
