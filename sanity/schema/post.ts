import { defineField, defineType } from 'sanity';

const postSchema = defineType({
  name: 'post',
  title: 'Blog Post For Ben ria the gioi',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'vi', type: 'string', title: 'Vietnamese' },
      ],
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Bên Rìa Thế Giới', value: 'ben-ria-the-gioi' },
          { title: 'BeTheFlow', value: 'betheflow' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'reference',
      to: { type: 'topic' },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 3 },
        { name: 'vi', type: 'text', title: 'Vietnamese', rows: 3 },
      ],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'object',
      fields: [
        {
          name: 'en',
          type: 'array',
          title: 'English Content',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'Heading 1', value: 'h1' },
                { title: 'Heading 2', value: 'h2' },
                { title: 'Heading 3', value: 'h3' },
                { title: 'Heading 4', value: 'h4' },
                { title: 'Heading 5', value: 'h5' },
                { title: 'Heading 6', value: 'h6' },
                { title: 'Quote', value: 'blockquote' },
                { title: 'Callout', value: 'callout' },
              ],
              lists: [
                { title: 'Bullet', value: 'bullet' },
                { title: 'Numbered', value: 'number' },
                { title: 'Checklist', value: 'checkbox' },
              ],
              marks: {
                decorators: [
                  { title: 'Bold', value: 'strong' },
                  { title: 'Italic', value: 'em' },
                  { title: 'Underline', value: 'underline' },
                  { title: 'Strike', value: 'strike-through' },
                  { title: 'Code', value: 'code' },
                  { title: 'Highlight', value: 'highlight' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [
                      {
                        name: 'href',
                        type: 'url',
                        title: 'URL',
                      },
                      {
                        name: 'blank',
                        type: 'boolean',
                        title: 'Open in new tab',
                        initialValue: true,
                      },
                    ],
                  },
                  {
                    name: 'color',
                    type: 'object',
                    title: 'Text Color',
                    fields: [
                      {
                        name: 'value',
                        type: 'string',
                        title: 'Color',
                        options: {
                          list: [
                            { title: 'Default', value: 'default' },
                            { title: 'Gray', value: 'gray' },
                            { title: 'Brown', value: 'brown' },
                            { title: 'Orange', value: 'orange' },
                            { title: 'Yellow', value: 'yellow' },
                            { title: 'Green', value: 'green' },
                            { title: 'Blue', value: 'blue' },
                            { title: 'Purple', value: 'purple' },
                            { title: 'Pink', value: 'pink' },
                            { title: 'Red', value: 'red' },
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'image',
              options: { hotspot: true },
            },
          ],
        },
        {
          name: 'vi',
          type: 'array',
          title: 'Vietnamese Content',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'Heading 1', value: 'h1' },
                { title: 'Heading 2', value: 'h2' },
                { title: 'Heading 3', value: 'h3' },
                { title: 'Heading 4', value: 'h4' },
                { title: 'Heading 5', value: 'h5' },
                { title: 'Heading 6', value: 'h6' },
                { title: 'Quote', value: 'blockquote' },
                { title: 'Callout', value: 'callout' },
              ],
              lists: [
                { title: 'Bullet', value: 'bullet' },
                { title: 'Numbered', value: 'number' },
                { title: 'Checklist', value: 'checkbox' },
              ],
              marks: {
                decorators: [
                  { title: 'Bold', value: 'strong' },
                  { title: 'Italic', value: 'em' },
                  { title: 'Underline', value: 'underline' },
                  { title: 'Strike', value: 'strike-through' },
                  { title: 'Code', value: 'code' },
                  { title: 'Highlight', value: 'highlight' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [
                      {
                        name: 'href',
                        type: 'url',
                        title: 'URL',
                      },
                      {
                        name: 'blank',
                        type: 'boolean',
                        title: 'Open in new tab',
                        initialValue: true,
                      },
                    ],
                  },
                  {
                    name: 'color',
                    type: 'object',
                    title: 'Text Color',
                    fields: [
                      {
                        name: 'value',
                        type: 'string',
                        title: 'Color',
                        options: {
                          list: [
                            { title: 'Default', value: 'default' },
                            { title: 'Gray', value: 'gray' },
                            { title: 'Brown', value: 'brown' },
                            { title: 'Orange', value: 'orange' },
                            { title: 'Yellow', value: 'yellow' },
                            { title: 'Green', value: 'green' },
                            { title: 'Blue', value: 'blue' },
                            { title: 'Purple', value: 'purple' },
                            { title: 'Pink', value: 'pink' },
                            { title: 'Red', value: 'red' },
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'image',
              options: { hotspot: true },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
});

export default postSchema;