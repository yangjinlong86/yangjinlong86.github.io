import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';

export async function GET(context: { site?: URL }) {
  const posts = (await getCollection('posts'))
    .sort((a, b) => b.data.date.localeCompare(a.data.date))
    .slice(0, 8);
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site || SITE.siteUrl,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: new Date(p.data.date.replace(' ', 'T')),
      description: p.data.description || '',
      link: `/${p.slug}/`,
    })),
  });
}
