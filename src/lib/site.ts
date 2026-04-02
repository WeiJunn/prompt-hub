const repository = process.env.NEXT_PUBLIC_GITHUB_REPOSITORY ?? "WeiJunn/prompt-hub";
const promptSourceBranch = process.env.NEXT_PUBLIC_PROMPT_SOURCE_BRANCH ?? "prompts";

export function getRepositoryIdentifier() {
  return repository;
}

export function getPromptSourceBranch() {
  return promptSourceBranch;
}

export function getPromptSourceUrl(repositoryPath: string) {
  return `https://github.com/${repository}/blob/${promptSourceBranch}/${repositoryPath}`;
}
