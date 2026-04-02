import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export async function markdownToHtml(markdown: string) {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

  return processed.toString();
}

export function extractTitleAndBody(markdown: string, fallbackTitle: string) {
  const lines = markdown.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => /^#\s+/.test(line.trim()));

  if (headingIndex === -1) {
    return {
      title: fallbackTitle.trim(),
      body: markdown.trim()
    };
  }

  const title = lines[headingIndex].replace(/^#\s+/, "").trim();
  const body = [...lines.slice(0, headingIndex), ...lines.slice(headingIndex + 1)]
    .join("\n")
    .trim();

  return {
    title: title || fallbackTitle.trim(),
    body
  };
}
