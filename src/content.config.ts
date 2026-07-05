// src/content.config.ts
// Content collection for the SEO guide pages authored as Markdown in ./content/.
// The glob loader reads from the repo-root ./content dir (kept there deliberately
// so the Markdown source is editable outside src/). `_index.md` is the cluster
// map, not a page — the [^_] prefix in the pattern excludes it.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: './content' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    target_keyword: z.string(),
    secondary_keywords: z.array(z.string()).default([]),
    search_intent: z.string().optional(),
    word_count: z.number().optional(),
    last_updated: z.coerce.date().optional(),
    evergreen: z.boolean().default(true),
  }),
});

export const collections = { guides };
