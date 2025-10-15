# Content Writer Guide

This guide will help you create and publish content using the Sanity Studio.

## 📚 Table of Contents

1. [Accessing the Studio](#accessing-the-studio)
2. [Creating a New Post](#creating-a-new-post)
3. [Post Fields Explained](#post-fields-explained)
4. [Rich Text Editor](#rich-text-editor)
5. [Image Guidelines](#image-guidelines)
6. [Bilingual Content](#bilingual-content)
7. [SEO Best Practices](#seo-best-practices)
8. [Publishing Workflow](#publishing-workflow)

## 🔐 Accessing the Studio

### Local Development
1. Ensure the development server is running: `pnpm dev`
2. Navigate to: `http://localhost:3000/studio`
3. Sign in with your Sanity credentials

### Production
1. Go to: `https://yoursite.com/studio`
2. Sign in with your Sanity credentials

**Note**: You need Editor permissions to create and publish content. Contact the administrator if you don't have access.

## ✍️ Creating a New Post

1. Click the "**+**" icon in the top menu
2. Select "**Post**" from the dropdown
3. Fill in all required fields (marked with *)
4. Click "**Publish**" when ready

## 📋 Post Fields Explained

### Title* (Required)
- **English**: Write the title in English
- **Vietnamese**: Write the Vietnamese translation

**Tips**:
- Keep titles concise (50-60 characters)
- Make them descriptive and engaging
- Use title case in English
- Use sentence case in Vietnamese

**Example**:
- EN: "The Art of Pour Over Coffee"
- VI: "Nghệ thuật pha cà phê pour over"

### Slug* (Required)
- Auto-generated from the English title
- Used in the URL: `yoursite.com/betheflow/art-of-pour-over-coffee`
- Click "**Generate**" to create automatically
- Can be edited manually (use lowercase, hyphens only)

### Category* (Required)
Choose one:
- **Bên Rìa Thế Giới** (`ben-ria-the-gioi`): For literary writing, reflections, creative content
- **BeTheFlow** (`betheflow`): For coffee-related content, barista tips, cafe reviews

### Excerpt (Optional but Recommended)
Short summary of the post (2-3 sentences)
- **English**: Write a compelling summary
- **Vietnamese**: Translate the summary

**Tips**:
- Keep it under 160 characters
- Focus on the main point
- Make readers want to click

**Example**:
- EN: "Discover the techniques and nuances of brewing the perfect pour over coffee. From water temperature to pouring technique, every detail matters."
- VI: "Khám phá kỹ thuật và những điểm tinh tế để pha một tách cà phê pour over hoàn hảo. Từ nhiệt độ nước đến kỹ thuật rót, mọi chi tiết đều quan trọng."

### Cover Image (Recommended)
- Click "**Upload**" to select an image
- Add **Alt Text** for accessibility

**Requirements**:
- Minimum size: 1200×800 pixels
- Recommended: 1920×1080 pixels
- Format: JPG or PNG
- File size: Under 2MB (optimized automatically)
- Aspect ratio: 16:9 or 4:3

**Tips**:
- Use high-quality, relevant images
- Avoid text-heavy images
- Ensure good contrast and clarity
- Alt text should describe the image content

### Content* (Required)
The main body of your post in rich text format
- **English**: Write the full post
- **Vietnamese**: Translate the full post

See [Rich Text Editor](#rich-text-editor) section for details.

### Published At (Auto-filled)
- Defaults to current date/time
- Can be changed to schedule posts
- Used for sorting (newest first)

### Featured Post
- Toggle ON to feature this post
- Featured posts may appear in special sections
- Use sparingly (max 3-5 featured posts)

### Tags (Optional but Recommended)
- Add relevant keywords
- Press Enter after each tag
- Use lowercase
- 3-5 tags per post recommended

**Good Tags**:
- "pour over"
- "coffee brewing"
- "barista tips"
- "cafe culture"

## 📝 Rich Text Editor

The content editor supports:

### Text Formatting
- **Bold**: Highlight important text
- *Italic*: Emphasize words
- `Code`: For technical terms

### Headings
Use hierarchically:
- **H1**: Reserved for post title (don't use in content)
- **H2**: Main sections
- **H3**: Subsections

**Example Structure**:
```
## Introduction (H2)
Brief intro paragraph

## Main Topic (H2)
Content here

### Subtopic One (H3)
Details

### Subtopic Two (H3)
More details

## Conclusion (H2)
Wrap up
```

### Links
1. Select text
2. Click link icon
3. Enter URL (include https://)
4. Opens in new tab automatically

**Tips**:
- Use descriptive link text (avoid "click here")
- Link to authoritative sources
- Check links before publishing

### Images in Content
1. Click image icon
2. Upload or select existing image
3. Add alt text
4. Image appears in content

**Tips**:
- Place images strategically
- Use images to break up long text
- Ensure images are relevant
- Add descriptive captions

### Quotes
Use the blockquote style for:
- Important quotes
- Key takeaways
- Highlighted information

**Example**:
> "The perfect cup of coffee is not just about the beans, but about the journey from farm to cup."

### Lists
**Numbered Lists**: For steps or rankings
1. First step
2. Second step
3. Third step

**Bullet Lists**: For features or points
- Point one
- Point two
- Point three

## 🖼️ Image Guidelines

### Image Sizes

| Use Case | Dimensions | Aspect Ratio |
|----------|------------|--------------|
| Cover Image | 1920×1080 | 16:9 |
| Content Image | 1200×800 | 3:2 |
| Portrait | 800×1200 | 2:3 |
| Square | 1080×1080 | 1:1 |

### Image Optimization

Before uploading:
1. Resize to recommended dimensions
2. Compress (use tools like TinyPNG, Squoosh)
3. Convert to JPG (for photos) or PNG (for graphics)
4. Ensure file size < 2MB

### Alt Text Best Practices

Good alt text:
- Describes the image content
- Is concise (< 125 characters)
- Doesn't include "image of" or "picture of"
- Includes relevant keywords naturally

**Example**:
- ❌ Bad: "Image of coffee"
- ✅ Good: "Barista pouring hot water over ground coffee in a V60 dripper"

## 🌐 Bilingual Content

### Translation Tips

1. **Be Natural**: Translate meaning, not just words
2. **Cultural Context**: Adapt examples and references
3. **Consistency**: Use the same terms throughout
4. **Review**: Have a native speaker review if possible

### Vietnamese Specific

- Use proper diacritical marks (á, à, ả, ã, ạ, etc.)
- Formal vs. informal: Match the tone of the English version
- Punctuation: Follow Vietnamese grammar rules

### Content Parity

- Both versions should convey the same message
- Images and formatting should be identical
- Links can differ if pointing to language-specific resources

## 🎯 SEO Best Practices

### Keywords
- Identify 1-2 main keywords
- Use keywords naturally in:
  - Title
  - First paragraph
  - Headings
  - Throughout content
  - Tags

### Content Length
- Minimum: 300 words
- Recommended: 800-1500 words for in-depth posts
- Quality > Quantity

### Internal Linking
- Link to your other posts
- Use descriptive anchor text
- 2-3 internal links per post

### External Linking
- Link to authoritative sources
- Opens in new tab automatically
- Adds credibility

### Meta Description (Excerpt)
- 50-160 characters
- Include main keyword
- Compelling call to action
- Accurate summary

## 📤 Publishing Workflow

### Before Publishing

**Checklist**:
- [ ] Both language versions complete
- [ ] Title is compelling and descriptive
- [ ] Slug is clean and readable
- [ ] Category selected correctly
- [ ] Cover image uploaded with alt text
- [ ] Excerpt written for both languages
- [ ] Content proofread and formatted
- [ ] Images have alt text
- [ ] Links tested and working
- [ ] Tags added (3-5 tags)
- [ ] Published date is correct

### Publishing

1. Click "**Publish**" button (top right)
2. Confirmation message appears
3. Post is now live on the website
4. Takes ~1 minute to appear (cache refresh)

### After Publishing

1. **View Live**: Visit the post on the website
2. **Share**: Share on social media
3. **Monitor**: Check for comments or feedback
4. **Update**: Edit if needed (changes publish immediately)

### Unpublishing

To remove a post:
1. Open the post
2. Click the "•••" menu
3. Select "Unpublish"
4. Confirm

**Note**: The post is not deleted, just hidden from the website.

## 🔄 Editing Published Posts

1. Find the post in the Studio
2. Make your changes
3. Click "**Publish**" to update
4. Changes appear on website within ~1 minute

**Tip**: For major updates, consider:
- Adding "Updated: [Date]" note in content
- Checking if images need updating
- Reviewing SEO after significant changes

## ❓ Common Questions

### Can I schedule posts?
Yes! Set the "Published At" date to a future date. However, you'll need to manually publish it when ready.

### How do I delete a post?
1. Open the post
2. Click "•••" menu
3. Select "Delete"
4. Confirm (this action is permanent)

### Can I save drafts?
Yes! Just don't click "Publish." The post saves automatically as a draft.

### What if I make a mistake?
1. Edit the post immediately
2. Click "Publish" to update
3. Changes are live within ~1 minute

### How do I add categories?
Categories are predefined. If you need a new category, contact the administrator.

## 📞 Support

Need help?
- **Technical Issues**: Contact the administrator
- **Writing Questions**: Refer to the editorial style guide
- **Sanity Studio Help**: [Sanity Documentation](https://www.sanity.io/docs)

---

Happy writing! 📝☕




