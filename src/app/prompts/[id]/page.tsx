import { notFound } from "next/navigation";
import { markdownToHtml } from "@/lib/markdown";
import { getAllPrompts, getPromptById, getRelatedPrompts } from "@/lib/prompts";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PromptDetailShell } from "@/components/prompt-detail-shell";

type PromptPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateStaticParams() {
  const prompts = await getAllPrompts();

  return prompts.map((prompt) => ({
    id: prompt.id
  }));
}

export async function generateMetadata({ params }: PromptPageProps) {
  const { id } = await params;
  const prompt = await getPromptById(id);

  if (!prompt) {
    return {};
  }

  return {
    title: `${prompt.title} | Prompt 浏览器`,
    description: prompt.summary
  };
}

export default async function PromptDetailPage({ params }: PromptPageProps) {
  const { id } = await params;
  const prompt = await getPromptById(id);

  if (!prompt) {
    notFound();
  }

  const [html, relatedPrompts] = await Promise.all([
    markdownToHtml(prompt.rawPrompt),
    getRelatedPrompts(prompt.id, 3)
  ]);

  return (
    <div className="page-shell space-y-8">
      <Breadcrumbs
        items={[
          {
            label: "首页",
            href: "/"
          },
          {
            label: "分类",
            href: "/categories"
          },
          {
            label: prompt.category.name,
            href: `/categories/${prompt.category.slug}`
          },
          {
            label: prompt.title
          }
        ]}
      />

      <PromptDetailShell
        prompt={{
          id: prompt.id,
          title: prompt.title,
          summary: prompt.summary,
          html,
          rawPrompt: prompt.rawPrompt,
          source: prompt.source,
          sourceUrl: prompt.sourceUrl,
          tags: prompt.tags,
          useCases: prompt.useCases,
          updatedAt: prompt.updatedAt,
          relativePath: prompt.relativePath,
          category: {
            name: prompt.category.name,
            slug: prompt.category.slug
          }
        }}
        relatedPrompts={relatedPrompts}
      />
    </div>
  );
}
