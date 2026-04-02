# Prompt 浏览器仓库

这个仓库现在同时承载两部分内容：

- Prompt 浏览器前端项目
- 可直接复制使用的中文 Prompt 内容

站点目标很简单：找得到、看得懂、复制走。

## 内容目录

Prompt 内容统一放在 `content/prompts/` 下，当前已收录：

### `content/prompts/求职/`
求职相关 prompt，包括：
- `岗位洞察prompt.md`
- `简历优化prompt.md`
- `面试准备prompt.md`

## 本地开发

```bash
npm install
npm run dev
```

## 静态发布

项目使用 GitHub Actions 构建，并通过 GitHub Pages 发布。

- 本地静态导出产物目录：`out/`
- Next.js 中间构建目录：`.next/`
- GitHub Actions 会上传 `out/` 作为 Pages artifact

## 分支约定

建议按下面的方式使用：

- `master`：前端项目源码
- `prompts`：Prompt 内容更新分支

工作流会始终使用默认分支的项目代码来构建站点，并优先同步 `prompts` 分支中的 `content/prompts/` 内容。

注意：

- 如果你希望“更新 prompts 分支后自动发布”，那么 `prompts` 分支里也需要保留 `.github/workflows/` 文件，因为 GitHub 会在触发事件对应的分支上查找 workflow。
- GitHub Pages 仓库设置里需要将 Source 设为 `GitHub Actions`。

## 使用方式

1. 进入对应分类目录
2. 选择对应 prompt 文件
3. 复制完整 prompt 到 AI 工具中
4. 填入 JD、简历或补充背景
5. 根据输出继续迭代

## 版权与来源说明

本仓库中的 prompt 主要来源于互联网上公开可获取的内容，仅用于个人学习、整理与复用，不主张其为原创内容。

如果其中内容涉及你的版权、署名或其他权益，请联系我处理，我会尽快删除或修正相关内容。
