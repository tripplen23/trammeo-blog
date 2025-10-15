import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schema';

export default defineConfig({
  name: 'default',
  title: 'Personal Blog',
  
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  
  basePath: '/studio',
  
  // @ts-ignore - version conflict between sanity packages
  plugins: [structureTool(), visionTool()],
  
  schema: {
    types: schemaTypes,
  },
});

