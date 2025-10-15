# Personal Blog - Bên Rìa Thế Giới & BeTheFlow

A modern, bilingual personal branding blog built with Next.js 15, TypeScript, and Sanity CMS, featuring smooth animations and parallax effects.

## 🌟 Features

- **Bilingual Support**: Full Vietnamese and English translations with `next-intl`
- **Animated Navigation**: GSAP-powered hover effects on homepage
- **Smooth Scrolling**: Lenis integration for buttery-smooth scroll experience
- **Parallax Effects**: Framer Motion parallax sections for engaging visual storytelling
- **Two Distinct Blogs**:
  - **Bên Rìa Thế Giới** (Literary/Writing) - Pink theme with elegant typography
  - **BeTheFlow** (Barista/Coffee) - Amber theme with warm, coffee-inspired design
- **Headless CMS**: Sanity.io for easy content management
- **SEO Optimized**: Structured data, metadata, and Open Graph tags
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Type-Safe**: Full TypeScript coverage
- **Image Optimization**: Next.js Image component with automatic optimization

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **CMS**: [Sanity.io](https://www.sanity.io/)
- **Animations**: 
  - [Framer Motion](https://www.framer.com/motion/) - Page transitions and parallax
  - [GSAP](https://greensock.com/gsap/) - Homepage navigation effects
  - [Lenis](https://lenis.studiofreight.com/) - Smooth scrolling
- **i18n**: [next-intl](https://next-intl-docs.vercel.app/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 📋 Prerequisites

- Node.js 18+ 
- pnpm 8+
- Sanity account (free tier available)

## 🛠️ Installation

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd personal-blog

# Install dependencies
pnpm install
```

### 2. Set Up Sanity

```bash
# Initialize Sanity (if not already done)
cd sanity
pnpm create sanity@latest

# Follow the prompts to:
# - Create a new project or use existing
# - Choose a dataset name (e.g., "production")
# - Select "Clean project"
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_api_token

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Get your Sanity credentials:**
1. Project ID: Found in `sanity.cli.js` or Sanity dashboard
2. API Token: Create in Sanity dashboard → API → Tokens (with Editor permissions)

### 4. Run Development Server

```bash
# Run Next.js development server
pnpm dev

# In a separate terminal, run Sanity Studio (optional)
# Navigate to http://localhost:3000/studio
```

The blog will be available at:
- **Main Site**: http://localhost:3000
- **Sanity Studio**: http://localhost:3000/studio

## 📁 Project Structure

```
personal-blog/
├── sanity/                    # Sanity CMS configuration
│   ├── schema/               # Content schemas
│   │   ├── post.ts          # Blog post schema
│   │   └── author.ts        # Author schema
│   └── sanity.config.ts     # Sanity configuration
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── [locale]/        # Internationalized routes
│   │   │   ├── page.tsx     # Homepage with animated navigation
│   │   │   ├── about/       # About page
│   │   │   ├── ben-ria-the-gioi/  # Writing blog
│   │   │   └── betheflow/   # Barista blog
│   │   ├── studio/          # Sanity Studio
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── home/            # Homepage components
│   │   ├── shared/          # Shared components
│   │   ├── ben-ria/         # Writing blog components
│   │   └── betheflow/       # Barista blog components
│   ├── lib/                 # Utility functions
│   │   ├── sanity.ts        # Sanity client
│   │   ├── queries.ts       # GROQ queries
│   │   └── seo.ts           # SEO helpers
│   ├── i18n/                # Internationalization
│   │   ├── messages/        # Translation files
│   │   ├── request.ts       # i18n configuration
│   │   └── routing.ts       # i18n routing
│   └── middleware.ts        # Next.js middleware
├── public/                   # Static assets
├── .env.local               # Environment variables
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
└── tsconfig.json            # TypeScript configuration
```

## 🎨 Customization

### Brand Colors

Edit `src/app/globals.css`:

```css
@theme inline {
  --color-about: #6366f1;      /* Indigo for About */
  --color-benria: #ec4899;     /* Pink for Writing */
  --color-betheflow: #f59e0b;  /* Amber for Barista */
}
```

### Typography

Fonts are configured in `src/app/layout.tsx`:
- **Sans**: Geist Sans
- **Mono**: Geist Mono

### Translations

Edit translation files in `src/i18n/messages/`:
- `en.json` - English translations
- `vi.json` - Vietnamese translations

## 📝 Content Management

### Accessing Sanity Studio

1. Navigate to `http://localhost:3000/studio` (local) or `https://yoursite.com/studio` (production)
2. Sign in with your Sanity account
3. Create and manage posts

### Creating a Blog Post

1. Click "Post" in the Studio sidebar
2. Fill in the required fields:
   - **Title**: English and Vietnamese versions
   - **Slug**: Auto-generated from English title
   - **Category**: Choose "ben-ria-the-gioi" or "betheflow"
   - **Cover Image**: Upload an image
   - **Excerpt**: Short description (both languages)
   - **Content**: Rich text editor (both languages)
   - **Published At**: Publication date
   - **Tags**: Add relevant tags
3. Click "Publish"

### Content Writer Guide

See `CONTENT_GUIDE.md` for detailed instructions on:
- Using the rich text editor
- Image best practices
- SEO optimization
- Bilingual content tips

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings → Environment Variables
```

### Build for Production

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

### Sanity Studio Production

The Sanity Studio is automatically deployed with your Next.js app at `/studio`.

For a standalone deployment:
```bash
cd sanity
pnpm build
pnpm deploy
```

## 🧪 Scripts

```bash
# Development
pnpm dev              # Start Next.js dev server with Turbopack
pnpm dev:sanity       # Start Sanity Studio (if separate)

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript compiler check

# Sanity
# Access studio at http://localhost:3000/studio
```

## 🔧 Configuration

### Next.js Config

Key configurations in `next.config.ts`:
- Image domains: Allow Sanity CDN
- i18n: next-intl plugin integration

### Sanity Config

Edit `sanity/sanity.config.ts`:
- Project ID and dataset
- Plugins: Structure tool, Vision
- Schema types

## 📱 Responsive Design

The blog is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Alt text for images
- Color contrast compliance

## 🔍 SEO Features

- Metadata per page
- Open Graph tags
- Twitter Cards
- JSON-LD structured data
- Sitemap (auto-generated by Next.js)
- Robots.txt

## 🌐 Internationalization

Supported languages:
- **English** (en)
- **Vietnamese** (vi)

Default locale: English

Locale switcher available in header.

## 📊 Performance

Optimization features:
- Image optimization with Next.js Image
- Code splitting
- Tree shaking
- Font optimization
- Lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 💬 Support

For questions or issues:
- Open an issue on GitHub
- Contact: hello@example.com

## 🙏 Acknowledgments

- Inspired by [anacuna.com](https://anacuna.com/)
- Inspired by [weareexample.com](https://www.weareexample.com/)
- Sample projects: background-image-parallax and project-gallery-colored-card

---

Built with ❤️ using Next.js, TypeScript, and Sanity
