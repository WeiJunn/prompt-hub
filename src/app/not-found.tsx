import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="page-shell">
      <div className="rounded-[2rem] border border-dashed border-border bg-white/90 px-6 py-16 text-center shadow-card sm:px-10">
        <p className="section-kicker">404</p>
        <h1 className="mt-2 text-4xl font-semibold text-foreground">页面不存在</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          可能是链接已经失效，或者这个 Prompt 还没有被收录。你可以先回到首页继续浏览。
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/" className={buttonVariants({})}>
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
