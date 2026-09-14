import { schemaTypes } from '@/sanity/schemaTypes';
import { defineConfig, isDev } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { media } from 'sanity-plugin-media';

import { deskStructure } from './deskStructure';

import './custom.css';

export default defineConfig({
  name: 'default',
  title: 'Shamrock Hills Golf Club',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: isDev
    ? [
        structureTool({
          title: 'Content',
          structure: deskStructure,
        }),
        media(),
        visionTool(),
      ]
    : [
        structureTool({
          title: 'Content',
          structure: deskStructure,
        }),
        media(),
      ],

  releases: {
    enabled: false,
  },
  tasks: {
    enabled: false,
  },
  scheduledPublishing: {
    enabled: false,
  },
  document: {
    comments: {
      enabled: false,
    },
  },
  schema: {
    types: schemaTypes,
  },
});
