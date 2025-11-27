import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'galleryPhoto',
    title: 'Gallery Photo BetheFlow',
    type: 'document',
    fields: [
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'caption',
            title: 'Caption',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'location',
            title: 'Location',
            type: 'string',
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'date',
            options: {
                dateFormat: 'YYYY-MM-DD',
            },
            initialValue: () => new Date().toISOString().split('T')[0],
        }),
    ],
    preview: {
        select: {
            title: 'caption',
            subtitle: 'location',
            media: 'image',
        },
    },
});
