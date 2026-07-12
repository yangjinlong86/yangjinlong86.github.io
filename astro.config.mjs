import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: 'https://yangjinlong86.github.io',
  integrations: [sitemap()],
  markdown: {
    // 用 prism 代码高亮，配原站的 prism-dark.scss 主题，保持视觉一致
    syntaxHighlight: 'prism',
    gfm: true,
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
