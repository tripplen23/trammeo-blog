# 🚀 Getting Started

Quick start guide to get your personal blog up and running in minutes!

## ⚡ Quick Start (5 minutes)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Sanity

You need a Sanity project ID. Choose one option:

**Option A: Create New Project**
```bash
# Visit https://www.sanity.io/manage
# Click "Create new project"
# Copy your Project ID
```

**Option B: Use Existing Project**
```bash
# Visit https://www.sanity.io/manage
# Select your project
# Copy the Project ID from the dashboard
```

### 3. Configure Environment

Create `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Get API Token** (for content management):
1. Go to https://www.sanity.io/manage
2. Select your project
3. Navigate to **API** → **Tokens**
4. Click "Add API token"
5. Name it "Development Token"
6. Select "Editor" permissions
7. Copy the token and paste it in `.env.local`

### 4. Run Development Server

```bash
pnpm dev
```

Visit:
- **Blog**: http://localhost:3000
- **Sanity Studio**: http://localhost:3000/studio

### 5. Create Your First Post

1. Go to http://localhost:3000/studio
2. Sign in with your Sanity account
3. Click the "+" button → "Post"
4. Fill in the required fields:
   - Title (English & Vietnamese)
   - Click "Generate" for slug
   - Select Category (ben-ria-the-gioi or betheflow)
   - Upload a cover image
   - Write your content
5. Click "Publish"
6. View at http://localhost:3000/en/category-name

## 📁 Project Structure Overview

```
personal-blog/
├── src/
│   ├── app/
│   │   ├── [locale]/           # Language-specific pages
│   │   │   ├── page.tsx        # 🎨 Animated homepage
│   │   │   ├── about/          # About page
│   │   │   ├── ben-ria-the-gioi/  # Writing blog
│   │   │   └── betheflow/      # Coffee blog
│   │   └── studio/             # Sanity CMS
│   ├── components/             # React components
│   ├── lib/                    # Utilities
│   └── i18n/                   # Translations
├── sanity/                     # Sanity config
└── public/                     # Static files
```

## 🎨 Customization Quick Guide

### Change Brand Colors

Edit `src/app/globals.css`:

```css
@theme inline {
  --color-about: #6366f1;      /* About section */
  --color-benria: #ec4899;     /* Writing section */
  --color-betheflow: #f59e0b;  /* Coffee section */
}
```

### Update Site Info

Edit `src/app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: 'Your Site Title',
  description: 'Your site description',
};
```

### Add Your Social Links

Edit `src/components/shared/Footer.tsx` - Update the social media URLs

### Translations

Edit translation files:
- English: `src/i18n/messages/en.json`
- Vietnamese: `src/i18n/messages/vi.json`

## 🧪 Testing Your Site

### Check Homepage Animation
1. Go to http://localhost:3000
2. Hover over the three navigation cards
3. They should animate with GSAP effects

### Test Blog Sections
1. Create a post in each category
2. Visit:
   - http://localhost:3000/en/ben-ria-the-gioi
   - http://localhost:3000/en/betheflow
3. Click on a post to view it

### Test Language Switching
1. Click the EN/VI buttons in the header
2. URL should change to `/vi/...` or `/en/...`
3. Content should translate

### Test Smooth Scrolling
1. Go to homepage
2. Scroll down
3. Should feel smooth (Lenis effect)

## 📝 Content Workflow

### Daily Workflow
1. Open http://localhost:3000/studio
2. Create/edit posts
3. Publish
4. View changes instantly on the site

### Content Tips
- Use high-quality images (1920×1080)
- Write in both English and Vietnamese
- Add 3-5 relevant tags per post
- Fill in excerpt for SEO
- Preview before publishing

## 🔧 Development Commands

```bash
# Development
pnpm dev              # Start dev server

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm typecheck        # Check TypeScript types
pnpm lint             # Run ESLint
```

## 🚀 Deploy to Production

When ready to deploy:

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📚 Learn More

- [README.md](./README.md) - Full documentation
- [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) - Content creation guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

## 🆘 Common Issues

### Port 3000 already in use
```bash
# Kill the process
npx kill-port 3000

# Or use different port
pnpm dev -- -p 3001
```

### Sanity Studio won't load
1. Check Project ID in `.env.local`
2. Verify you're logged into Sanity
3. Check browser console for errors

### Posts not showing
1. Ensure posts are published (not draft)
2. Check category matches route
3. Verify Sanity token has read permissions

### Build errors
```bash
# Clear cache and rebuild
rm -rf .next
pnpm build
```

## ✅ Next Steps

After getting started:

1. ✨ **Customize** the site with your branding
2. ✍️ **Create** your first few blog posts  
3. 🎨 **Add** your own images and content
4. 🌐 **Deploy** to production
5. 📱 **Share** on social media
6. 📊 **Monitor** with analytics

## 💡 Pro Tips

1. **Use Sanity Studio locally** during development for instant preview
2. **Create posts in batches** to save time
3. **Use tags consistently** for better organization
4. **Optimize images** before uploading (< 2MB)
5. **Write drafts** before publishing
6. **Test on mobile** regularly
7. **Keep dependencies updated** monthly

## 🎉 You're Ready!

Your blog is set up and ready to go. Start creating amazing content!

Need help? Check the documentation or open an issue on GitHub.

---

**Happy blogging! 📝☕**




