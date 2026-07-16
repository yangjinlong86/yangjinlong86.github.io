---
title: "浏览器直接调 GitHub REST API 把文章 commit 到仓库"
date: "2026-07-16 21:03:03"
tags: ['coding']
description: "▎ 浏览器拿你的 PAT,调 GitHub Contents API 把 frontmatter + 正文 编码成 base64 PUT 成一个新文件 → 触发 main 上的 deploy workflow → ▎ 自动构建发布。"
summary: "▎ 浏览器拿你的 PAT,调 GitHub Contents API 把 frontmatter + 正文 编码成 base64 PUT 成一个新文件 → 触发 main 上的 deploy workflow → ▎ 自动构建发布。"
slug: "post-20260716-211332"
---

/editor 页面的核心思路是:纯前端、无后端,浏览器直接调 GitHub REST API 把文章 commit 到仓库,再靠已有的 GitHub Actions
自动构建发布。下面分层解释。

1. 它是怎么"发布"的

关键在于复用现有链路,不新增任何发布机制:

浏览器 PUT GitHub Contents API  →  产生一次 commit 到 main  →  触发 deploy.yml  →  构建 + 部署到 Pages

deploy.yml 本来就配置了 on: push: branches: [main],所以只要 main 上有新 commit,就会自动构建发布。编辑器只是"制造一次
commit"而已,跟你在本地 git push 效果一样。

2. 页面结构(src/pages/editor.astro)

复用站点布局约定(和 tags.astro 一致),分四块:

<BaseLayout title="写作" pathname="/editor">
    <Layout>
      ① <details> 凭证与仓库设置   PAT / owner / repo / branch / 记住token / 测试连接
      ② <div class="meta">          文章元信息  title / slug / date / tags / desc / summary
      ③ <div id="vditor">           Vditor 编辑器(CDN 加载)
      ④ <div class="actions">       提交按钮 + 状态显示
    </Layout>
  </BaseLayout>

所有 JS 用 is:inline 直接内联(和站点加载百度统计一个模式),不经过 Astro 打包/类型处理,因此 Vditor 走 CDN 全局变量 window.Vditor
就能直接用,不加任何 npm 依赖。

3. Vditor 编辑器(CDN)

<link rel="stylesheet" href=".../vditor@3/dist/index.css" />
  <script is:inline src=".../vditor@3/dist/index.min.js"></script>

初始化时做了容错——CDN 脚本可能还没加载完,就轮询等待:

function initEditor() {
if (typeof Vditor === 'undefined') { setTimeout(initEditor, 60); return; }
vd = new Vditor('vditor', { mode: 'ir', toolbar: [...], cache: { enable: false }, ... });
}

mode: 'ir' 是即时渲染模式(边写边渲染),工具栏含标题/粗斜体/引用/代码/链接/表格/预览/全屏等。

4. 凭证管理(PAT 存浏览器)

PAT 是 fine-grained Personal Access Token,只授权本仓库的 Contents: Read and write。token 永远不进仓库文件,只存在浏览器:

// 勾"记住 token" → localStorage(长期);不勾 → sessionStorage(关页即失效)
if ($('gh-remember').checked) localStorage.setItem('gh-token', tok);
else sessionStorage.setItem('gh-token', tok);

owner/repo/branch 等非敏感设置存 localStorage 供下次复用。「测试连接」按钮先 GET /repos/{owner}/{repo} 验证 token
和仓库是否对得上,再让你正式提交。

5. 提交逻辑(核心)

点「提交并发布」时:

① 拼 frontmatter(对齐 src/content/config.ts 的 schema):

var fm = '---\n';
fm += 'title: "' + esc(title) + '"\n';
fm += 'date: "' + esc(date) + '"\n';
if (tags.length) fm += 'tags: [...]';
fm += 'slug: "' + esc(slug) + '"\n';
fm += '---\n\n';
var content = fm + body;

- slug 留空时自动生成 post-YYYYMMDD-HHMMSS
- 日期默认当前时间
- esc() 转义双引号、反斜杠、换行,防止 frontmatter 注入

② UTF-8 安全的 base64(因为中文直接 btoa 会报错):

function b64(str) { return btoa(unescape(encodeURIComponent(str))); }

③ 调 Contents API 写文件:

PUT https://api.github.com/repos/{owner}/{repo}/contents/src/content/posts/{slug}/index.md
Headers: Authorization: Bearer <token>, X-GitHub-Api-Version: 2022-11-28, ...
Body: { "message": "post: <title>", "content": "<base64>", "branch": "main" }

这等价于 git add src/content/posts/<slug>/index.md && git commit。文件路径 posts/<slug>/index.md 正是站点 content collection
扫描的位置,所以构建时会被自动收录成文章。

④ 按状态码给反馈:

- 200 → 显示 commit 链接 + Actions 链接,提示"约 1–2 分钟后发布完成"
- 422 → slug 已存在,让你换一个
- 401/403 → token 无效或权限不足
- 404 → owner/repo 不对

6. 为什么能这样设计

GitHub Contents API 允许用 PAT 直接读写仓库,不需要 OAuth 后端代理。这正好满足约束"只用 GitHub 服务、无后端":

- Pages 托管静态站点
- Actions 自动构建
- REST API 接收提交

代价是 PAT 暴露在浏览器端——所以要求用 fine-grained PAT、仅授权单个仓库的 Contents 权限、设过期时间。页面虽公开,但没有 token
就无法提交,风险可控。

总结一句话

▎ 浏览器拿你的 PAT,调 GitHub Contents API 把 frontmatter + 正文 编码成 base64 PUT 成一个新文件 → 触发 main 上的 deploy workflow →
▎ 自动构建发布。

整个过程没碰 deploy.yml、没碰 content/config.ts、没加依赖,只新增了一个 editor.astro 静态页面。
