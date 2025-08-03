import AuthManager from "@/components/auth/AuthManager";
import type { Metadata } from "next";
import "../styles/globals.css";
import { pretendardSans } from "../../public/fonts/variables";
import { NextProvider } from "./providers";
import GlobalModalRenderer from "@/components/common/GlobalModalRenderer";
import Header from "@/components/layout/Header";
import StyledComponentsRegistry from "@/lib/registry";

export const metadata: Metadata = {
  title: "ban:ban",
  description:
    "A social platform where users engage in daily balance game polls and discussions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendardSans.variable} antialiased`}>
        <div id="modal-root"></div>
        <StyledComponentsRegistry>
          <NextProvider>
            <AuthManager />
            <Header isNew />
            {children}
          </NextProvider>
          <div id="modal-root"></div>
          <GlobalModalRenderer />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
