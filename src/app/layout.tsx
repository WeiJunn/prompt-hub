import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_SC } from "next/font/google";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const notoSansSc = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
  display: "swap"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Prompt 浏览器",
  description: "按领域整理的可复制 Prompt，支持搜索、浏览和快速复用。"
};

function HeaderFallback() {
  return (
    <div className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">
            PB
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">Prompt 浏览器</p>
            <p className="text-xs text-muted-foreground">找得到、看得懂、复制走</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${notoSansSc.variable} ${mono.variable}`}>
        <Suspense fallback={<HeaderFallback />}>
          <SiteHeader />
        </Suspense>
        <main className="min-h-[calc(100vh-180px)]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
