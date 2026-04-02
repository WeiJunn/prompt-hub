"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, FileText, LayoutTemplate } from "lucide-react";
import { PromptCard } from "@/components/prompt-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCount, formatDate } from "@/lib/utils";

type RelatedPrompt = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  relativePath: string;
  updatedAt: string;
};

type PromptDetailShellProps = {
  prompt: {
    id: string;
    title: string;
    summary: string;
    html: string;
    rawPrompt: string;
    source: string;
    sourceUrl: string;
    tags: string[];
    useCases: string[];
    updatedAt: string;
    relativePath: string;
    category: {
      name: string;
      slug: string;
    };
  };
  relatedPrompts: RelatedPrompt[];
};

export function PromptDetailShell({
  prompt,
  relatedPrompts
}: PromptDetailShellProps) {
  const [mode, setMode] = useState<"rendered" | "plain">("rendered");
  const [copied, setCopied] = useState(false);
  const [copyCount, setCopyCount] = useState(0);
  const storageKey = `prompt-copy-count:${prompt.id}`;

  useEffect(() => {
    const savedCount = window.localStorage.getItem(storageKey);
    setCopyCount(savedCount ? Number(savedCount) : 0);
  }, [storageKey]);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <Card className="overflow-hidden border-border/80 bg-white">
          <CardHeader className="space-y-5 border-b border-border/70 bg-gradient-to-br from-white to-primary/5">
            <div className="flex flex-wrap gap-2">
              <Badge className="border-secondary/15 bg-secondary/5 text-secondary">
                {prompt.category.name}
              </Badge>
              {prompt.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <div className="space-y-3">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground">
                {prompt.title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-muted-foreground">
                {prompt.summary}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={async () => {
                  await navigator.clipboard.writeText(prompt.rawPrompt);
                  const nextCount = copyCount + 1;
                  window.localStorage.setItem(storageKey, String(nextCount));
                  setCopyCount(nextCount);
                  setCopied(true);
                  window.setTimeout(() => {
                    setCopied(false);
                  }, 1800);
                }}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "已复制" : "一键复制"}
              </Button>
              <Link
                href={prompt.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  variant: "outline"
                })}
              >
                <ExternalLink className="h-4 w-4" />
                打开原文
              </Link>
              <Link
                href={`/categories/${prompt.category.slug}`}
                className={buttonVariants({
                  variant: "ghost"
                })}
              >
                返回分类
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6 lg:p-8">
            <div id="content" className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">阅读模式</p>
                <h2 className="text-2xl font-semibold text-foreground">Prompt 正文</h2>
              </div>
              <div className="inline-flex rounded-2xl border border-border bg-background p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("rendered");
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
                    mode === "rendered"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <LayoutTemplate className="h-4 w-4" />
                  渲染模式
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("plain");
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
                    mode === "plain"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <FileText className="h-4 w-4" />
                  纯文本
                </button>
              </div>
            </div>

            {mode === "rendered" ? (
              <article
                className="prose prose-slate max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-pre:rounded-2xl prose-pre:border prose-pre:border-border prose-pre:bg-slate-950 prose-pre:p-5 prose-code:text-[0.9em]"
                dangerouslySetInnerHTML={{
                  __html: prompt.html
                }}
              />
            ) : (
              <pre className="overflow-x-auto rounded-3xl border border-border bg-slate-950 p-5 font-mono text-sm leading-7 text-slate-100">
                <code>{prompt.rawPrompt}</code>
              </pre>
            )}
          </CardContent>
        </Card>

        <section id="related" className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">继续浏览</p>
            <h2 className="text-2xl font-semibold text-foreground">相关 Prompt</h2>
          </div>
          <div className="grid gap-4">
            {relatedPrompts.length ? (
              relatedPrompts.map((item) => (
                <PromptCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  summary={item.summary}
                  tags={item.tags}
                  relativePath={item.relativePath}
                  updatedAt={item.updatedAt}
                />
              ))
            ) : (
              <Card className="border-dashed bg-white/90">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  暂时还没有足够相近的 Prompt，可先返回分类页继续浏览。
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>

      <aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>辅助信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">分类</p>
              <p className="font-medium text-foreground">{prompt.category.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">标签</p>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">来源</p>
              <p className="font-medium text-foreground">{prompt.source}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">更新时间</p>
              <p className="font-medium text-foreground">{formatDate(prompt.updatedAt)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">适用场景</p>
              <ul className="space-y-2">
                {prompt.useCases.map((useCase) => (
                  <li
                    key={useCase}
                    className="rounded-2xl border border-border bg-background px-4 py-3 text-foreground"
                  >
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">复制次数</p>
              <p className="font-medium text-foreground">{formatCount(copyCount)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">原始目录</p>
              <p className="font-medium text-foreground">{prompt.relativePath}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>快捷跳转</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a href="#content" className="block rounded-2xl border border-border px-4 py-3 text-sm text-foreground transition hover:border-primary/35">
              跳到正文
            </a>
            <a href="#related" className="block rounded-2xl border border-border px-4 py-3 text-sm text-foreground transition hover:border-primary/35">
              查看相关推荐
            </a>
            <Link
              href={`/categories/${prompt.category.slug}`}
              className="block rounded-2xl border border-border px-4 py-3 text-sm text-foreground transition hover:border-primary/35"
            >
              返回分类页
            </Link>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
