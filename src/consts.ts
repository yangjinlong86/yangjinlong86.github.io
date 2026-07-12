// 站点配置（从原 src/settings.js 迁移）
export const SITE = {
  title: 'Funny Eagle',
  author: 'Jason Yang',
  description: 'Funny Eagle 技术博客;记录技术成长',
  siteUrl: 'https://yangjinlong86.github.io',
  keywords: ['编程', '音乐', '生活'],
};

export const siteName = 'Funny Eagle';

export const menu = [
  { icon: 'coding', name: '编程', href: '/tag/coding/' },
  { icon: 'music', name: '音乐', href: '/tag/music/' },
  { icon: 'life', name: '生活', href: '/tag/life/' },
  { icon: 'tag', name: '标签', href: '/tags' },
  { icon: 'archive', name: '归档', href: '/archive' },
  { icon: 'person', name: '关于', href: '/about' },
];

export const socialMedia = [
  { icon: 'weibo', href: 'https://weibo.com/227307890' },
  { icon: 'github-fill', href: 'https://github.com/yangjinlong86' },
  { icon: 'twitter', href: 'https://twitter.com/yangjinlong86' },
  { icon: 'rss', href: '/rss.xml' },
];

export const giscusConfig = {
  enabled: true,
  repo: 'yangjinlong86/yangjinlong86.github.io',
  repoId: 'MDEwOlJlcG9zaXRvcnk1NTI1NDYxMg==',
  category: 'Comments',
  categoryId: 'DIC_kwDOA0seVM4CwBGj',
  mapping: 'pathname',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  theme: 'dark',
  lang: 'zh-CN',
  loading: 'lazy',
};

export const recommend = [
  {
    title: 'ECMA-262, 9th edition',
    description: 'ECMAScript 语言规范',
    href: 'https://www.ecma-international.org/ecma-262/9.0/index.html',
    img: 'https://www.ecma-international.org/ecma-262/9.0/img/ecma-logo.svg',
  },
];

export const friends = [
  {
    title: 'FunnyEagle',
    description: '老鹰的博客',
    href: 'https://yangjinlong86.github.io',
    img: '',
  },
];
