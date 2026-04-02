"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function GlobalSearch({
  initialQuery = "",
  placeholder = "搜索标题、内容、标签或分类",
  className,
  compact = false
}: {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  return (
    <form
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border border-border bg-white px-4 shadow-sm",
        compact ? "h-11" : "h-14",
        className
      )}
      onSubmit={(event) => {
        event.preventDefault();
        const query = value.trim();
        router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
      }}
    >
      <Search className="h-4 w-4 text-muted-foreground" />
      <input
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        className="w-full border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        placeholder={placeholder}
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            setValue("");
            router.push("/search");
          }}
          className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          清空
        </button>
      ) : null}
    </form>
  );
}
