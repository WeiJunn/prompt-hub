"use client";

import { startTransition, useDeferredValue, useEffect, useRef, useState } from "react";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { HighlightedText } from "@/components/highlighted-text";
import { PromptCard } from "@/components/prompt-card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { buildExcerpt } from "@/lib/search";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type SearchPrompt = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  plainText: string;
  categoryName: string;
  categorySlug: string;
  updatedAt: string;
  relativePath: string;
  popularity: number;
};

export function SearchResults({
  prompts,
  categories,
  tags,
  initialQuery,
  initialCategory,
  initialTag
}: {
  prompts: SearchPrompt[];
  categories: Array<{
    slug: string;
    name: string;
  }>;
  tags: string[];
  initialQuery: string;
  initialCategory: string;
  initialTag: string;
}) {
  const router = useRouter();
  const initializedFromUrlRef = useRef(false);
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeTag, setActiveTag] = useState(initialTag);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    if (initializedFromUrlRef.current) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? initialQuery);
    setActiveCategory(params.get("category") ?? initialCategory);
    setActiveTag(params.get("tag") ?? initialTag);
    initializedFromUrlRef.current = true;
  }, [initialCategory, initialQuery, initialTag]);

  useEffect(() => {
    if (!initializedFromUrlRef.current) {
      return;
    }

    const params = new URLSearchParams();

    if (deferredQuery.trim()) {
      params.set("q", deferredQuery.trim());
    }

    if (activeCategory && activeCategory !== "all") {
      params.set("category", activeCategory);
    }

    if (activeTag && activeTag !== "全部") {
      params.set("tag", activeTag);
    }

    const target = params.toString() ? `/search?${params.toString()}` : "/search";

    startTransition(() => {
      router.replace(target);
    });
  }, [activeCategory, activeTag, deferredQuery, router]);

  const searchResults = deferredQuery.trim()
    ? new Fuse(prompts, {
        keys: ["title", "summary", "tags", "plainText", "categoryName"],
        threshold: 0.34,
        ignoreLocation: true
      })
        .search(deferredQuery)
        .map((result) => result.item)
    : prompts;

  const categoryFiltered = searchResults.filter((prompt) => {
    return activeCategory === "all" ? true : prompt.categorySlug === activeCategory;
  });

  const availableTags = Array.from(
    new Set(categoryFiltered.flatMap((prompt) => prompt.tags))
  ).sort((left, right) => left.localeCompare(right, "zh-CN"));

  const visiblePrompts = categoryFiltered
    .filter((prompt) => (activeTag === "全部" ? true : prompt.tags.includes(activeTag)))
    .sort((left, right) => {
      const normalizedQuery = deferredQuery.trim();
      const leftQueryScore =
        normalizedQuery && left.title.includes(normalizedQuery) ? 1 : 0;
      const rightQueryScore =
        normalizedQuery && right.title.includes(normalizedQuery) ? 1 : 0;

      if (rightQueryScore !== leftQueryScore) {
        return rightQueryScore - leftQueryScore;
      }

      return right.popularity - left.popularity;
    });

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-white/90 p-5 shadow-card">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,240px)]">
          <label className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              placeholder="搜索标题、内容、标签或分类"
              className="h-12 w-full border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <select
              value={activeCategory}
              onChange={(event) => {
                setActiveCategory(event.target.value);
                setActiveTag("全部");
              }}
              className="h-12 rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none"
            >
              <option value="all">全部分类</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={activeTag}
              onChange={(event) => {
                setActiveTag(event.target.value);
              }}
              className="h-12 rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none"
            >
              <option value="全部">全部标签</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {["全部", ...(availableTags.length ? availableTags : tags)].flatMap((tag, index) => {
            const text = typeof tag === "string" ? tag : "";
            return index === 0 || text ? [text] : [];
          }).map((tag) => (
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
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">全站搜索结果</p>
          <h2 className="text-2xl font-semibold text-foreground">
            {deferredQuery.trim() ? (
              <>
                <span className="text-primary">“{deferredQuery.trim()}”</span> 的匹配结果
              </>
            ) : (
              "浏览全部 Prompt"
            )}
          </h2>
        </div>
        <Badge className="border-primary/15 bg-primary/5 text-primary">
          {visiblePrompts.length} 条结果
        </Badge>
      </div>

      {visiblePrompts.length ? (
        <div className="grid gap-4">
          {visiblePrompts.map((prompt) => {
            const excerpt = buildExcerpt(prompt.plainText || prompt.summary, deferredQuery);

            return (
              <PromptCard
                key={prompt.id}
                id={prompt.id}
                title={<HighlightedText text={prompt.title} query={deferredQuery} />}
                summary={<HighlightedText text={excerpt} query={deferredQuery} />}
                tags={prompt.tags}
                relativePath={prompt.relativePath}
                updatedAt={prompt.updatedAt}
                categoryName={prompt.categoryName}
                actionLabel="查看详情"
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="没有找到匹配的 Prompt"
          description="可以换个关键词、取消标签筛选，或者先浏览首页推荐内容。"
          actionLabel="返回搜索页"
          actionHref="/search"
        />
      )}
    </div>
  );
}
