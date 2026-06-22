import { defineCollection, z } from "astro:content";
import { docsSchema } from "@astrojs/starlight/schema";

const docs = defineCollection({
  schema: docsSchema({
    extend: z.object({
      emoji: z.string().optional(),
    }),
  }),
});

export const collections = { docs };
