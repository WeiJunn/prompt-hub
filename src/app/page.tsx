import Link from "next/link";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { CategoryGrid } from "@/components/category-grid";
import { PromptCard } from "@/components/prompt-card";
import { GlobalSearch } from "@/components/site/global-search";
import { buttonVariants } from "@/components/ui/button";
import { getCategoryStats, getFeaturedPrompts, getLatestPrompts } from "@/lib/prompts";

export default async function HomePage() {
  const [categories, latestPrompts, featuredPrompts] = await Promise.all([
    getCategoryStats(),
    getLatestPrompts(3),
    getFeaturedPrompts(3)
  ]);

  return (
    <div className="page-shell space-y-14">
      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-white/90 p-6 shadow-card sm:p-8 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              工具型内容站
            </div>
            <div className="space-y-4">
              <p className="section-kicker">Prompt Browser</p>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Prompt 浏览器
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                按领域整理的可复制 Prompt，支持搜索、浏览和快速复用。目标很简单：
                3 秒内知道这里是做什么的，然后快速进入你需要的分类。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#categories"
                className={buttonVariants({
                  size: "lg"
                })}
              >
                开始浏览
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/categories"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg"
                })}
              >
                查看全部分类
              </Link>
            </div>
            <GlobalSearch className="max-w-2xl" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl border border-border bg-background p-5">
              <p className="text-sm text-muted-foreground">当前收录</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {latestPrompts.length}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                现有内容以求职类 Prompt 为主，适合直接复制到 AI 工具中复用。
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-background p-5">
              <p className="text-sm text-muted-foreground">核心体验</p>
              <p className="mt-2 text-lg font-semibold text-foreground">找得到、看得懂、复制走</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                分类清晰、搜索直达、详情页干净，不把注意力浪费在复杂操作上。
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-background p-5">
              <p className="text-sm text-muted-foreground">推荐入口</p>
              <p className="mt-2 text-lg font-semibold text-foreground">从分类开始</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                先按分类看范围，再在分类页局部搜索，会比全站盲搜更快。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="space-y-6">
        <div className="space-y-2">
          <p className="section-kicker">Categories</p>
          <h2 className="section-title">分类入口</h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            以任务场景组织内容，优先让你快速缩小范围，再进入列表挑选细项。
          </p>
        </div>
        <CategoryGrid categories={categories} />
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/8 p-3 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="section-kicker">Updates</p>
              <h2 className="section-title text-2xl">最近更新</h2>
            </div>
          </div>
          <div className="grid gap-4">
            {latestPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                id={prompt.id}
                title={prompt.title}
                summary={prompt.summary}
                tags={prompt.tags}
                relativePath={prompt.relativePath}
                updatedAt={prompt.updatedAt}
                categoryName={prompt.category.name}
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-accent/15 p-3 text-accent">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="section-kicker">Popular</p>
              <h2 className="section-title text-2xl">热门 Prompt</h2>
            </div>
          </div>
          <div className="grid gap-4">
            {featuredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                id={prompt.id}
                title={prompt.title}
                summary={prompt.summary}
                tags={prompt.tags}
                relativePath={prompt.relativePath}
                updatedAt={prompt.updatedAt}
                categoryName={prompt.category.name}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
