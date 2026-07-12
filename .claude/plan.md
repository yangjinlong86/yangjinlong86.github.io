# Gatsby → Astro 全面迁移方案

## 一、目标
将博客从 Gatsby 5 迁移到 Astro，保留：150 篇文章、黑客风格主题（代码雨/网格/脉冲）、sakura 动效、giscus 评论、RSS、sitemap、标签/归档分页、TOC 滚动高亮、SEO meta、百度统计。解决 Gatsby 框架已进维护模式的问题，获得零 JS 默认、Vite 构建、活跃维护。

## 二、新项目结构
```
/
├── astro.config.mjs          # integrations: rss, sitemap, mdx, sass
├── package.json              # astro + @astrojs/{rss,sitemap,mdx} + sass + remark/rehype 插件
├── src/
│   ├── content/posts/        # 150 篇 markdown（从 src/pages 迁移，保留子目录+图片）
│   │   └── config.ts         # collection schema: title/date/tags/slug/description/summary
│   ├── layouts/BaseLayout.astro   # <head> + 骨架（替代 html.js）
│   ├── components/           # 全部 .astro + <script>
│   │   ├── Layout.astro      # 侧边栏+主内容+页脚+菜单toggle（替代 layout.js）
│   │   ├── HackerBackground.astro  # 代码雨/网格/脉冲
│   │   ├── Menu.astro, Pagination.astro, PostInfo.astro
│   │   ├── Toc.astro         # 目录 + 滚动高亮 script
│   │   ├── GiscusComment.astro
│   │   └── Seo.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── [...slug].astro   # 文章页 getStaticPaths
│   │   ├── archive/[page].astro      # 归档分页（按年分组）
│   │   ├── tag/[tag]/[page].astro    # 标签分页
│   │   ├── tags.astro, links.astro, about.astro, 404.astro
│   │   └── rss.xml.ts        # RSS
│   ├── styles/              # 19 个 scss（从 src/css 迁移）
│   └── consts.ts            # siteName/socialMedia/menu/giscusConfig（从 settings.js）
├── public/                  # static/ 迁移（favicon/iconfont/webmanifest/robots/baidu_verify）
└── .github/workflows/deploy.yml  # 改 astro build + dist
```

## 三、关键映射

| Gatsby | Astro |
|---|---|
| src/pages/*/index.md | src/content/posts/*/index.md (content collection) |
| gatsby-node createPages 文章页 | [...slug].astro + getStaticPaths |
| 归档分页 /archive | archive/[page].astro + paginate() |
| 标签分页 /tag/x | tag/[tag]/[page].astro + paginate() |
| GraphQL allMarkdownRemark | getCollection('posts') |
| markdownRemark.html + tableOfContents | <Content /> + remark-toc / Astro headings |
| layout.js (React class) | Layout.astro + 原生 <script> |
| HackerBackground 代码雨 | HackerBackground.astro + <script> |
| GiscusComment.js | GiscusComment.astro |
| seo.js | Seo.astro |
| html.js <head> | BaseLayout.astro <head> |
| gatsby-plugin-feed | @astrojs/rss |
| gatsby-plugin-sitemap | @astrojs/sitemap |
| gatsby-remark-prismjs | remark-prism（保留 prism-dark.scss）|
| gatsby-remark-katex | remark-math + rehype-katex |
| gatsby-remark-autolink-headers | remark-autolink-headings |
| gatsby-remark-images / ImageSharp | astro:assets（自动优化）|

## 四、技术决策
1. **不用 React**：全部 .astro + 原生 `<script>`。现有交互（菜单 toggle/搜索/代码雨/giscus/toc 滚动）都能原生实现，零 JS 默认更轻量，去掉 react/@deckdeckgo 依赖。
2. **代码高亮**：第一版保留 prism（remark-prism + 现有 prism-dark.scss），保证视觉与原站一致；去掉 deckdeckgo/highlight-code。后续可选换 shiki。
3. **内容**：Content Collections，frontmatter 加 zod schema 校验；图片 co-locate（content/posts/<slug>/xxx.jpg，markdown 相对路径自动处理）。
4. **包管理器**：npm（CI 简单，配 package-lock.json）。
5. **部署**：`astro build` -> `dist`，deploy-pages path: dist。

## 五、迁移步骤
1. 初始化 Astro：装 astro + @astrojs/{rss,sitemap,mdx,sass} + remark/rehype 插件，写 astro.config.mjs（site=yangjinlong86.github.io, integrations, markdown 配置）
2. 建 content collection：src/content/posts/config.ts (schema) + 脚本迁移 150 篇（src/pages/<slug>/index.md+图片 -> src/content/posts/<slug>/）
3. 迁移样式：src/css/*.scss -> src/styles/，BaseLayout 引 global.scss
4. 迁移静态资源：static/* -> public/*
5. 写 BaseLayout.astro：移植 html.js 的 <head>（百度统计/katex CSS/Google Fonts/icons/baidu验证/theme脚本）+ layout 骨架（设 dark-theme class）
6. 写组件 .astro：Layout（侧边栏+主内容+页脚+菜单toggle）、HackerBackground（代码雨 script）、Menu、Pagination、PostInfo、Toc（+滚动高亮 script）、GiscusComment、Seo
7. 写页面/路由：[...slug].astro（文章+上下篇+TOC+评论）、archive/[page].astro（按年分组+分页）、tag/[tag]/[page].astro、index.astro、tags.astro、links.astro、about.astro、404.astro
8. 配置 markdown：remarkPlugins（autolink-headings, math）、rehypePlugins（katex）、prism 主题、gfm
9. 配置 RSS（rss.xml.ts）、sitemap、gtag
10. 写 consts.ts（从 settings.js 迁移配置）
11. 更新 .github/workflows/deploy.yml：npm ci + astro build + upload dist
12. build 测试 + astro dev 预览 + 对比关键页面（首页/文章/标签/归档）样式与功能
13. 删除 Gatsby 文件：gatsby-*.js、src/templates/、src/html.js、src/hooks/、create-post.js、gatsby-browser.js、package.json 的 gatsby 依赖
14. 提交推送，CI 部署

## 六、风险与应对
- **150 篇图片相对路径**：content collection co-locate assets，markdown ![](./x.jpg) 自动解析；先迁 1 篇验证再批量。
- **prism 主题差异**：保留 prism-dark.scss + remark-prism，视觉一致；deckdeckgo 去掉。
- **动效 JS（代码雨/樱花/网格）**：HackerBackground.astro <script> 移植原 JS，实测。
- **TOC 滚动高亮**：blog-post.js 的 scroll 逻辑移植到 Toc.astro <script>。
- **SEO meta**：Seo.astro 还原 seo.js（title/desc/keywords/OG/Twitter/canonical）。
- **dark-theme class**：BaseLayout 设 document.documentElement.className='dark-theme'（global.scss 依赖）。
- **分步验证**：先内容+基础布局能 build，再加路由，逐步调试样式。

## 七、工作量
~4-5 天（含样式细调）。最大块：组件 .astro 重写 + 样式还原。

## 八、验证
- `astro build` 成功，dist 生成
- 本地 `astro dev` 预览：首页/文章/标签/归档/404
- 对比原站视觉（黑客风格、代码雨、代码高亮、TOC、分页）
- rss.xml / sitemap-index.xml 生成
- 部署到 GitHub Pages，访问 yangjinlong86.github.io 验证
