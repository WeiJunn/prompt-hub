import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  actionLabel = "返回首页",
  actionHref = "/"
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <Card className="border-dashed bg-white/90">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="rounded-2xl bg-muted p-4 text-primary">
          <SearchX className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <Link
          href={actionHref}
          className={buttonVariants({
            variant: "outline"
          })}
        >
          {actionLabel}
        </Link>
      </CardContent>
    </Card>
  );
}
