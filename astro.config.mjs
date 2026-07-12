import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: 'https://yangjinlong86.github.io',
  integrations: [sitemap()],
  markdown: {
    // Shiki 默认代码高亮（Astro 官方 blog 模板默认），github-dark 主题
    gfm: true,
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
