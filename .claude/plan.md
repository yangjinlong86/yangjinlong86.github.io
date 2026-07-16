# 在线 Markdown 编辑器页面（PAT + Vditor，仅新建文章）

## 目标
在 Astro 站点新增一个 `/editor` 静态页面：集成好用的 Markdown 编辑器（Vditor），写完填好元信息点「提交并发布」，前端直接调 GitHub Contents API 把文章作为一次 commit 推到 `main`，触发现有 `deploy.yml` 自动构建发布到 GitHub Pages。**无本地服务、无后端、无第三方依赖，只用 GitHub 服务（Pages + Actions + REST API）。**

## 选型（已与用户确认）
- 编辑器：**Vditor**（CDN 加载，工具栏 + 即时渲染/所见即所得/源码三模式，内置代码高亮与 KaTeX）
- 范围：**仅新建文章**（不做编辑/删除已有）
- 认证：**fine-grained Personal Access Token**（浏览器端持有）。理由：纯 GitHub、纯前端；OAuth/Decap CMS 在 GitHub Pages 上都需后端代理，违背「只依赖 GitHub 服务」约束。

## 新增文件
1. `src/pages/editor.astro` -- 编辑器页面（唯一新增源文件）

## 修改文件
无。不碰 `deploy.yml`、不碰 `src/content/config.ts`、不加 npm 依赖（Vditor 走 CDN）。

## 端到端流程
1. 用户在 `/editor` 填写 frontmatter（title/slug/date/tags/description/summary）+ 在 Vditor 写正文。
2. 点「提交并发布」-> 前端拼好 `---frontmatter---\n正文`，UTF-8 安全 base64。
3. `PUT /repos/{owner}/{repo}/contents/src/content/posts/{slug}/index.md`（带 `Authorization: Bearer <token>`）-> 产生一次 commit 到 `main`。
4. 该 push 自动触发 `.github/workflows/deploy.yml` -> build -> 部署到 GitHub Pages（约 1–2 分钟）。

## 页面结构（editor.astro）
沿用站点布局约定（与 `src/pages/tags.astro` 一致）：
```
<BaseLayout title="写作" pathname="/editor">
  <Layout pageName="写作">
    <!-- 设置区：PAT / owner / repo / branch / 记住token / 测试连接 -->
    <!-- 表单区：title / slug / date / tags / description / summary -->
    <!-- 编辑器：<div id="vditor"></div> -->
    <!-- 提交按钮 + 状态/结果区 -->
  </Layout>
</BaseLayout>
```
所有脚本用 `is:inline`（站点已用此模式加载百度统计），引用 CDN 全局 `Vditor`，避免 Astro 打包/类型处理。

## CDN 依赖
- JS: `https://cdn.jsdelivr.net/npm/vditor@3/dist/index.min.js`
- CSS: `https://cdn.jsdelivr.net/npm/vditor@3/dist/index.css`
（站点已从 jsdelivr 加载 KaTeX CSS，一致；BaseLayout 已引入 `katex.min.css`，Vditor 行内公式可复用。）

## Vditor 初始化
- `mode: 'ir'`（即时渲染）
- `toolbar`：标题/粗斜体/引用/代码/链接/列表/表格/emoji/预览/全屏
- `cache: { enable: false }`
- `preview.math` 复用 KaTeX
- 高度自适应

## 凭证与设置区
- `token`（password，不预填；勾「记住 token」存 localStorage，否则 sessionStorage）
- `owner` = `yangjinlong86`（预填，可改）
- `repo` = `yangjinlong86.github.io`（预填，可改）
- `branch` = `main`（预填）
- 这些设置（除 token 外）存 localStorage 供下次复用
- 「测试连接」：`GET /repos/{owner}/{repo}` 验证 token 与仓库访问，显示结果

## frontmatter 生成（对齐 `src/content/config.ts` schema）
schema：title 必填；date 接受 string|Date；tags 数组（默认 []）；description/summary/slug 可选。
```
---
title: "<title>"
date: "YYYY-MM-DD HH:MM:SS"     // 默认当前时间，可手改
tags: ['tag1','tag2']           // 逗号分隔 -> 数组，空则 []
description: "<description>"
summary: "<summary>"
slug: "<slug>"                  // 空则生成 post-YYYYMMDD-HHMMSS
---
<正文>
```
路径：`src/content/posts/<slug>/index.md`。

## 提交逻辑（GitHub Contents API）
- 校验：title 非空、token 非空。
- base64：`btoa(unescape(encodeURIComponent(content)))`（UTF-8 安全）。
- 请求：
  ```
  PUT https://api.github.com/repos/{owner}/{repo}/contents/src/content/posts/{slug}/index.md
  Headers:
    Authorization: Bearer <token>
    Accept: application/vnd.github+json
    X-GitHub-Api-Version: 2022-11-28
    Content-Type: application/json
  Body: { "message": "post: <title>", "content": "<base64>", "branch": "main" }
  ```
- 成功：显示 commit 链接 + Actions 页链接 + 提示「约 1–2 分钟后发布完成」。
- 错误处理：
  - 422（文件已存在）-> 「该 slug 已存在，请换个 slug」
  - 401/403 -> 「token 无效或权限不足（需 contents: write）」
  - 404 -> 「owner/repo 不对」
  - 其他 -> 显示状态码与响应片段

## 安全说明（页面内放简短提示）
- PAT 用 fine-grained，**仅授权本仓库 `Contents: Read and write`**，设过期时间。
- token 仅存浏览器；页面虽公开，但无 token 无法提交。
- 不勾「记住 token」则用 sessionStorage，关页即失效。
- 切勿把 token 写进仓库文件；本实现不提交 token。
- 直接提交到 `main` 会触发全量构建发布（个人博客可接受）。

## 不在本次范围
- 图片上传（Vditor upload hook 后续可接 Contents API）
- 编辑/删除已有文章
- OAuth 登录（需后端代理，违背约束）

## 验证
- `npm run build` 确认 `/editor` 构建无错。
- 浏览器打开 `/editor`，用测试 PAT 提交一篇测试文章，确认：
  1. 仓库出现新 commit + 新文件 `src/content/posts/<slug>/index.md`
  2. GitHub Actions 被触发并成功部署
  3. 文章上线后 frontmatter 渲染、KaTeX/代码高亮正常
