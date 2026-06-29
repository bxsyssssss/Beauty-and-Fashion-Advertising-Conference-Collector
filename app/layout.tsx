import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "광고 레퍼런스 수집기",
  description: "뷰티·패션 광고 레퍼런스 아카이브",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
