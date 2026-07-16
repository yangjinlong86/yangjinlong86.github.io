---
title: "在静态博客里做一个无后端的在线写作功能"
date: "2026-07-16 21:03:03"
tags: ['coding']
description: "这篇博客记录的是 `yangjinlong86.github.io` 这个 Astro 静态站点里 `/editor` 页面的实现:一个纯前端、无后端、只用 GitHub 服务的在线 Markdown 写作与发布工具。写完点一下提交,文章就上线了。"
summary: "这篇博客记录的是 `yangjinlong86.github.io` 这个 Astro 静态站点里 `/editor` 页面的实现:一个纯前端、无后端、只用 GitHub 服务的在线 Markdown 写作与发布工具。写完点一下提交,文章就上线了。"
slug: "post-20260716-211332"
---

## 一、为什么要做这个功能

这个博客是 Astro 构建的静态站,托管在 GitHub Pages,源码在 GitHub 仓库。常规的发文流程是:

1. 本地新建一个 `src/content/posts/<slug>/index.md`
2. 写好 frontmatter 和正文
3. `git commit && git push`
4. GitHub Actions 自动构建并部署到 Pages

这套流程没问题,但有个痛点:**出门在外、只有手机或一台陌生电脑时,想发一篇文章就很麻烦**——要 clone 仓库、装 Node、跑命令。对于一个个人博客,这个门槛有点高。

于是目标变成了:**能不能在站点本身开一个页面,在那里写、在那里发,点一下就上线?**

并且加了一条硬约束:**只用 GitHub 的服务,不引入任何后端,不依赖第三方服务**。这样零成本、零运维,也不会哪天因为某个服务关停而失效。

## 二、核心思路:把"发布"还原成"一次 Git 提交"

GitHub Pages 的发布机制早就配好了——`.github/workflows/deploy.yml` 里写着:

```yaml
on:
  push:
    branches: [main]
```

也就是说,**只要 `main` 上出现一次新 commit,GitHub Actions 就会自动构建并部署**。这是我本来就有的能力。

那"在线发布"本质上是干嘛?**就是让浏览器代替我执行一次 `git commit && git push`**。而 GitHub 提供了一个 REST API 正好干这个——Contents API。它能读写仓库里的文件,每次写入就是一次 commit。

所以整个方案的架构就清晰了:

```
浏览器(/editor 页面)
   │  带上 PAT 调 REST API
   ▼
GitHub Contents API  ──写入文件──▶  产生一次 commit 到 main
   │
   ▼
deploy.yml 被触发  ──构建──▶  发布到 GitHub Pages
```

没有服务器、没有数据库、没有第三方。GitHub 同时扮演了:代码托管、API 后端、CI/CD、静态托管四个角色。

## 三、三种操作:新建、编辑、删除

`/editor` 要支持对文章的增、改、删。GitHub Contents API 对这三种操作的设计很统一,区别只在一个字段:**`sha`**。


| 操作     | HTTP 方法 | 请求体关键字段                            | 成功码 |
| -------- | --------- | ----------------------------------------- | ------ |
| 新建文章 | `PUT`     | `message`, `content`, `branch`            | 201    |
| 编辑文章 | `PUT`     | `message`, `content`, `branch`, **`sha`** | 200    |
| 删除文章 | `DELETE`  | `message`, `branch`, **`sha`**            | 200    |

这里的 `sha` 是文件当前内容的 blob 哈希,**相当于一把乐观锁**:

- **新建**时文件还不存在,不需要 `sha`。
- **编辑/删除**时,必须先 `GET` 这个文件拿到它当前的 `sha`,然后在 `PUT`/`DELETE` 时带上。如果文件在拿到 `sha` 之后被别人改过,GitHub 会返回 `409 Conflict`,提示你重新拉取——这就是乐观锁机制,防止覆盖别人的改动。

对应到三个 API 调用:

```
① 列出全部文章(编辑模式下选文章用)
   GET /repos/{owner}/{repo}/contents/src/content/posts
   → [{ "name": "10-hex-and-binary", "type": "dir" }, ...]
   （每个 slug 是一个子目录,每个目录里有一个 index.md）

② 读取单篇文章内容(拿到 sha + 正文)
   GET /repos/{owner}/{repo}/contents/src/content/posts/{slug}/index.md
   → { "content": "<base64>", "sha": "abc123", ... }

③ 写入(新建或更新)
   PUT /repos/{owner}/{repo}/contents/src/content/posts/{slug}/index.md
   Body: { "message": "post: xxx", "content": "<base64>", "branch": "main", "sha": "..." }
       （带 sha = 更新,不带 = 新建）

④ 删除
   DELETE /repos/{owner}/{repo}/contents/src/content/posts/{slug}/index.md
   Body: { "message": "delete: xxx", "sha": "...", "branch": "main" }
```

文件路径 `src/content/posts/{slug}/index.md` 正好是 Astro content collection 扫描的位置,所以新写入的文件会被下次构建自动收录成博客文章。

## 四、认证:fine-grained PAT,只存在浏览器里

浏览器要调 GitHub API,得证明"我是仓库主人"。OAuth 是常规做法,但它需要一个后端做 token 交换——这就违背了"无后端"约束。

所以选了 **fine-grained Personal Access Token(PAT)**:

- 在 GitHub 设置里生成,只授权**这一个仓库**,权限只给 **Contents: Read and write**,并设置过期时间。
- 浏览器拿这个 PAT 放进请求头:`Authorization: Bearer <token>`。

PAT 存哪?**只存浏览器,绝不写入仓库文件**。代码里给了一个"记住 token"的开关:

```js
// 勾「记住 token」→ localStorage(长期保留,方便下次复用)
// 不勾 → sessionStorage(关掉标签页就失效,更安全)
if ($('gh-remember').checked) localStorage.setItem('gh-token', tok);
else sessionStorage.setItem('gh-token', tok);
```

这样页面虽然是公开的,但**没有 token 的人什么也提交不了**,风险可控。PAT 一旦泄露或过期,在 GitHub 后台一键撤销即可。

## 五、编辑器:Vditor,走 CDN 零依赖

正文编辑用的是 [Vditor](https://github.com/Vanessa219/vditor),一个功能完善的 Markdown 编辑器(工具栏、即时渲染、代码高亮、表格、预览、全屏都有)。关键是它可以通过 CDN 加载,不需要装 npm 包:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vditor@3/dist/index.css" />
<script is:inline src="https://cdn.jsdelivr.net/npm/vditor@3/dist/index.min.js"></script>
```

注意脚本用了 `is:inline`——Astro 默认会把 `<script>` 处理打包,而这里我们只想原样内联、用全局变量 `window.Vditor`,加 `is:inline` 就跳过了 Astro 的打包/类型处理。站点加载百度统计也是这个模式,保持一致。

初始化时有个细节:CDN 脚本可能还没加载完就执行了初始化代码,所以做一个轮询等待:

```js
function initEditor() {
  if (typeof Vditor === 'undefined') { setTimeout(initEditor, 60); return; }
  vd = new Vditor('vditor', {
    mode: 'ir',          // 即时渲染模式:边写边渲染
    height: 480,
    cache: { enable: false },
    toolbar: ['headings','bold','italic','quote','code','inline-code','link','list','outdent','indent','check','table','emoji','line','preview','fullscreen'],
    placeholder: '在这里写下你的文章…',
    preview: { hljs: { lineNumber: true, style: 'github' } },
  });
}
```

## 六、frontmatter:生成要规范,解析要鲁棒

Astro 的文章靠 frontmatter(文件头的 YAML 块)来识别。这个项目的 schema(`src/content/config.ts`)要求:`title` 必填,`date`、`tags`(数组)、`description`、`summary`、`slug` 可选。

### 生成(新建/编辑时)

提交前,把表单里的字段拼成标准 frontmatter,再接上正文:

```js
var fm = '---\n';
fm += 'title: "' + esc(title) + '"\n';
fm += 'date: "' + esc(date) + '"\n';
if (tags.length) fm += 'tags: [' + tags.map(t => "'" + t + "'").join(',') + ']\n';
if (desc) fm += 'description: "' + esc(desc) + '"\n';
if (summary) fm += 'summary: "' + esc(summary) + '"\n';
fm += 'slug: "' + esc(slug) + '"\n';
fm += '---\n\n';
var content = fm + body;
```

`esc()` 会转义双引号、反斜杠和换行,防止标题里的特殊字符把 frontmatter 搞坏(比如标题带引号会导致 YAML 解析失败)。

### 解析(编辑时回填表单)

这里有个坑:**老文章的 frontmatter 格式很不统一**。比如仓库里实际有这样的文章:

```yaml
---
slug: "10-hex-and-binary"
title: 十进制和二进制数值转换      # 没有引号
date: 2019-12-22                  # 纯日期,没有时分秒
tags: ['coding']                  # 单引号数组
description: "..."
---
```

字段顺序不定、有的带引号有的不带、`tags` 写法各异。所以解析器得鲁棒一点:

```js
function parseFrontmatter(md) {
  var m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(md);
  if (!m) return { title:'', date:'', tags:[], description:'', summary:'', slug:'', body: md };
  var fm = {};
  m[1].split(/\r?\n/).forEach(function (line) {
    var idx = line.indexOf(':');
    if (idx < 0) return;
    fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  });
  return {
    title: unquote(fm.title), date: unquote(fm.date),
    tags: parseTags(fm.tags),        // 兼容 ['a','b'] / ["a","b"] / [] 
    description: unquote(fm.description), summary: unquote(fm.summary),
    slug: unquote(fm.slug), body: m[2],
  };
}
```

`unquote()` 去掉值两端可能有的单/双引号,`parseTags()` 把 `['coding','arts']` 这种字符串拆成数组。解析完回填到表单,让作者**肉眼核对一遍**再提交——这是防错兜底。

## 七、UTF-8 安全的 Base64

GitHub Contents API 要求文件内容以 Base64 传输。中文直接 `btoa()` 会报错(它只能处理 Latin1),所以要用经典的 UTF-8 安全写法:

```js
// 编码(提交时)
function b64(str) { return btoa(unescape(encodeURIComponent(str))); }

// 解码(编辑时加载文章)
function unb64(b) { return decodeURIComponent(escape(atob(String(b).replace(/\s/g, '')))); }
```

解码那行还顺手 `replace(/\s/g, '')` 去掉空白——因为 GitHub 返回的 base64 有时会带换行,部分浏览器的 `atob` 不接受换行,先清掉更稳。

## 八、UI:新建 / 编辑两种模式

页面顶部两个 tab:`[新建] [编辑]`。

- **新建模式**:填表单 + 写正文 + 提交。slug 留空会自动生成 `post-YYYYMMDD-HHMMSS`。
- **编辑模式**:
  1. 点「加载文章列表」→ GET posts 目录 → 填充下拉框(按字母序列出所有 slug)
  2. 选一篇 → GET 文件 → base64 解码 → frontmatter 解析 → 回填表单,正文灌进 Vditor
  3. **slug 字段锁定只读**(改 slug 等于新建另一篇,语义不同)
  4. 两个动作:「提交并发布」(PUT 带 sha 更新)或「删除此文章」(DELETE 带 sha,带二次确认)

切换模式时会清空表单和当前持有的 `sha`,避免串状态。编辑提交成功后,用返回的新 `sha` 覆盖旧的,这样可以**连续改、连续提交**而不用每次重新加载。

## 九、端到端走一遍

**新建一篇**:

1. 打开 `/editor`,在「GitHub 凭证」折叠面板里填 PAT(可选「测试连接」验证一下),填好标题/标签等,在 Vditor 里写正文。
2. 点「提交并发布」→ 前端拼好 `frontmatter + 正文`,UTF-8 安全 base64 编码。
3. `PUT /contents/src/content/posts/{slug}/index.md` → 产生一次 commit 到 `main`。
4. `deploy.yml` 被触发 → 构建部署 → 约 1–2 分钟后文章上线。

**编辑一篇**:

1. 切到「编辑」模式 →「加载文章列表」→ 下拉选一篇。
2. 改正文或元信息 →「提交并发布」→ `PUT` 带上之前 GET 到的 `sha` → 更新。
3. 如果期间文件被改过,返回 `409`,页面提示重新加载。

**删除一篇**:

1. 编辑模式加载一篇文章 → 点「删除此文章」→ 浏览器弹确认框(不可逆操作)。
2. 确认后 `DELETE` 带 `sha` → 文件从仓库删除 → 触发发布 → 文章从站点消失。

## 十、错误处理

每种 API 错误都对应一个明确提示,不让用户对着状态码发懵:


| HTTP 状态 | 含义                         | 处理                            |
| --------- | ---------------------------- | ------------------------------- |
| 201/200   | 成功                         | 显示 commit 链接 + Actions 链接 |
| 422       | 新建时 slug 已存在           | "该 slug 已存在,请换一个"       |
| 409       | sha 过期(文件被改过)         | "请重新加载文章再提交"          |
| 401/403   | token 无效或权限不足         | "需 Contents: Read and write"   |
| 404       | owner/repo 不对 / 文章不存在 | 对应提示                        |

## 十一、安全考量

把 PAT 放在浏览器端,是这套方案最大的权衡。缓解措施:

1. **最小权限**:用 fine-grained PAT,只授权目标仓库的 Contents 读写,不碰其它任何东西。
2. **设过期时间**:即便泄露,窗口也有限。
3. **可撤销**:一旦怀疑泄露,GitHub 后台一键删除。
4. **存储分级**:不勾「记住 token」时只放 sessionStorage,关页即失效。
5. **删除二次确认**:DELETE 不可逆,`confirm()` 兜底,防止误触。
6. **页面公开但空转**:没有 token 的人打开 `/editor` 也提交不了任何东西。

权衡的结论是:对于一个个人博客,这个风险是可以接受的——换来了"零后端、零成本、零运维"的在线写作能力。

## 十二、实现规模

整套功能**只新增了一个文件** `src/pages/editor.astro`,没有碰 `deploy.yml`、没有碰 `content/config.ts`、没有加任何 npm 依赖(Vditor 走 CDN)。这一个文件里包含:页面结构(HTML)、交互逻辑(内联 JS)、样式(scoped CSS)三部分。

权限要求也始终只是 **Contents: Read and write**,GET 列目录、读文件、PUT/DELETE 都被这一个权限覆盖。

## 十三、总结

这个功能的核心洞察是:**"发布"在底层就是"一次 Git 提交",而 GitHub 提供了 REST API 让你直接做这件事**。一旦想通这一点,剩下的就是工程实现:

- 用 **Contents API** 的 `PUT`/`DELETE`(带 `sha`)实现增删改;
- 用 **fine-grained PAT** 做认证,只存浏览器;
- 用 **Vditor**(CDN)做编辑器,零依赖;
- 复用已有的 **deploy.yml** 做发布。

最终得到一个完全跑在 GitHub 服务上的在线写作工具:打开网页、写、提交,文章就上线了。出门在外用手机也能发文,这正是当初想做它的全部理由。
