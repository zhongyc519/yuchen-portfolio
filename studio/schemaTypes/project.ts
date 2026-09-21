import {defineArrayMember, defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    {name: 'essentials', title: 'Project Essentials', default: true},
    {name: 'story', title: 'Project Story'},
    {name: 'media', title: 'Cover & Sections'},
    {name: 'publishing', title: 'Order & Visibility'},
  ],
  fields: [
    defineField({name: 'titleEn', title: 'Project Title — English', type: 'string', group: 'essentials', validation: rule => rule.required()}),
    defineField({name: 'titleZh', title: 'Project Title — Chinese', type: 'string', group: 'essentials', validation: rule => rule.required()}),
    defineField({name: 'slug', title: 'Project URL Slug', type: 'slug', group: 'essentials', options: {source: 'titleEn'}, validation: rule => rule.required()}),
    defineField({name: 'summaryEn', title: 'Project Summary — English', type: 'text', rows: 3, group: 'story'}),
    defineField({name: 'summaryZh', title: 'Project Summary — Chinese', type: 'text', rows: 3, group: 'story'}),
    defineField({name: 'tagEn', title: 'Project Tag — English', type: 'string', group: 'essentials'}),
    defineField({name: 'tagZh', title: 'Project Tag — Chinese', type: 'string', group: 'essentials'}),
    defineField({name: 'year', title: 'Year', type: 'string', group: 'essentials'}),
    defineField({name: 'clientLabel', title: 'Client / Project Label', type: 'string', group: 'essentials'}),
    defineField({name: 'roleEn', title: 'My Contribution — English', type: 'text', rows: 3, group: 'story'}),
    defineField({name: 'roleZh', title: 'My Contribution — Chinese', type: 'text', rows: 3, group: 'story'}),
    defineField({name: 'category', title: 'Category', type: 'reference', to: [{type: 'category'}], group: 'essentials', validation: rule => rule.required()}),
    defineField({
      name: 'coverImage', title: 'Cover Image', type: 'image', group: 'media', options: {hotspot: true},
      fields: [
        defineField({name: 'altEn', title: 'Cover Alt Text — English', type: 'string'}),
        defineField({name: 'altZh', title: 'Cover Alt Text — Chinese', type: 'string'}),
      ],
    }),
    defineField({
      name: 'legacyCoverPath', title: 'Imported Cover File', type: 'string', group: 'media', readOnly: true,
      description: 'Original local file reference from the website migration. Upload this file into Cover Image, then leave this reference for traceability.',
    }),
    defineField({name: 'featured', title: 'Featured Project', type: 'boolean', initialValue: false, group: 'publishing'}),
    defineField({name: 'collection', title: 'Collection in Progress', type: 'boolean', initialValue: false, group: 'publishing', description: 'Use for grouped work that is still being assembled.'}),
    defineField({name: 'displayOrder', title: 'Project Order', type: 'number', initialValue: 10, description: 'Use 10, 20, 30… so new work can be inserted between projects.', group: 'publishing', validation: rule => rule.required()}),
    defineField({
      name: 'visibility', title: 'Website Visibility', type: 'string', initialValue: 'public', group: 'publishing',
      description: 'Publishing is controlled by Sanity’s Publish action. This field controls whether a published item appears on the public site.',
      options: {layout: 'radio', list: [
        {title: 'Public on website', value: 'public'},
        {title: 'Preview only', value: 'preview'},
        {title: 'Hidden', value: 'hidden'},
      ]},
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'sections', title: 'Project Sections', type: 'array', group: 'media',
      description: 'Add as many sections as the project needs. Drag sections to reorder them.',
      options: {sortable: true}, of: [defineArrayMember({type: 'projectSection'})],
    }),
  ],
  orderings: [{title: 'Project order', name: 'displayOrderAsc', by: [{field: 'displayOrder', direction: 'asc'}]}],
  preview: {
    select: {title: 'titleEn', subtitle: 'tagEn', media: 'coverImage', visibility: 'visibility', order: 'displayOrder'},
    prepare: ({title, subtitle, media, visibility, order}) => ({title: title || 'Untitled project', subtitle: `${String(order ?? '—').padStart(2, '0')} · ${subtitle || 'No label'} · ${visibility || 'public'}`, media}),
  },
})
