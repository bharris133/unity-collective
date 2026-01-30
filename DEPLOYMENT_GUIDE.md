# Unity Collective - Deployment Guide

This guide provides step-by-step instructions for deploying your Unity Collective website to various hosting platforms.

## 🎯 Pre-Deployment Checklist

### ✅ Before You Deploy

- [ ] Test website locally (`pnpm run dev`)
- [ ] Build successfully (`pnpm run build`)
- [ ] Test production build (`pnpm run preview`)
- [ ] All images loading correctly
- [ ] Navigation working between pages
- [ ] Mobile responsiveness verified
- [ ] Content reviewed and approved
- [ ] Domain name purchased (if using custom domain)

### 📋 Required Information

Gather this information before starting:
- [ ] Hosting platform account (Netlify, Vercel, etc.)
- [ ] Domain name (if using custom domain)
- [ ] DNS access (for custom domain setup)
- [ ] Git repository URL (for automatic deployments)

## 🌐 Deployment Options

### Option 1: Netlify (Recommended for Beginners)

**Why Netlify?**
- Free tier available
- Easy drag-and-drop deployment
- Automatic HTTPS
- Custom domain support
- Form handling
- Continuous deployment from Git

#### Method A: Drag and Drop (Easiest)

1. **Build your project:**
   ```bash
   cd unity-collective
   pnpm run build
   ```

2. **Go to Netlify:**
   - Visit [netlify.com](https://netlify.com)
   - Sign up for free account
   - Click "Deploy to Netlify"

3. **Deploy:**
   - Drag the `dist` folder to the deployment area
   - Wait for deployment to complete
   - Your site will be live at a random URL like `https://amazing-name-123456.netlify.app`

4. **Custom Domain (Optional):**
   - Go to Site Settings > Domain Management
   - Click "Add custom domain"
   - Enter your domain name
   - Follow DNS configuration instructions

#### Method B: Git Integration (Recommended for ongoing updates)

1. **Push to Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/unity-collective.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose your Git provider (GitHub, GitLab, Bitbucket)
   - Select your repository

3. **Configure build settings:**
   - Build command: `pnpm run build`
   - Publish directory: `dist`
   - Node version: `18` (in Environment variables)

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically build and deploy
   - Future pushes to main branch will auto-deploy

### Option 2: Vercel (Great for React apps)

**Why Vercel?**
- Optimized for React/Next.js
- Excellent performance
- Free tier available
- Easy Git integration
- Global CDN

#### Deployment Steps:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd unity-collective
   vercel --prod
   ```

4. **Follow prompts:**
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N`
   - What's your project's name? `unity-collective`
   - In which directory is your code located? `./`
   - Want to override settings? `N`

5. **Custom Domain:**
   - Go to Vercel dashboard
   - Select your project
   - Go to Settings > Domains
   - Add your custom domain

### Option 3: GitHub Pages (Free with GitHub)

**Why GitHub Pages?**
- Free hosting
- Integrated with GitHub
- Custom domain support
- HTTPS included

#### Setup Steps:

1. **Install gh-pages:**
   ```bash
   cd unity-collective
   pnpm add -D gh-pages
   ```

2. **Update package.json:**
   ```json
   {
     "scripts": {
       "predeploy": "pnpm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/unity-collective"
   }
   ```

3. **Deploy:**
   ```bash
   pnpm run deploy
   ```

4. **Enable GitHub Pages:**
   - Go to repository Settings
   - Scroll to Pages section
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)

### Option 4: Traditional Web Hosting

**For shared hosting, VPS, or dedicated servers:**

1. **Build the project:**
   ```bash
   cd unity-collective
   pnpm run build
   ```

2. **Upload files:**
   - Use FTP/SFTP client (FileZilla, WinSCP)
   - Upload entire `dist` folder contents to your web root
   - Common paths: `/public_html/`, `/www/`, `/htdocs/`

3. **Configure server:**
   - Ensure server supports static files
   - Set up URL rewriting for React Router (see below)

#### Server Configuration for React Router

**Apache (.htaccess):**
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 🔧 Custom Domain Setup

### DNS Configuration

1. **For root domain (example.com):**
   ```
   Type: A
   Name: @
   Value: [Your hosting provider's IP]
   ```

2. **For subdomain (www.example.com):**
   ```
   Type: CNAME
   Name: www
   Value: [Your hosting provider's domain]
   ```

### SSL Certificate

Most modern hosting providers include free SSL certificates. If not:

1. **Let's Encrypt (Free):**
   - Most hosts support automatic Let's Encrypt
   - Enable in hosting control panel

2. **Cloudflare (Free):**
   - Sign up for Cloudflare
   - Add your domain
   - Update nameservers
   - Enable SSL in Cloudflare dashboard

## 📊 Post-Deployment Setup

### 1. Analytics

**Google Analytics:**
```html
<!-- Add to index.html before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your domain
3. Verify ownership
4. Submit sitemap (if generated)

### 3. Social Media Meta Tags

Add to `index.html`:
```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://your-domain.com/">
<meta property="og:title" content="Unity Collective - Empowering Black Community">
<meta property="og:description" content="Building stronger Black communities through unity and economic strength">
<meta property="og:image" content="https://your-domain.com/og-image.jpg">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://your-domain.com/">
<meta property="twitter:title" content="Unity Collective - Empowering Black Community">
<meta property="twitter:description" content="Building stronger Black communities through unity and economic strength">
<meta property="twitter:image" content="https://your-domain.com/og-image.jpg">
```

## 🚨 Troubleshooting Deployment Issues

### Common Problems

#### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
pnpm install
pnpm run build
```

#### Images Not Loading
- Check image paths are correct
- Ensure images are in `src/assets/`
- Verify build includes all assets

#### 404 Errors on Page Refresh
- Configure server for React Router (see server config above)
- Check hosting provider documentation

#### Slow Loading
- Optimize images (compress, use WebP)
- Enable gzip compression on server
- Use CDN for assets

### Getting Help

1. **Check hosting provider documentation**
2. **Review build logs for errors**
3. **Test locally first**
4. **Contact hosting support**

## 📈 Performance Optimization

### Before Deployment

1. **Optimize images:**
   ```bash
   # Install image optimization tools
   npm install -g imagemin-cli
   imagemin src/assets/*.png --out-dir=src/assets/optimized
   ```

2. **Analyze bundle size:**
   ```bash
   pnpm run build
   npx vite-bundle-analyzer dist
   ```

### After Deployment

1. **Test with Lighthouse**
2. **Monitor Core Web Vitals**
3. **Set up performance monitoring**

## 🔄 Continuous Deployment

### Automatic Deployments

**Netlify/Vercel with Git:**
- Push to main branch = automatic deployment
- Pull requests = preview deployments
- Rollback capability

**GitHub Actions (Advanced):**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: npm install
    - run: npm run build
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 📋 Deployment Checklist

### Pre-Launch
- [ ] Content reviewed and approved
- [ ] All links working
- [ ] Contact information updated
- [ ] Social media links added
- [ ] Analytics configured
- [ ] SEO meta tags added
- [ ] Performance tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed

### Launch Day
- [ ] Final build and deploy
- [ ] DNS propagation verified
- [ ] SSL certificate active
- [ ] All pages loading correctly
- [ ] Forms working (if applicable)
- [ ] Analytics tracking
- [ ] Social media announcement
- [ ] Community notification

### Post-Launch
- [ ] Monitor for errors
- [ ] Check analytics data
- [ ] Gather user feedback
- [ ] Plan future updates
- [ ] Regular backups scheduled

---

**Need help?** Contact the development team or refer to the main README.md for additional support resources.

