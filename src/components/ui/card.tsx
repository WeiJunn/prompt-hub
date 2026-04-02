import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/90 bg-card shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("space-y-2 p-6", className)}>{children}</div>;
}

export function CardTitle({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  return <h3 className={cn("text-lg font-semibold text-foreground", className)}>{children}</h3>;
}

export function CardDescription({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  return <p className={cn("text-sm leading-6 text-muted-foreground", className)}>{children}</p>;
}

export function CardContent({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}
