import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'topic',
    title: 'Topic',
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
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title.en',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'object',
            fields: [
                { name: 'en', type: 'text', title: 'English' },
                { name: 'vi', type: 'text', title: 'Vietnamese' },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title.en',
            subtitle: 'title.vi',
        },
    },
});
