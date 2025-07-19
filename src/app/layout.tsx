import type { Metadata } from "next";
import "../styles/globals.css";
import { pretendardSans } from "../../public/fonts/variables";
import { NextProvider } from "./providers";
import Header from "@/components/layout/Header";
import GlobalModalRenderer from "@/components/common/GlobalModalRenderer";
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
        <NextProvider>
          <Header isLoggedIn isNew />
          {children}
          <GlobalModalRenderer />
        </NextProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
