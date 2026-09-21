import {defineField, defineType} from 'sanity'

export const projectImage = defineType({
  name: 'projectImage',
  title: 'Project Image',
  type: 'object',
  fields: [
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'migrationSourcePath', title: 'Imported Source File', type: 'string', readOnly: true,
      description: 'Original local file reference. Upload this file into Image; this reference prevents migration data from being lost.',
    }),
    defineField({name: 'altEn', title: 'Image Alt Text — English', type: 'string', description: 'A short description for accessibility.'}),
    defineField({name: 'altZh', title: 'Image Alt Text — Chinese', type: 'string'}),
    defineField({name: 'captionEn', title: 'Caption — English', type: 'string'}),
    defineField({name: 'captionZh', title: 'Caption — Chinese', type: 'string'}),
    defineField({
      name: 'layoutMode', title: 'Image Layout', type: 'string', initialValue: 'AUTO',
      description: 'AUTO reads the image proportions. Choose another option only when you want to override it.',
      options: {layout: 'radio', list: [
        {title: 'AUTO — choose from image proportions', value: 'AUTO'},
        {title: 'WIDE — full editorial row', value: 'WIDE'},
        {title: 'STANDARD — regular landscape placement', value: 'STANDARD'},
        {title: 'PORTRAIT — narrower vertical placement', value: 'PORTRAIT'},
      ]},
      validation: rule => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'altEn', subtitle: 'layoutMode', media: 'image'},
    prepare: ({title, subtitle, media}) => ({title: title || 'Untitled image', subtitle: subtitle || 'AUTO', media}),
  },
})
