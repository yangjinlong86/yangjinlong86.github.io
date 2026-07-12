import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.union([z.string(), z.date()]).transform((d) => {
      if (typeof d === 'string') return d;
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    summary: z.string().optional(),
    slug: z.string().optional(),
  }),
});

export const collections = { posts };
