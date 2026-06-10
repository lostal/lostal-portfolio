import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      order: z.number(),
      image: image(),
      imageAlt: z.string(),
      liveUrl: z.url(),
      repoUrl: z.url(),
      technologies: z.array(
        z.object({
          name: z.string(),
          icon: z.string(),
        })
      ),
      translations: z.object({
        es: z.object({
          title: z.string(),
          description: z.string(),
          preview: z.string(),
        }),
        en: z.object({
          title: z.string(),
          description: z.string(),
          preview: z.string(),
        }),
      }),
    }),
});

export const collections = {
  projects: projectsCollection,
};
