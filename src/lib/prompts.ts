import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import {
  CATEGORY_DEFINITIONS,
  getCategoryByName,
  type CategoryDefinition,
  type CategorySlug
} from "@/lib/categories";
import { extractTitleAndBody } from "@/lib/markdown";
import { getPromptSourceUrl } from "@/lib/site";
import { stripMarkdown, truncate, uniqueStrings } from "@/lib/utils";

type PromptFrontmatter = {
  title?: string;
  summary?: string;
  tags?: string[];
  source?: string;
  useCases?: string[];
  popularity?: number;
  featured?: boolean;
};

type PromptOverride = PromptFrontmatter & {
  summary: string;
};

type PromptEntry = PromptRecord & {
  filePath: string;
  rawSource: string;
};

export type PromptRecord = {
  id: string;
  title: string;
  summary: string;
  excerpt: string;
  content: string;
  plainText: string;
  rawPrompt: string;
  category: CategoryDefinition;
  tags: string[];
  source: string;
  useCases: string[];
  updatedAt: string;
  popularity: number;
  featured: boolean;
  relativePath: string;
  repositoryPath: string;
  sourceUrl: string;
  fileName: string;
};

const REPOSITORY_ROOT = process.cwd();
const CONTENT_ROOT = path.join(REPOSITORY_ROOT, "content", "prompts");

const PROMPT_OVERRIDES: Record<string, PromptOverride> = {
  "求职/简历优化prompt.md": {
    summary: "从 ATS 关键词、招聘官视角和模块重写三个层面提升简历通过率。",
    tags: ["简历", "ATS", "求职", "JD"],
    source: "公开整理",
    useCases: ["简历重写", "岗位匹配", "投递前优化"],
    popularity: 98,
    featured: true
  },
  "求职/岗位洞察prompt.md": {
    summary: "对多个岗位 JD 做横向拆解、风险判断和投递优先级排序。",
    tags: ["JD", "岗位分析", "求职策略", "职业判断"],
    source: "公开整理",
    useCases: ["岗位洞察", "投递决策", "求职优先级"],
    popularity: 92,
    featured: true
  },
  "求职/面试准备prompt.md": {
    summary: "把 JD 和简历整合成一套可执行的面试准备攻略与回答框架。",
    tags: ["面试", "STAR", "回答框架", "求职"],
    source: "公开整理",
    useCases: ["面试题准备", "自我介绍", "反问清单"],
    popularity: 95,
    featured: true
  }
};

function createPromptId(relativePath: string) {
  return createHash("sha1").update(relativePath).digest("hex").slice(0, 12);
}

function normalizeTitle(title: string) {
  return title.replace(/^prompt/i, "").replace(/prompt$/i, "").trim();
}

function extractRawPrompt(body: string) {
  const fencedMatch = body.match(/^```[a-zA-Z0-9_-]*\n([\s\S]*?)\n```$/);
  return fencedMatch ? fencedMatch[1].trim() : body.trim();
}

async function collectMarkdownFiles(directoryPath: string): Promise<string[]> {
  const entries = await fs.readdir(directoryPath, {
    withFileTypes: true
  });

  const fileLists = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return collectMarkdownFiles(entryPath);
      }

      return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
    })
  );

  return fileLists.flat();
}

async function loadPromptEntries(): Promise<PromptEntry[]> {
  const categoryFiles = await Promise.all(
    CATEGORY_DEFINITIONS.map(async (category) => {
      const directoryPath = path.join(CONTENT_ROOT, category.directoryName);

      try {
        const files = await collectMarkdownFiles(directoryPath);
        return files.map((filePath) => ({
          filePath,
          category
        }));
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "ENOENT"
        ) {
          return [];
        }

        throw error;
      }
    })
  );

  const entries = await Promise.all(
    categoryFiles.flat().map(async ({ filePath, category }) => {
      const rawSource = await fs.readFile(filePath, "utf8");
      const stats = await fs.stat(filePath);
      const relativePath = path.relative(CONTENT_ROOT, filePath).split(path.sep).join("/");
      const repositoryPath = path.relative(REPOSITORY_ROOT, filePath).split(path.sep).join("/");
      const override = PROMPT_OVERRIDES[relativePath];
      const parsed = matter(rawSource);
      const frontmatter = parsed.data as PromptFrontmatter;
      const { title: extractedTitle, body } = extractTitleAndBody(
        parsed.content,
        path.basename(filePath, ".md")
      );
      const resolvedTitle = normalizeTitle(frontmatter.title ?? override?.title ?? extractedTitle);
      const plainText = stripMarkdown(body);
      const tags = uniqueStrings([
        category.name,
        normalizeTitle(path.basename(filePath, ".md")),
        ...(frontmatter.tags ?? []),
        ...(override?.tags ?? [])
      ]);

      return {
        id: createPromptId(relativePath),
        filePath,
        rawSource,
        title: resolvedTitle,
        summary:
          frontmatter.summary ??
          override?.summary ??
          truncate(plainText, 88),
        excerpt: truncate(plainText, 136),
        content: body,
        plainText,
        rawPrompt: extractRawPrompt(body),
        category: getCategoryByName(category.name) ?? category,
        tags,
        source: frontmatter.source ?? override?.source ?? "仓库整理",
        useCases:
          frontmatter.useCases ??
          override?.useCases ??
          tags.slice(0, 3),
        updatedAt: stats.mtime.toISOString(),
        popularity: frontmatter.popularity ?? override?.popularity ?? 60,
        featured: frontmatter.featured ?? override?.featured ?? false,
        relativePath,
        repositoryPath,
        sourceUrl: getPromptSourceUrl(repositoryPath),
        fileName: path.basename(filePath)
      };
    })
  );

  return entries.sort((left, right) => {
    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });
}

const getPromptEntries = cache(loadPromptEntries);

export const getAllPrompts = cache(async () => {
  const entries = await getPromptEntries();
  return entries.map(({ filePath, rawSource, ...prompt }) => prompt);
});

export async function getPromptById(id: string) {
  const entries = await getPromptEntries();
  const entry = entries.find((prompt) => prompt.id === id);

  if (!entry) {
    return null;
  }

  const { filePath, rawSource, ...prompt } = entry;

  return {
    ...prompt,
    rawSource
  };
}

export async function getPromptSourceById(id: string) {
  const entries = await getPromptEntries();
  const entry = entries.find((prompt) => prompt.id === id);

  if (!entry) {
    return null;
  }

  return {
    rawSource: entry.rawSource,
    relativePath: entry.relativePath,
    repositoryPath: entry.repositoryPath,
    sourceUrl: entry.sourceUrl,
    title: entry.title
  };
}

export async function getPromptsByCategory(slug: CategorySlug) {
  const prompts = await getAllPrompts();
  return prompts.filter((prompt) => prompt.category.slug === slug);
}

export async function getCategoryStats() {
  const prompts = await getAllPrompts();

  return CATEGORY_DEFINITIONS.map((category) => {
    const categoryPrompts = prompts.filter((prompt) => prompt.category.slug === category.slug);

    return {
      ...category,
      promptCount: categoryPrompts.length,
      updatedAt: categoryPrompts[0]?.updatedAt ?? null
    };
  });
}

export async function getLatestPrompts(limit = 4) {
  const prompts = await getAllPrompts();
  return prompts.slice(0, limit);
}

export async function getFeaturedPrompts(limit = 4) {
  const prompts = await getAllPrompts();
  return [...prompts]
    .sort((left, right) => right.popularity - left.popularity)
    .slice(0, limit);
}

export async function getRelatedPrompts(promptId: string, limit = 3) {
  const prompts = await getAllPrompts();
  const currentPrompt = prompts.find((prompt) => prompt.id === promptId);

  if (!currentPrompt) {
    return [];
  }

  return prompts
    .filter((prompt) => prompt.id !== promptId)
    .map((prompt) => {
      const sameCategory = prompt.category.slug === currentPrompt.category.slug ? 2 : 0;
      const sharedTags = prompt.tags.filter((tag) => currentPrompt.tags.includes(tag)).length;

      return {
        prompt,
        score: sameCategory + sharedTags
      };
    })
    .sort((left, right) => {
      if (right.score === left.score) {
        return right.prompt.popularity - left.prompt.popularity;
      }

      return right.score - left.score;
    })
    .slice(0, limit)
    .map(({ prompt }) => prompt);
}

export async function getAllTags() {
  const prompts = await getAllPrompts();
  return uniqueStrings(prompts.flatMap((prompt) => prompt.tags)).sort((left, right) => {
    return left.localeCompare(right, "zh-CN");
  });
}

export async function getTagsByCategory(slug: CategorySlug) {
  const prompts = await getPromptsByCategory(slug);
  return uniqueStrings(prompts.flatMap((prompt) => prompt.tags)).sort((left, right) => {
    return left.localeCompare(right, "zh-CN");
  });
}
