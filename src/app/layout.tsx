import type { Metadata } from "next";
import "../styles/globals.css";
import { pretendardSans } from "../../public/fonts/variables";
import { NextProvider } from "./providers";
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
        <StyledComponentsRegistry>
          <NextProvider>
            <Header isLoggedIn isNew />
            {children}
          </NextProvider>
          <div id="modal-root"></div>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
