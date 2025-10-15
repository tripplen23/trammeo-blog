# Deployment Guide

This guide covers deploying your Personal Blog to Vercel (recommended) and other platforms.

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Sanity project set up

### Step-by-Step

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   
   In Vercel dashboard → Settings → Environment Variables, add:
   
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
   SANITY_API_TOKEN=your_token
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your site is live! 🎉

### Automatic Deployments

- **main branch** → Production deployment
- **other branches** → Preview deployments
- Push to GitHub to trigger automatic deployment

## 🌐 Custom Domain

### Add Custom Domain to Vercel

1. Go to Vercel dashboard → Settings → Domains
2. Enter your domain name
3. Follow DNS configuration instructions:

**For apex domain (example.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. Wait for DNS propagation (~24-48 hours, usually faster)
5. SSL certificate is automatically provisioned

### Update Environment Variables

After adding custom domain:
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 🔧 Build Configuration

### Vercel Settings

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Build Command | `pnpm build` |
| Output Directory | `.next` |
| Install Command | `pnpm install` |
| Node Version | 18.x or higher |

### Advanced Settings

**Root Directory**: Leave empty (or `.` if monorepo)

**Environment Variables**: See above

**Build & Development Settings**:
- Output Directory: `.next` (default)
- Install Command: `pnpm install --frozen-lockfile`

## 🎨 Sanity Studio Deployment

The Sanity Studio is automatically deployed with your Next.js app at `/studio`.

### Accessing Production Studio

Visit: `https://yourdomain.com/studio`

### Studio Configuration for Production

1. Add your production URL to Sanity CORS origins:
   - Go to [sanity.io/manage](https://sanity.io/manage)
   - Select your project
   - Navigate to **API** → **CORS Origins**
   - Click "Add CORS origin"
   - Add your domain: `https://yourdomain.com`
   - Check "Allow credentials"
   - Save

2. Add users who can access the studio:
   - Go to **Project members**
   - Click "Invite member"
   - Enter email and select role (Editor recommended)

## 🔐 Environment Variables Security

### Production Best Practices

1. **Never commit `.env.local`** to git (already in `.gitignore`)
2. **Use different API tokens** for dev and production
3. **Set token permissions** appropriately:
   - Dev: Editor permissions
   - Production: Read-only if possible (for public site)
4. **Rotate tokens** if compromised

### Creating Sanity API Tokens

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Navigate to **API** → **Tokens**
4. Click "Add API token"
5. Name it (e.g., "Production Read Token")
6. Select permissions (Editor or Viewer)
7. Copy the token (only shown once!)
8. Add to Vercel environment variables

## 📊 Performance Optimization

### Vercel Analytics (Optional)

1. Install Vercel Analytics:
   ```bash
   pnpm add @vercel/analytics
   ```

2. Add to `src/app/layout.tsx`:
   ```tsx
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

### Speed Insights

Enable in Vercel dashboard → Analytics → Speed Insights

## 🐛 Troubleshooting

### Build Fails

**Error**: `Command "pnpm build" exited with 1`

**Solutions**:
1. Check build logs for specific errors
2. Ensure all environment variables are set
3. Test build locally: `pnpm build`
4. Check TypeScript errors: `pnpm typecheck`

### Sanity Content Not Loading

**Symptoms**: Posts don't appear on site

**Solutions**:
1. Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
2. Check `SANITY_API_TOKEN` has proper permissions
3. Ensure dataset name matches (`production`)
4. Check Sanity Studio for published posts
5. Check API version matches

### Images Not Loading

**Symptoms**: Broken images from Sanity

**Solutions**:
1. Verify `cdn.sanity.io` is in `next.config.ts` image domains
2. Check image URLs in browser console
3. Ensure images are published in Sanity
4. Check CORS settings in Sanity

### Locale Routing Issues

**Symptoms**: 404 on locale pages

**Solutions**:
1. Check middleware configuration
2. Verify `routing.ts` configuration
3. Clear browser cache
4. Check Vercel function logs

## 🔄 Continuous Deployment Workflow

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-section

# 2. Make changes
# ... code, code, code ...

# 3. Test locally
pnpm dev
pnpm build
pnpm typecheck

# 4. Commit and push
git add .
git commit -m "Add new section"
git push origin feature/new-section

# 5. Create PR on GitHub
# Vercel creates preview deployment

# 6. Review preview URL
# Test all functionality

# 7. Merge to main
# Automatic production deployment
```

### Preview Deployments

- Every branch gets a unique preview URL
- Perfect for:
  - Testing before production
  - Sharing with stakeholders
  - Content review
- Format: `https://personal-blog-git-branch-name-username.vercel.app`

## 📱 Other Deployment Platforms

### Netlify

1. Connect GitHub repository
2. Set build command: `pnpm build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy

**Note**: Netlify requires additional configuration for Next.js App Router.

### Self-Hosted (VPS/Docker)

```bash
# Build
pnpm build

# Start
pnpm start

# Or with PM2
pm2 start npm --name "personal-blog" -- start

# Nginx reverse proxy
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build image
docker build -t personal-blog .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SANITY_PROJECT_ID=your_id \
  -e SANITY_API_TOKEN=your_token \
  personal-blog
```

## 🔍 Monitoring & Maintenance

### Vercel Dashboard

Monitor:
- Build status
- Deploy history
- Function logs
- Analytics
- Performance metrics

### Sanity Dashboard

Monitor:
- Content changes
- API usage
- User activity
- Dataset size

### Regular Maintenance

**Weekly**:
- Review analytics
- Check error logs
- Monitor performance

**Monthly**:
- Update dependencies: `pnpm update`
- Review content
- Optimize images
- Check broken links

**Quarterly**:
- Major dependency updates
- Security audit
- Performance optimization
- Content audit

## 📈 Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Images loading
- [ ] Sanity Studio accessible
- [ ] Can create/edit posts
- [ ] Locale switching works
- [ ] Forms working (if any)
- [ ] Analytics installed
- [ ] SEO tags present
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Social sharing works
- [ ] Mobile responsive
- [ ] Performance acceptable

## 🎉 You're Live!

Congratulations! Your personal blog is now live.

### Next Steps

1. **Create Content**: Start publishing posts
2. **Share**: Promote on social media
3. **Monitor**: Watch analytics
4. **Iterate**: Improve based on feedback
5. **Maintain**: Keep dependencies updated

### Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)

---

Need help? Check the [README](./README.md) or create an issue on GitHub.




