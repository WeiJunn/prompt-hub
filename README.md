# Prompt 内容分支

这个分支专门用于维护 Prompt 内容，不承载前端项目源码。

## 保留内容

- `content/prompts/`：Prompt Markdown 内容
- `.github/workflows/deploy-pages.yml`：GitHub Actions 发布流程

## 工作方式

1. 在这个分支更新 `content/prompts/` 下的内容
2. push 到 `prompts` 分支
3. GitHub Actions 会使用默认分支上的站点代码构建
4. 构建产物会上传为 GitHub Pages artifact，并自动部署

## 说明

- 站点源码位于默认分支 `master`
- Pages 发布产物不会提交回仓库分支
- “打开原文”链接会指向当前分支中的 Markdown 文件
