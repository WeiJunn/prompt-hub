import { SearchResults } from "@/components/search-results";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CATEGORY_DEFINITIONS } from "@/lib/categories";
import { getAllPrompts, getAllTags } from "@/lib/prompts";

export default async function SearchPage() {
  const prompts = await getAllPrompts();
  const tags = await getAllTags();

  return (
    <div className="page-shell space-y-8">
      <Breadcrumbs
        items={[
          { label: "首页", href: "/" },
          { label: "搜索" }
        ]}
      />
      <SearchResults
        prompts={prompts.map((prompt) => ({
          id: prompt.id,
          title: prompt.title,
          summary: prompt.summary,
          tags: prompt.tags,
          plainText: prompt.plainText,
          categoryName: prompt.category.name,
          categorySlug: prompt.category.slug,
          updatedAt: prompt.updatedAt,
          relativePath: prompt.relativePath,
          popularity: prompt.popularity
        }))}
        categories={CATEGORY_DEFINITIONS.map((category) => ({
          slug: category.slug,
          name: category.name
        }))}
        tags={tags}
        initialQuery=""
        initialCategory="all"
        initialTag="全部"
      />
    </div>
  );
}
