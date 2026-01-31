# Unity Collective - Troubleshooting Guide

This guide helps you resolve common issues you might encounter while setting up, developing, or deploying the Unity Collective website.

## 🚨 Quick Fixes (Try These First)

### Universal Solutions
1. **Restart your development server**
   ```bash
   # Stop the server (Ctrl+C) then restart
   pnpm run dev
   ```

2. **Clear cache and reinstall dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   pnpm install
   ```

3. **Check for typos** in file names, imports, and code
4. **Refresh your browser** and clear browser cache
5. **Check the browser console** for error messages (F12 → Console)

## 🔧 Installation Issues

### Node.js Problems

#### Error: "node: command not found"
**Solution:**
```bash
# Install Node.js from https://nodejs.org/
# Or using nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Error: "npm ERR! peer dep missing"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### pnpm Issues

#### Error: "pnpm: command not found"
**Solution:**
```bash
npm install -g pnpm
# Or using corepack (Node.js 16+):
corepack enable
corepack prepare pnpm@latest --activate
```

#### Error: "EACCES: permission denied"
**Solution:**
```bash
# Fix npm permissions (macOS/Linux):
sudo chown -R $(whoami) ~/.npm
# Or use nvm to avoid permission issues
```

## 🏗️ Build & Development Issues

### Development Server Problems

#### Error: "Port 5173 is already in use"
**Solutions:**
```bash
# Option 1: Kill the process
lsof -ti:5173 | xargs kill -9

# Option 2: Use different port
pnpm run dev -- --port 3000

# Option 3: Find and stop the process
ps aux | grep node
kill [process_id]
```

#### Error: "Module not found" or Import Errors
**Solutions:**
1. **Check file paths:**
   ```bash
   # Correct import paths
   import logo from './assets/logo_main.png'  # ✅
   import logo from './assets/logo.png'       # ❌ if file doesn't exist
   ```

2. **Verify file exists:**
   ```bash
   ls src/assets/  # Check if files are there
   ```

3. **Check case sensitivity:**
   ```bash
   # File: Logo.png
   import logo from './assets/Logo.png'  # ✅
   import logo from './assets/logo.png'  # ❌ on case-sensitive systems
   ```

### Build Failures

#### Error: "Build failed with errors"
**Solutions:**
1. **Check for syntax errors:**
   ```bash
   # Look for missing brackets, semicolons, etc.
   pnpm run build 2>&1 | grep -i error
   ```

2. **Verify all imports:**
   ```bash
   # Make sure all imported files exist
   find src -name "*.jsx" -exec grep -l "import.*from" {} \;
   ```

3. **Check for unused variables:**
   ```bash
   # Remove or comment out unused imports/variables
   ```

#### Error: "Out of memory" during build
**Solutions:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm run build

# Or add to package.json scripts:
"build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
```

## 🎨 Styling & Display Issues

### CSS Not Loading

#### Tailwind classes not working
**Solutions:**
1. **Check Tailwind import:**
   ```css
   /* App.css should have: */
   @import "tailwindcss";
   ```

2. **Verify Tailwind config:**
   ```bash
   # Check if tailwind.config.js exists and is properly configured
   cat tailwind.config.js
   ```

3. **Restart development server:**
   ```bash
   # Stop and restart after CSS changes
   pnpm run dev
   ```

#### Custom CSS not applying
**Solutions:**
1. **Check CSS import order:**
   ```jsx
   // In App.jsx, import should be:
   import './App.css'  // ✅ After other imports
   ```

2. **Verify CSS syntax:**
   ```css
   /* Check for missing semicolons, brackets */
   .my-class {
     color: red;  /* ✅ */
   }
   ```

### Image Loading Issues

#### Images not displaying
**Solutions:**
1. **Check file paths:**
   ```jsx
   // Correct way to import images:
   import logo from './assets/logo_main.png'
   <img src={logo} alt="Logo" />
   ```

2. **Verify image files exist:**
   ```bash
   ls -la src/assets/
   ```

3. **Check image formats:**
   ```bash
   # Supported formats: .png, .jpg, .jpeg, .gif, .svg, .webp
   file src/assets/logo_main.png
   ```

#### Images broken after build
**Solutions:**
1. **Use proper import syntax:**
   ```jsx
   // ✅ Correct
   import image from './assets/image.png'
   
   // ❌ Incorrect (won't work in production)
   <img src="/src/assets/image.png" />
   ```

2. **Check build output:**
   ```bash
   # Verify images are in dist folder
   ls -la dist/assets/
   ```

## 🌐 Deployment Issues

### Netlify Problems

#### Build fails on Netlify
**Solutions:**
1. **Check Node.js version:**
   ```bash
   # Add to netlify.toml or environment variables:
   NODE_VERSION = "18"
   ```

2. **Verify build command:**
   ```bash
   # In Netlify settings:
   Build command: pnpm run build
   Publish directory: dist
   ```

3. **Check build logs:**
   - Go to Netlify dashboard
   - Click on failed deployment
   - Review build logs for specific errors

#### 404 errors on page refresh
**Solution:**
Create `public/_redirects` file:
```
/*    /index.html   200
```

### Vercel Problems

#### Build timeout
**Solutions:**
1. **Optimize build:**
   ```bash
   # Remove unused dependencies
   pnpm prune
   ```

2. **Check build settings:**
   ```json
   // vercel.json
   {
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": { "distDir": "dist" }
       }
     ]
   }
   ```

### GitHub Pages Issues

#### Site not updating
**Solutions:**
1. **Check GitHub Actions:**
   - Go to repository → Actions tab
   - Look for failed workflows

2. **Verify gh-pages branch:**
   ```bash
   git branch -a  # Should see gh-pages branch
   ```

3. **Check Pages settings:**
   - Repository Settings → Pages
   - Source should be "Deploy from a branch"
   - Branch should be "gh-pages"

## 📱 Browser & Device Issues

### Mobile Display Problems

#### Layout broken on mobile
**Solutions:**
1. **Check viewport meta tag:**
   ```html
   <!-- In index.html -->
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. **Test responsive classes:**
   ```jsx
   // Use Tailwind responsive prefixes
   <div className="text-sm md:text-lg lg:text-xl">
   ```

3. **Use browser dev tools:**
   - F12 → Toggle device toolbar
   - Test different screen sizes

### Browser Compatibility

#### Site not working in older browsers
**Solutions:**
1. **Check browser support:**
   ```bash
   # Modern browsers supported:
   # Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
   ```

2. **Add polyfills if needed:**
   ```bash
   pnpm add core-js
   ```

#### JavaScript errors in console
**Solutions:**
1. **Check for ES6+ features:**
   ```jsx
   // Use compatible syntax for target browsers
   ```

2. **Update browser:**
   - Recommend users update to latest version

## 🔍 Performance Issues

### Slow Loading

#### Large bundle size
**Solutions:**
1. **Analyze bundle:**
   ```bash
   pnpm run build
   npx vite-bundle-analyzer dist
   ```

2. **Optimize images:**
   ```bash
   # Compress images before adding to project
   # Use WebP format when possible
   ```

3. **Code splitting:**
   ```jsx
   // Lazy load components
   const LazyComponent = React.lazy(() => import('./Component'))
   ```

#### Slow development server
**Solutions:**
1. **Clear cache:**
   ```bash
   rm -rf node_modules/.vite
   pnpm run dev
   ```

2. **Check system resources:**
   ```bash
   # Close unnecessary applications
   # Ensure sufficient RAM available
   ```

## 🔐 Security & Access Issues

### HTTPS Problems

#### Mixed content warnings
**Solutions:**
1. **Use HTTPS for all resources:**
   ```jsx
   // ✅ Correct
   <img src="https://example.com/image.jpg" />
   
   // ❌ Avoid on HTTPS sites
   <img src="http://example.com/image.jpg" />
   ```

2. **Enable HTTPS on hosting:**
   - Most platforms provide free SSL certificates
   - Enable in hosting provider settings

### CORS Issues

#### API calls blocked
**Solutions:**
1. **Configure CORS on backend:**
   ```javascript
   // Express.js example
   app.use(cors({
     origin: ['http://localhost:5173', 'https://yourdomain.com']
   }))
   ```

2. **Use proxy in development:**
   ```javascript
   // vite.config.js
   export default {
     server: {
       proxy: {
         '/api': 'http://localhost:3000'
       }
     }
   }
   ```

## 🆘 Getting Additional Help

### Before Asking for Help

1. **Check this troubleshooting guide**
2. **Search existing issues** on GitHub/forums
3. **Try the quick fixes** listed above
4. **Gather error information:**
   - Exact error message
   - Browser console logs
   - Steps to reproduce
   - Operating system and browser version

### Where to Get Help

#### Community Resources
- **GitHub Issues**: Create detailed bug reports
- **Community Forum**: Ask questions and share solutions
- **Discord/Slack**: Real-time community support
- **Stack Overflow**: Technical programming questions

#### Professional Support
- **Hosting Provider**: Platform-specific issues
- **Development Team**: Feature requests and major bugs
- **Freelance Developers**: Custom modifications

### Creating Good Bug Reports

Include this information:
```
**Environment:**
- OS: [Windows 10, macOS 12, Ubuntu 20.04]
- Browser: [Chrome 96, Firefox 94, Safari 15]
- Node.js: [18.0.0]
- Package Manager: [pnpm 7.0.0]

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. See error...

**Expected Behavior:**
What should happen...

**Actual Behavior:**
What actually happens...

**Error Messages:**
[Paste exact error messages]

**Screenshots:**
[If applicable]
```

## 📚 Additional Resources

### Documentation
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **shadcn/ui**: https://ui.shadcn.com/

### Tools
- **Browser DevTools**: F12 in most browsers
- **React DevTools**: Browser extension
- **Lighthouse**: Performance auditing
- **Can I Use**: Browser compatibility checking

### Learning Resources
- **MDN Web Docs**: Web standards reference
- **React Tutorial**: Official React learning path
- **CSS-Tricks**: CSS and frontend techniques
- **Web.dev**: Performance and best practices

---

**Still stuck?** Don't hesitate to reach out to the community or development team. We're here to help you succeed! 🚀

