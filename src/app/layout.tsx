import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://palworld-egg.pollochen.com"),
  title: "帕鲁配种路径计算器 - Palworld Breeding Calculator",
  description:
    "幻兽帕鲁配种路径计算器，快速计算从起始帕鲁到目标帕鲁的最短配种路线。支持中文搜索，显示多条配种方案，适用于 Palworld v0.6 版本。",
  keywords: [
    "帕鲁",
    "幻兽帕鲁",
    "Palworld",
    "配种",
    "配种计算器",
    "breeding calculator",
    "配种路径",
    "帕鲁配种",
    "帕鲁攻略",
  ],
  authors: [{ name: "Pollo" }],
  creator: "Pollo",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: "帕鲁配种路径计算器 - Palworld Breeding Calculator",
    description:
      "幻兽帕鲁配种路径计算器，快速计算从起始帕鲁到目标帕鲁的最短配种路线。支持中文搜索，显示多条配种方案。",
    siteName: "帕鲁配种路径计算器",
  },
  twitter: {
    card: "summary_large_image",
    title: "帕鲁配种路径计算器 - Palworld Breeding Calculator",
    description:
      "幻兽帕鲁配种路径计算器，快速计算从起始帕鲁到目标帕鲁的最短配种路线。",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "applicable-device": "pc,mobile",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="canonical" href="https://palworld-egg.pollochen.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
