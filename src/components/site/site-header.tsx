"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, LayoutGrid, Search } from "lucide-react";
import { GlobalSearch } from "@/components/site/global-search";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    href: "/",
    label: "首页",
    icon: LayoutGrid
  },
  {
    href: "/categories",
    label: "分类",
    icon: FolderOpen
  },
  {
    href: "/search",
    label: "搜索",
    icon: Search
  }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">
                PB
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">Prompt 浏览器</p>
                <p className="text-xs text-muted-foreground">找得到、看得懂、复制走</p>
              </div>
            </Link>
            <nav className="hidden items-center gap-2 md:flex">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === "/"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-white hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <GlobalSearch compact className="lg:max-w-xl" />
        </div>
        <nav className="flex items-center gap-2 md:hidden">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-white text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
