import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "비니의 패션 뷰티 수집기",
  description: "비니의 패션·뷰티 광고 & 트렌드 아카이브",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
