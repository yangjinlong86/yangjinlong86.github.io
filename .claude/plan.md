# 切换为 Astro 官方 blog 模板主题（保留全部现有功能）

## 目标
把当前「黑客暗色风格」(代码雨/绿色霓虹/Orbitron 字体/侧边栏) 换成 **Astro 官方 blog 模板** (`npm create astro -- --template blog`) 的清爽默认外观：浅色 Bear Blog 风、Atkinson Hyperlegible 字体、顶部导航栏、720px 居中正文、Shiki 默认代码高亮。

**保留所有现有功能**：归档分页、标签分页、giscus 评论、TOC、RSS、SEO meta、百度统计、KaTeX 数学公式、菜单、社交链接、150 篇文章与路由。

参考来源：已下载官方模板到 `/tmp/astro-blog-ref`（global.css / Header / Footer / BaseHead / FormattedDate / BlogPost / blog/index 等）。

## 关键设计决策
1. **布局由「侧边栏」改为「顶部 Header + 居中 main + Footer」**（对齐模板）。
2. **字体**：Orbitron/Rajdhani → Atkinson Hyperlegible（经 Google Fonts `<link>` 引入；当前 Astro 5 不支持模板里 v7 的 experimental `fonts` API）。
3. **代码高亮**：`prism` + `prism-dark.scss` → Shiki 默认（删 `syntaxHighlight: 'prism'`，得到官方默认深色代码块 on 浅色页面）。
4. **导航**：顶部导航用文字链接（编程/音乐/生活/标签/归档/关于）+ active 下划线；社交图标沿用现有 iconfont。
5. **TOC**：原侧边栏 TOC 改为正文右侧 sticky 面板（宽屏）/ 折叠 `<details>`（窄屏），保留滚动高亮脚本。
6. **移除元素**：代码雨背景、樱花/脉冲动画、`dark-theme` class、`#pageName` 角标、侧边栏内搜索框（官方模板无搜索；属 UI 装饰非核心功能）。
7. **日期**：沿用现有日期字符串展示（避免 Date 解析/时区问题），仅改样式。
8. **包**：移除 `prismjs`；保留 `sass`（global.scss 仍用）。

## 改动清单

### 1. `astro.config.mjs`
- 删 `syntaxHighlight: 'prism'`（恢复 Shiki 默认）。保留 site / sitemap / remark-math / rehype-katex / gfm。

### 2. 样式 `src/styles/`
- 重写 `global.scss`：以官方 `global.css`（Bear Blog 风）为基底 —— CSS 变量 `--accent #2337ff` / `--black` / `--gray*` / `--gray-gradient` / `--box-shadow`；body 浅色渐变、font-size 20px/line-height 1.7；`main` 720px 居中；h1-h6、a、code、pre、blockquote、table、img、hr 样式；`.sr-only`。追加少量共享样式（归档列表、标签云、分页、TOC、prose 微调）。
- 删除黑客专用分片：`hacker-animate.scss`、`sakura.animate.scss`、`sakura.base.scss`、`prism-dark.scss`、`prism-light.scss`、`boxes.scss`、`balloon.scss`、`title.scss`、`iconfont-old.css`。
- 保留 `iconfont.css`（社交/可能用到的图标）。其余（toc/blockquote/list/tag/link/menu/mobile/comment）样式并入 global 或移到组件 scoped `<style>`。

### 3. `src/layouts/BaseLayout.astro`
- `<html>` 去 `class="dark-theme"`，保持 `lang="zh-CN"`。
- `<head>` 保留：charset / viewport / format-detection / baidu-site-verification / theme-color(改浅色) / canonical(由 pathname) / keywords / description / OG / Twitter / title / apple-touch-icon / favicon / manifest / katex CSS / 百度统计脚本。
- Google Fonts：Orbitron+Rajdhani → Atkinson Hyperlegible。
- 引入 `global.scss`。
- body `<slot />`（Header/main/Footer 由 Layout 提供）。

### 4. `src/components/Layout.astro`（重写）
结构：`<Header /> <main><slot /></main> <Footer />`。移除 HackerBackground、aside 侧边栏、menu-toggle、搜索框脚本。

### 5. 新增 `src/components/Header.astro`
顶部白色导航栏（box-shadow）：站点名链接 `/` + `menu` 文字导航（带 active 检测，仿模板 HeaderLink）+ 右侧 `socialMedia` iconfont 图标。窄屏隐藏社交。

### 6. 新增 `src/components/Footer.astro`
灰色渐变页脚：© 年份 yangjinlong86.github.io • Powered by Astro + 社交图标。

### 7. 组件重样式
- `PostInfo.astro`：日期 + `#tag` 链接，浅色配色。
- `Pagination.astro`：朴素文字链接（上一页 / x / y / 下一页），去绿色按钮。
- `Toc.astro`：保留滚动高亮脚本；样式改浅色；布局由 post 页放入右侧 sticky（见下）。
- `GiscusComment.astro`：不动（giscus 脚本本身）。
- 删 `HackerBackground.astro`、`Menu.astro`（导航已并入 Header）。

### 8. 页面调整（保留逻辑，改 markup/class）
- `index.astro`（首页）：保留按年倒序列表；`.css-archive` 改朴素列表（日期 + 标题链接），year-title 浅色。
- `[...slug].astro`（文章）：`<h1>` + PostInfo + `<div class="prose">Content</div>` + TOC（右侧 sticky/折叠）+ 上一篇/下一篇 + GiscusComment。去掉 `.css-post-main` 暗盒。
- `archive/index.astro`、`archive/[page].astro`：列表重样式。
- `tag/[tag]/index.astro`、`tag/[tag]/[page].astro`：`.list-item/.list-title/.list-excerpt` 重样式。
- `tags.astro`：标签云重样式。
- `links.astro`：`.link-card` 重样式。
- `404.astro`：微调。
- `rss.xml.ts`：不动。

### 9. 依赖
- `package.json` 移除 `prismjs`（`yarn remove prismjs`）。

## 验证
1. `yarn build` 成功，188 页生成。
2. `yarn dev` 本地预览：首页 / 文章 / 标签 / 归档 / 404 / rss.xml / sitemap。
3. 视觉：浅色主题、无代码雨、Atkinson 字体、Shiki 代码块、顶部导航 active 态、TOC、giscus、分页、数学公式（katex）正常。
4. 确认无残留 `dark-theme`/`//` 链接/绿色变量。

## 不在范围
- 不升级 Astro 5→7（风险大、非本次目标）。
- 不改文章内容/frontmatter（除上次已修的 slug/年份排序）。
- 不动 RSS/sitemap/giscus 配置逻辑。
