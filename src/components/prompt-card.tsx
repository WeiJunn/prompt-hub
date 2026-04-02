import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock3, FolderTree } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";

type PromptCardProps = {
  id: string;
  title: ReactNode;
  summary: ReactNode;
  tags: string[];
  relativePath: string;
  updatedAt: string;
  categoryName?: string;
  actionLabel?: string;
  className?: string;
};

export function PromptCard({
  id,
  title,
  summary,
  tags,
  relativePath,
  updatedAt,
  categoryName,
  actionLabel = "一键打开",
  className
}: PromptCardProps) {
  return (
    <Card className={cn("border-border/80 bg-white/95", className)}>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categoryName ? (
            <Badge className="border-secondary/15 bg-secondary/5 text-secondary">
              {categoryName}
            </Badge>
          ) : null}
          {tags.slice(0, 4).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl leading-8">{title}</CardTitle>
          <CardDescription>{summary}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
          <p className="inline-flex items-center gap-2">
            <FolderTree className="h-3.5 w-3.5" />
            {relativePath}
          </p>
          <p className="inline-flex items-center gap-2 sm:justify-end">
            <Clock3 className="h-3.5 w-3.5" />
            {formatDate(updatedAt)}
          </p>
        </div>
        <div className="flex justify-end">
          <Link
            href={`/prompts/${id}`}
            className={buttonVariants({
              variant: "outline"
            })}
          >
            {actionLabel}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
