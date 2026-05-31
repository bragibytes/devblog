import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200, "Description should be 200 characters or less for good SEO"),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Future-proofing — easy to add later:
    // series: z.string().optional(),
    // heroImage: image().optional(),
  }),
});

export const collections = {
  blog,
};
