import {defineArrayMember, defineField, defineType} from 'sanity'

export const projectSection = defineType({
  name: 'projectSection',
  title: 'Project Section',
  type: 'object',
  fields: [
    defineField({name: 'number', title: 'Section Number', type: 'string', description: 'For example: 01'}),
    defineField({name: 'labelEn', title: 'Section Label — English', type: 'string'}),
    defineField({name: 'labelZh', title: 'Section Label — Chinese', type: 'string'}),
    defineField({name: 'headingEn', title: 'Section Heading — English', type: 'string'}),
    defineField({name: 'headingZh', title: 'Section Heading — Chinese', type: 'string'}),
    defineField({name: 'bodyEn', title: 'Body Text — English', type: 'text', rows: 5}),
    defineField({name: 'bodyZh', title: 'Body Text — Chinese', type: 'text', rows: 5}),
    defineField({
      name: 'images', title: 'Images', type: 'array', description: 'Drag images to reorder them.',
      options: {sortable: true}, of: [defineArrayMember({type: 'projectImage'})],
    }),
    defineField({name: 'displayOrder', title: 'Section Order', type: 'number', initialValue: 10, description: 'Use 10, 20, 30… so a new section can be inserted later.'}),
  ],
  preview: {
    select: {number: 'number', label: 'labelEn', heading: 'headingEn', media: 'images.0.image'},
    prepare: ({number, label, heading, media}) => ({title: `${number || '—'} · ${label || heading || 'Untitled section'}`, subtitle: heading, media}),
  },
})

