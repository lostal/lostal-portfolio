import { defineCollection, z } from 'astro:content';

/**
 * Esquema de validación para la colección de proyectos
 * Cada proyecto incluye sus propias traducciones (es/en)
 * Las imágenes se procesan automáticamente con astro:assets
 */
const projectsCollection = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      order: z.number(),
      image: image(),
      imageAlt: z.string(),
      liveUrl: z.string().url(),
      repoUrl: z.string().url(),
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
