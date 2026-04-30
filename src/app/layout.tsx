import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Nhà Trọ Phú Thọ - Tìm phòng trọ nhanh chóng",
    template: "%s | Nhà Trọ Phú Thọ",
  },
  description:
    "Tìm kiếm phòng trọ, nhà trọ giá rẻ tại Phú Thọ. Đầy đủ thông tin giá cả, diện tích, tiện ích, hình ảnh. Kết nối trực tiếp với chủ trọ.",
  keywords: [
    "nhà trọ phú thọ",
    "phòng trọ phú thọ",
    "thuê phòng phú thọ",
    "nhà trọ việt trì",
    "phòng trọ giá rẻ phú thọ",
    "tìm phòng trọ",
    "phòng trọ gần trường đại học hùng vương",
  ],
  authors: [{ name: "Nhà Trọ Phú Thọ" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://nhatrophutho.com",
    siteName: "Nhà Trọ Phú Thọ",
    title: "Nhà Trọ Phú Thọ - Tìm phòng trọ nhanh chóng tại Phú Thọ",
    description:
      "Nền tảng tìm kiếm phòng trọ #1 tại Phú Thọ. Hàng trăm phòng trọ giá rẻ, tiện ích đầy đủ.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nhà Trọ Phú Thọ",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
