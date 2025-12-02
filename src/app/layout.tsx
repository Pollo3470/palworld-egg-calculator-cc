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
  title: "帕鲁配种计算器 - 配种方案/父母组合/路径查询 | Palworld",
  description:
    "幻兽帕鲁配种计算器，支持查询配种结果、父母组合、配种路径。选择父母查看子代，选择子代查看所有父母组合，实时计算最短配种路线。适用于 Palworld v0.6 版本。",
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
    "帕鲁父母组合",
    "帕鲁配种结果",
    "帕鲁子代查询",
    "配种方案",
    "breeding combinations",
  ],
  authors: [{ name: "Pollo" }],
  creator: "Pollo",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: "帕鲁配种计算器 - 配种方案/父母组合/路径查询 | Palworld",
    description:
      "幻兽帕鲁配种计算器，支持查询配种结果、父母组合、配种路径。选择父母查看子代，选择子代查看所有父母组合。",
    siteName: "帕鲁配种计算器",
  },
  twitter: {
    card: "summary_large_image",
    title: "帕鲁配种计算器 - 配种方案/父母组合/路径查询 | Palworld",
    description:
      "幻兽帕鲁配种计算器，支持查询配种结果、父母组合、配种路径。实时计算最短配种路线。",
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
