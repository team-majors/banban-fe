import type { Metadata } from "next";
import "../styles/globals.css";
import { pretendardSans } from "../fonts/variables";
import { NextProvider } from "./providers";
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
        <NextProvider>{children}</NextProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
