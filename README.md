# Funny Eagle Blog

基于 [Astro](https://astro.build) 构建的个人博客,托管于 GitHub Pages。内容使用 Markdown + frontmatter 管理,通过 GitHub Actions 自动构建部署。

## 🎨 功能特性

- **Astro 5 + TypeScript**:静态站点生成,开箱即用
- **Content Collections**:文章存放在 `src/content/posts/<slug>/index.md`,带类型校验
- **Markdown 增强**:GFM、KaTeX 数学公式(`remark-math` + `rehype-katex`)、Shiki 代码高亮
- **标签 / 归档**:按标签、按时间分页归档
- **目录(TOC)**:文章页自动生成侧边目录
- **评论系统**:集成 Giscus(GitHub Discussions)
- **RSS / Sitemap**:自动生成 `rss.xml` 与 `sitemap-index.xml`
- **在线写作**:`/editor` 页面支持在浏览器内直接写文章并发布(零后端)
- **SEO**:站点元信息集中配置在 `src/consts.ts`

## 🚀 快速开始

### 环境要求

- Node.js ≥ 20.19(推荐 22.x,CI 使用 Node 22)
- npm

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

开发服务器默认启动在 http://localhost:4321

### 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录,可用 `npm run preview` 本地预览。

## 🚢 部署

推到 `main` 分支即自动触发 [GitHub Actions](.github/workflows/deploy.yml):安装依赖 → `npm run build` → 上传 `dist/` → 部署到 GitHub Pages。

也可在 Actions 页面手动触发(`workflow_dispatch`)。

## 📁 项目结构

```
.
├── .github/workflows/deploy.yml  # CI/CD 部署
├── astro.config.mjs              # Astro 配置(site、sitemap、Markdown 插件)
├── package.json
└── src/
    ├── consts.ts                 # 站点配置(标题、菜单、社交、Giscus、友链)
    ├── content/
    │   ├── config.ts             # 文章 frontmatter 校验 schema
    │   └── posts/                # 博客文章,每篇一个 <slug>/index.md
    ├── components/               # Layout、Header、Footer、Toc、Pagination、GiscusComment 等
    ├── layouts/
    │   └── BaseLayout.astro      # 全局布局
    ├── pages/                    # 页面
    │   ├── index.astro           # 首页
    │   ├── [...slug].astro       # 文章详情页
    │   ├── archive/              # 按时间归档
    │   ├── tag/                  # 按标签归档
    │   ├── tags.astro            # 全部标签
    │   ├── links.astro           # 友链
    │   ├── editor.astro          # 在线写作
    │   ├── rss.xml.ts            # RSS 订阅
    │   └── 404.astro
    └── styles/                   # 全局样式 global.scss、图标字体 iconfont.css
```

## ✍️ 写文章

在 `src/content/posts/` 下新建目录 `<slug>/index.md`,frontmatter 格式:

```yaml
---
title: "文章标题"
date: "2026-08-10 12:00:00"
tags: ['coding']
description: "文章描述"
summary: "摘要"
slug: "unique-slug"
---
```

必填字段为 `title`、`date`,其余可选(见 `src/content/config.ts`)。写完 commit 并 push 到 `main` 即自动发布。

也可以直接打开站点上的 `/editor` 页面在线写作(需要仓库的 GitHub PAT)。

## 🎯 可用脚本

- `npm run dev` - 启动开发服务器(端口 4321)
- `npm run build` - 构建生产版本到 `dist/`
- `npm run preview` - 本地预览构建产物

## ⚙️ 站点配置

编辑 `src/consts.ts` 可修改:站点标题与描述、导航菜单、社交链接、Giscus 评论仓库、推荐与友链。

## 🌐 在线访问

项目部署在:[https://yangjinlong86.github.io/](https://yangjinlong86.github.io/)

## 📄 许可证

MIT License
