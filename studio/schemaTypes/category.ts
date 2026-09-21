import {defineField, defineType} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({name: 'titleEn', title: 'Category Name — English', type: 'string', validation: rule => rule.required()}),
    defineField({name: 'titleZh', title: 'Category Name — Chinese', type: 'string', validation: rule => rule.required()}),
    defineField({name: 'slug', title: 'Category ID', type: 'slug', description: 'Stable value used by the website filter.', options: {source: 'titleEn'}, validation: rule => rule.required()}),
    defineField({name: 'displayOrder', title: 'Category Order', type: 'number', initialValue: 10}),
    defineField({name: 'active', title: 'Show in Website Filters', type: 'boolean', initialValue: true}),
  ],
  orderings: [{title: 'Display order', name: 'displayOrderAsc', by: [{field: 'displayOrder', direction: 'asc'}]}],
  preview: {select: {title: 'titleEn', subtitle: 'titleZh'}},
})

