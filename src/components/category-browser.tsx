"use client";

import { useDeferredValue, useState } from "react";
import Fuse from "fuse.js";
import { ArrowUpDown, Search } from "lucide-react";
import { PromptCard } from "@/components/prompt-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { CategoryDefinition } from "@/lib/categories";
import type { PromptRecord } from "@/lib/prompts";
import { cn } from "@/lib/utils";

export function CategoryBrowser({
  category,
  prompts,
  tags
}: {
  category: CategoryDefinition;
  prompts: PromptRecord[];
  tags: string[];
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("全部");
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");
  const deferredQuery = useDeferredValue(query);

  const searchResults = deferredQuery.trim()
    ? new Fuse(prompts, {
        keys: ["title", "summary", "tags", "plainText"],
        threshold: 0.34,
        ignoreLocation: true
      })
        .search(deferredQuery)
        .map((result) => result.item)
    : prompts;

  const visiblePrompts = searchResults
    .filter((prompt) => activeTag === "全部" || prompt.tags.includes(activeTag))
    .sort((left, right) => {
      if (sortBy === "popular") {
        return right.popularity - left.popularity;
      }

      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-3xl border border-border bg-white/90 p-5 shadow-card lg:grid-cols-[minmax(0,1fr)_auto]">
        <label className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder={`在 ${category.name} 中搜索标题、标签或内容`}
            className="h-12 w-full border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
        <div className="flex items-center gap-2">
          <Button
            variant={sortBy === "latest" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSortBy("latest");
            }}
          >
            <ArrowUpDown className="h-4 w-4" />
            最近更新
          </Button>
          <Button
            variant={sortBy === "popular" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSortBy("popular");
            }}
          >
            <ArrowUpDown className="h-4 w-4" />
            热度优先
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {["全部", ...tags].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              setActiveTag(tag);
            }}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              activeTag === tag
                ? "border-secondary bg-secondary text-secondary-foreground"
                : "border-border bg-white text-muted-foreground hover:border-secondary/40 hover:text-foreground"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          共找到 <span className="font-semibold text-foreground">{visiblePrompts.length}</span> 个
          Prompt
        </p>
        <Badge className="border-primary/15 bg-primary/5 text-primary">
          当前分类：{category.name}
        </Badge>
      </div>

      {visiblePrompts.length ? (
        <div className="grid gap-4">
          {visiblePrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              id={prompt.id}
              title={prompt.title}
              summary={prompt.summary}
              tags={prompt.tags}
              relativePath={prompt.relativePath}
              updatedAt={prompt.updatedAt}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="这个分类下暂时没有匹配结果"
          description="你可以调整关键词、切换标签，或者先回到首页浏览其它分类。"
          actionLabel="查看全部分类"
          actionHref="/categories"
        />
      )}
    </div>
  );
}
