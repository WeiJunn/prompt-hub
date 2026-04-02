import Link from "next/link";
import {
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  NotebookPen,
  Shapes,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { CategoryDefinition } from "@/lib/categories";

const iconMap = {
  job: BriefcaseBusiness,
  writing: NotebookPen,
  coding: Code2,
  study: GraduationCap,
  life: Sparkles,
  other: Shapes
};

type CategoryCardItem = CategoryDefinition & {
  promptCount: number;
  updatedAt: string | null;
};

export function CategoryGrid({
  categories,
  showUpdate = true
}: {
  categories: CategoryCardItem[];
  showUpdate?: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => {
        const Icon = iconMap[category.slug];

        return (
          <Link key={category.slug} href={`/categories/${category.slug}`}>
            <Card className="group h-full border-border/80 transition duration-200 hover:-translate-y-1 hover:border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge className="border-primary/15 bg-primary/5 text-primary">
                    {category.promptCount} 个 Prompt
                  </Badge>
                </div>
                <CardTitle className="text-xl">{category.name}</CardTitle>
                <CardDescription>{category.shortDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">{category.description}</p>
                {showUpdate ? (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>最近更新</span>
                    <span>
                      {category.updatedAt ? formatDate(category.updatedAt) : "等待内容加入"}
                    </span>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
