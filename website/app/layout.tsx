import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOW - Tìm hành động của bạn ngay bây giờ!",
  description: "An intelligent web application that helps users decide what action to take based on their current time, energy level, mood, and context.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
