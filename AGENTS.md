# AGENTS.md

Personal blog built with **Astro 5** (static output to `dist/`), deployed to GitHub Pages via Actions. Content is Markdown + frontmatter. The whole site is Chinese-language.

## Commands

- `npm run dev` — dev server (port 4321)
- `npm run build` — production build to `dist/`; this is the only verification step (no tests/lint/typecheck scripts)
- Requires Node >= 20.19 (CI uses Node 22). `.npmrc` already routes sharp/sass binaries via npmmirror.

## Deploy flow

Push to `main` → `.github/workflows/deploy.yml` runs `npm install && npm run build`, uploads `dist/`, deploys to GitHub Pages. No manual deploy step.

Git/network gotchas (verified on this machine):
- No stored git credentials. Push with a PAT: `git push "https://x-access-token:<PAT>@github.com/yangjinlong86/yangjinlong86.github.io.git" HEAD:main`
- If connections fail (github, jsdelivr, webfetch), retry with `https_proxy=http://127.0.0.1:10808 http_proxy=http://127.0.0.1:10808` prefixed.
- Never write tokens into repo files.

## Adding a post

New post = directory `src/content/posts/<slug>/index.md`. Schema in `src/content/config.ts`: `title` and `date` required; `tags` array; `description`/`summary`/`slug` optional. Date format: `"YYYY-MM-DD HH:MM:SS"`.

- Frontmatter YAML gotcha: do NOT use ASCII `"` inside a double-quoted field value (e.g. quoting a term in `description`) — it breaks the build with a js-yaml parse error. Use `「」` instead.
- Translated posts: open with a blockquote citing the original URL, author, and "本文是 ... 的中文翻译" notice (see `how-do-we-stop-vibe-coding/index.md`).
- Commit messages use prefixes: `post:` (new article), `update:` (titles/fixes), `style:` (CSS), `docs:`.

## Architecture

- `src/consts.ts` — site config: `SITE` metadata, `menu`, `socialMedia`, `giscusConfig` (comment theme etc.), `recommend`, `friends`. Most content/theme switches live here.
- `src/styles/global.scss` — global styles incl. font sizes (`body` 16px; h1 2em, h2 1.65em, h3 1.35em) and per-page styles. Site is light-themed; KaTeX CSS is loaded in `src/layouts/BaseLayout.astro`.
- Markdown pipeline: `remark-math` + `rehype-katex`, GFM, Shiki highlighting (config in `astro.config.mjs`).
- Pages: `index`, `[...slug]` (post detail), `archive`, `tag`, `tags`, `links`, `editor`, `rss.xml.ts`, `404`.
- `/editor` is a no-backend online writer: browser calls GitHub Contents API with a fine-grained PAT to commit posts straight to `main`. Its scripts are intentionally `is:inline` and load Vditor from CDN — keep them inline when editing `src/pages/editor.astro`.
- Giscus comments (`src/components/GiscusComment.astro`) use `giscusConfig` from `consts.ts`.

## Out of date

`.claude/plan.md` describes the original `/editor` plan (new-post-only) and no longer reflects current behavior — do not treat it as authoritative.
