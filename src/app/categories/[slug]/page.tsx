import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CategoryBrowser } from "@/components/category-browser";
import { CATEGORY_DEFINITIONS, getCategoryBySlug } from "@/lib/categories";
import { getPromptsByCategory, getTagsByCategory } from "@/lib/prompts";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return CATEGORY_DEFINITIONS.map((category) => ({
    slug: category.slug
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {};
  }

  return {
    title: `${category.name} Prompt`,
    description: category.description
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [prompts, tags] = await Promise.all([
    getPromptsByCategory(category.slug),
    getTagsByCategory(category.slug)
  ]);

  return (
    <div className="page-shell space-y-8">
      <Breadcrumbs
        items={[
          { label: "首页", href: "/" },
          { label: "分类", href: "/categories" },
          { label: category.name }
        ]}
      />

      <section className="space-y-4">
        <p className="section-kicker">{category.name}</p>
        <div className="space-y-3">
          <h1 className="section-title">{category.name} Prompt</h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            {category.description}
          </p>
        </div>
      </section>

      <CategoryBrowser category={category} prompts={prompts} tags={tags} />
    </div>
  );
}
