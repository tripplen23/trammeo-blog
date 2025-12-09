import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'galleryPhoto',
    title: 'Gallery Photo BetheFlow',
    type: 'document',
    fields: [
        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: {
                        hotspot: true,
                    },
                },
            ],
            validation: (Rule) =>
                Rule.required()
                    .min(1)
                    .max(10)
                    .error('Gallery post must have between 1 and 10 images'),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Little life at Art', value: 'littleLifeAtArt' },
                    { title: 'The home cafe', value: 'theHomeCafe' },
                ],
                layout: 'radio',
            },
            validation: (Rule) => Rule.required().error('Category is required'),
        }),
        defineField({
            name: 'portfolioLink',
            title: 'Portfolio Link',
            type: 'url',
            description: 'Optional external link to portfolio or related content',
            validation: (Rule) =>
                Rule.uri({
                    scheme: ['http', 'https'],
                }).error('Please enter a valid URL (http:// or https://)'),
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
            subtitle: 'category',
            media: 'images',
        },
        prepare({ title, subtitle, media }) {
            const categoryLabels: Record<string, string> = {
                littleLifeAtArt: 'Little life at Art',
                theHomeCafe: 'The home cafe',
            };
            return {
                title: title || 'Untitled',
                subtitle: categoryLabels[subtitle] || subtitle,
                media: media?.[0],
            };
        },
    },
});
