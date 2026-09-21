import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'replace-me'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Yuchen Zhong Portfolio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) => S.list()
        .title('Selected Work')
        .items([
          S.listItem().title('Projects').child(S.documentTypeList('project').title('Projects')),
          S.listItem().title('Categories').child(S.documentTypeList('category').title('Categories')),
        ]),
    }),
    visionTool(),
  ],
  schema: {types: schemaTypes},
  // Sanity's built-in Publish, Unpublish, Duplicate and Delete actions remain enabled.
})

