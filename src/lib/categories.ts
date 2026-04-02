export type CategorySlug =
  | "job"
  | "writing"
  | "coding"
  | "study"
  | "life"
  | "other";

export type CategoryDefinition = {
  slug: CategorySlug;
  name: string;
  directoryName: string;
  description: string;
  shortDescription: string;
};

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    slug: "job",
    name: "求职",
    directoryName: "求职",
    description: "围绕岗位洞察、简历优化、面试准备的高频求职 Prompt。",
    shortDescription: "岗位分析、简历重写与面试作战方案"
  },
  {
    slug: "writing",
    name: "写作",
    directoryName: "写作",
    description: "适合内容写作、文案润色、结构重组和表达升级的 Prompt。",
    shortDescription: "文章、文案和表达优化"
  },
  {
    slug: "coding",
    name: "编程",
    directoryName: "编程",
    description: "面向代码生成、调试、重构和技术方案分析的 Prompt。",
    shortDescription: "生成、调试与重构"
  },
  {
    slug: "study",
    name: "学习",
    directoryName: "学习",
    description: "帮助拆解知识点、制定学习路径和提炼重点的 Prompt。",
    shortDescription: "知识拆解与学习规划"
  },
  {
    slug: "life",
    name: "生活",
    directoryName: "生活",
    description: "用于效率管理、沟通协作、日常规划和决策辅助的 Prompt。",
    shortDescription: "效率、规划与日常决策"
  },
  {
    slug: "other",
    name: "其他",
    directoryName: "其他",
    description: "收纳暂未归类但仍值得复用的通用 Prompt。",
    shortDescription: "通用但有价值的 Prompt"
  }
];

export const CATEGORY_NAME_TO_SLUG = Object.fromEntries(
  CATEGORY_DEFINITIONS.map((category) => [category.name, category.slug])
) as Record<string, CategorySlug>;

export const CATEGORY_SLUG_TO_NAME = Object.fromEntries(
  CATEGORY_DEFINITIONS.map((category) => [category.slug, category.name])
) as Record<CategorySlug, string>;

export function getCategoryBySlug(slug: string) {
  return CATEGORY_DEFINITIONS.find((category) => category.slug === slug) ?? null;
}

export function getCategoryByName(name: string) {
  return CATEGORY_DEFINITIONS.find((category) => category.name === name) ?? null;
}
