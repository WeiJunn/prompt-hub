import { CategoryGrid } from "@/components/category-grid";
import { getCategoryStats } from "@/lib/prompts";

export default async function CategoriesPage() {
  const categories = await getCategoryStats();

  return (
    <div className="page-shell space-y-8">
      <section className="space-y-3">
        <p className="section-kicker">Browse</p>
        <h1 className="section-title">全部分类</h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
          这里是全站的分类入口。你可以先按场景缩小范围，再进入具体列表页搜索、筛选和打开详情。
        </p>
      </section>
      <CategoryGrid categories={categories} showUpdate={false} />
    </div>
  );
}
