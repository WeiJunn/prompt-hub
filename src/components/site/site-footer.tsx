export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-white/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
        <p className="font-medium text-foreground">Prompt 浏览器</p>
        <p>
          这是一个面向搜索、浏览和快速复用的 Prompt 内容站。当前内容主要来自公开可获取资料的整理与再组织，用于学习、归档和复用。
        </p>
        <p>
          如果其中内容涉及版权、署名或其他权益，请联系处理，我会尽快修正。
        </p>
      </div>
    </footer>
  );
}
