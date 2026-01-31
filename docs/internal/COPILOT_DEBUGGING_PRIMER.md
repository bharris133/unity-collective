# Unity Collective - Debugging & Testing Primer

## 🎯 Your Mission

Debug the blank page issue after recent refactoring, verify all functionality works, and run tests. Complete all tasks in a single pass.

---

## ⚠️ Current Issue

**Problem**: Application builds successfully but shows a **blank white page** in the browser.

**What Works**:
- ✅ Build passes (`pnpm run build`)
- ✅ Dev server starts (`pnpm run dev`)
- ✅ No TypeScript errors
- ✅ All imports are correct

**What Doesn't Work**:
- ❌ Page renders blank (white screen)
- ❌ React app not mounting

**Likely Cause**: JavaScript runtime error preventing React from rendering (possibly in HomePage or a component it imports).

---

## 📋 Tasks to Complete

### 1. **Debug the Blank Page** (CRITICAL)
- Start dev server: `pnpm run dev`
- Open browser to http://localhost:5173
- Open DevTools Console (F12)
- Identify the JavaScript error
- Fix the error

### 2. **Test All Routes**
- Navigate to each route and verify it loads:
  - `/` - HomePage
  - `/community` - CommunityPage
  - `/directory` - BusinessDirectoryPage
  - `/marketplace` - MarketplacePage
  - `/education` - EducationPage
  - `/media` - MediaCenterPage
  - `/about` - AboutPage

### 3. **Verify Data Service Integration**
- Check that products load from `productService`
- Verify MarketplaceContext uses the service correctly
- Test data displays properly on marketplace page

### 4. **Run Tests**
- Unit tests: `pnpm test:run`
- Verify all tests pass
- Fix any failing tests

---

## 🗂️ Essential Files to Check

### Core Application Files

**1. `/src/App.jsx`** (Main app component)
- Routes configuration
- Context providers setup
- Navigation and Footer

**2. `/src/pages/HomePage.jsx`** (Most likely culprit)
- Recently extracted from App.jsx
- Check for missing imports or syntax errors
- Verify all components are properly imported

**3. `/src/contexts/MarketplaceContext.tsx`** (Data service integration)
- Recently updated to use productService
- Check async data loading
- Verify state initialization

**4. `/src/services/productService.ts`** (Data service)
- Provides products data
- Check export/import correctness

### Other Page Components (Check if HomePage works)

- `/src/pages/BusinessDirectoryPage.jsx`
- `/src/pages/CommunityPage.jsx`
- `/src/pages/EducationPage.jsx`
- `/src/pages/MediaCenterPage.jsx`
- `/src/pages/AboutPage.jsx`

### Configuration

**5. `/vite.config.js`** (Build configuration)
- Server settings already configured
- Port 5173 with host binding

**6. `/package.json`** (Scripts and dependencies)
- Test scripts available
- All dependencies installed

---

## 🔍 Debugging Strategy

### Step 1: Start the Dev Server
```bash
cd /home/ubuntu/unity-collective-fresh
pnpm run dev
```

### Step 2: Open Browser DevTools
1. Navigate to http://localhost:5173
2. Press F12 to open DevTools
3. Go to Console tab
4. Look for red error messages

### Step 3: Common Issues to Check

**A. Missing React Import**
```javascript
// HomePage.jsx should have:
import React from 'react';
```

**B. Incorrect Component Export**
```javascript
// Each page should have:
export default HomePage; // or ComponentName
```

**C. Missing Dependencies**
```javascript
// Check all imports resolve correctly
// Look for "Cannot find module" errors
```

**D. Async Data Loading Error**
```javascript
// In MarketplaceContext.tsx
// Check useEffect for data loading
// Verify error handling
```

**E. Component Rendering Error**
```javascript
// Check for undefined props
// Verify all JSX is valid
// Look for missing closing tags
```

### Step 4: Fix the Error

Once you identify the error in the console:
1. Open the file mentioned in the error
2. Go to the line number indicated
3. Fix the issue (likely a missing import, typo, or undefined variable)
4. Save the file
5. Browser should auto-reload

### Step 5: Test Navigation

After fixing the blank page:
```bash
# Manually test each route in the browser:
http://localhost:5173/
http://localhost:5173/community
http://localhost:5173/directory
http://localhost:5173/marketplace
http://localhost:5173/education
http://localhost:5173/media
http://localhost:5173/about
```

### Step 6: Run Tests
```bash
# Run all unit tests
pnpm test:run

# If tests fail, fix them and re-run
```

---

## 🔧 Quick Fixes Reference

### If HomePage is missing React import:
```javascript
// Add at top of HomePage.jsx
import React from 'react';
```

### If MarketplaceContext has async error:
```javascript
// Check this pattern in MarketplaceContext.tsx
useEffect(() => {
  const loadProducts = async () => {
    try {
      const products = await getProducts();
      setSampleProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
      setSampleProducts([]); // Fallback to empty array
    }
  };
  loadProducts();
}, []);
```

### If component export is wrong:
```javascript
// Each page component should end with:
export default ComponentName;
```

---

## ✅ Success Criteria

### Task 1: Debug Complete
- [ ] Dev server running without errors
- [ ] Browser shows the homepage (not blank)
- [ ] No console errors
- [ ] React app is mounted and rendering

### Task 2: Routes Tested
- [ ] All 7 routes load successfully
- [ ] Navigation between pages works
- [ ] No broken links or 404 errors

### Task 3: Data Service Verified
- [ ] Products load on marketplace page
- [ ] Data comes from productService
- [ ] No data loading errors

### Task 4: Tests Pass
- [ ] `pnpm test:run` completes successfully
- [ ] All unit tests pass
- [ ] No test failures

---

## 📊 Project Context

### Recent Changes
- **Refactoring**: Extracted 6 page components from App.jsx (791 lines → ~200 lines)
- **Data Service**: Integrated productService with MarketplaceContext
- **Build Status**: ✅ Passes successfully
- **Runtime Status**: ❌ Blank page (needs debugging)

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **State**: React Context API
- **Routing**: React Router v6
- **Testing**: Vitest (112 tests)
- **Package Manager**: pnpm

### File Structure
```
src/
├── App.jsx                    # Main app with routing
├── pages/                     # Page components (newly extracted)
│   ├── HomePage.jsx
│   ├── BusinessDirectoryPage.jsx
│   ├── CommunityPage.jsx
│   ├── EducationPage.jsx
│   ├── MediaCenterPage.jsx
│   └── AboutPage.jsx
├── contexts/                  # React contexts
│   ├── AuthContext.jsx
│   ├── MarketplaceContext.tsx # Uses productService
│   └── FavoritesContext.jsx
├── services/                  # Data services
│   ├── productService.ts      # Product data abstraction
│   ├── businessService.ts
│   └── offerService.ts
├── data/                      # Mock data
│   ├── mockProducts.js
│   ├── mockBusinesses.js
│   └── mockOffers.js
└── components/                # Reusable components
    └── ui/                    # UI components
```

---

## 🚀 Getting Started

```bash
# 1. Navigate to project
cd /home/ubuntu/unity-collective-fresh

# 2. Ensure dependencies are installed
pnpm install

# 3. Start dev server
pnpm run dev

# 4. Open browser to http://localhost:5173

# 5. Open DevTools (F12) and check Console for errors

# 6. Fix the error you find

# 7. Test all routes manually

# 8. Run tests
pnpm test:run

# 9. Commit your fixes
git add .
git commit -m "fix: resolve blank page issue and verify all tests pass"
git push
```

---

## 💡 Pro Tips

1. **Check Console First**: The browser console will tell you exactly what's wrong
2. **Start with HomePage**: It's the most likely culprit since it was just extracted
3. **Check Imports**: Missing or incorrect imports are the most common issue
4. **Test Incrementally**: Fix one issue, test, then move to the next
5. **Read Error Messages**: They usually point directly to the problem

---

## 📞 Expected Outcome

After completing all tasks, you should have:

1. ✅ Application rendering correctly in the browser
2. ✅ All routes working and navigable
3. ✅ Data loading from productService
4. ✅ All tests passing
5. ✅ Changes committed and pushed

---

**Good luck! The issue is likely simple - probably a missing import or small syntax error. Check the browser console first!**

---

*Last Updated: January 30, 2026*  
*Related PR: #8 (merged)*  
*Current Branch: main*
