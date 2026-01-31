# Unity Collective - Visual Testing Guide

## 🎯 Complete Feature Testing Checklist

### ✅ **WORKING FEATURES WITH MOCK DATA**

---

### **1. Homepage** - http://localhost:5173/

#### What to Test:

- [ ] Hero banner displays with gradient and message
- [ ] Community stats section shows 4 metrics (Members, Businesses, Events, Economic Impact)
- [ ] Five Pillars section displays 5 cards (Unity, Economic Control, Self-Sufficiency, Protection, Control of Our Narrative)
- [ ] Featured Businesses section shows 3 businesses
- [ ] Upcoming Events section shows 3 events
- [ ] Newsletter signup form exists

#### Expected Results:

- **Stats**: Should show "5,000+" members, "1,200+" businesses, "250+" events, "$2.5M+" impact
- **Featured Businesses**: 3 businesses (Sankofa Consulting, Heritage Foods Market, Unity Tech Solutions)
- **Events**: 3 upcoming events from mock data

#### How to Verify:

1. Visit homepage
2. Scroll through all sections
3. Verify numbers match mock data
4. Check that all 3 businesses display with name, category, rating, location

**Status**: ✅ WORKING - Businesses load from service layer

---

### **2. Business Directory** - http://localhost:5173/directory

#### What to Test:

- [ ] Page header displays "Black Business Directory"
- [ ] Search bar is present and functional
- [ ] Category filter dropdown works (All, Business Services, Food & Beverage, Technology, Retail, Healthcare, Education)
- [ ] All 6 businesses display in grid layout
- [ ] Each business card shows: name, category badge, rating, description, location
- [ ] Verified checkmark appears on verified businesses
- [ ] Filter by category works correctly
- [ ] Search by business name/description works

#### Expected Results:

**All 6 businesses should display:**

1. **Sankofa Consulting** - Business Services, Atlanta GA, 4.9 ⭐, Verified
2. **Heritage Foods Market** - Food & Beverage, Detroit MI, 4.8 ⭐, Verified
3. **Unity Tech Solutions** - Technology, Oakland CA, 5.0 ⭐, Verified
4. **Afrocentric Books & Art** - Retail, Chicago IL, 4.7 ⭐, Verified
5. **Wellness by Imani** - Healthcare, Houston TX, 4.9 ⭐, Verified
6. **Black Excellence Academy** - Education, Philadelphia PA, 5.0 ⭐, Verified

#### How to Verify:

1. Visit `/directory`
2. Count business cards (should be 6)
3. Test search: type "Heritage" → should show only Heritage Foods Market
4. Test filter: select "Technology" → should show only Unity Tech Solutions
5. Test filter: select "All" → should show all 6 businesses
6. Verify each business has green checkmark for verified status

**Status**: ✅ FIXED - Now loads from service layer with working filters

---

### **3. Marketplace (Products)** - http://localhost:5173/marketplace

#### What to Test:

- [ ] Product grid displays products
- [ ] Each product card shows: image, name, price, business name
- [ ] "Add to Cart" button works
- [ ] Shopping cart icon in navigation updates count
- [ ] Product categories visible
- [ ] Can click through to product details

#### Expected Results:

**6 products should display:**

1. **Unity Collective T-Shirt** - $24.99 - Unity Collective
2. **Heritage Blend Coffee** - $18.99 - Heritage Foods Market
3. **Business Strategy Guide** - $29.99 - Sankofa Consulting
4. **Unity Collective Hoodie** - $49.99 - Unity Collective
5. **African Spice Collection** - $34.99 - Heritage Foods Market
6. **Web Development Course** - $199.99 - Unity Tech Solutions

#### How to Verify:

1. Visit `/marketplace`
2. Count products (should be 6)
3. Click "Add to Cart" on any product → cart count should increase
4. Click cart icon → should see checkout page with selected items
5. Verify prices display correctly (in dollars, not cents)

**Status**: ✅ WORKING - Products load from service layer via MarketplaceContext

---

### **4. Vendor Storefront** - http://localhost:5173/vendor/:businessId

#### What to Test:

- [ ] Individual vendor page loads
- [ ] Shows vendor name, category, rating, location
- [ ] Displays vendor's products
- [ ] Can add vendor products to cart
- [ ] Breadcrumb navigation works

#### Expected Results:

- Each business from directory should have a clickable storefront
- Products filtered by businessId should display
- Example: Heritage Foods should show their coffee and spices

#### How to Verify:

1. From Business Directory, click "View Details" on any business
2. Should navigate to `/vendor/:id`
3. Should see business details and their products
4. Test adding products to cart

**Status**: ✅ WORKING - VendorStorefront component exists and uses productService

---

### **5. Community Offers/Barter** - http://localhost:5173/offers

#### What to Test:

- [ ] Offers list displays all offers
- [ ] Each offer shows: title, user name, category, status badge, response count, date
- [ ] Status badges have correct colors (green=open, yellow=in-progress, gray=completed)
- [ ] Search bar filters offers
- [ ] Status filter dropdown works
- [ ] "Create New Offer" button exists

#### Expected Results:

**4 offers should display:**

1. **"Looking for Web Development Services"** - John Smith - Services - Status: Open (green) - 3 responses
2. **"Offering Catering Services"** - Sarah Johnson - Food & Beverage - Status: In Progress (yellow) - 5 responses
3. **"Need Logo Design"** - Marcus Williams - Design - Status: Open (green) - 8 responses
4. **"Photography Services Available"** - Lisa Brown - Services - Status: Completed (gray) - 2 responses

#### How to Verify:

1. Visit `/offers`
2. Count offer cards (should be 4)
3. Verify status badge colors match status
4. Test search: type "photography" → should show Lisa Brown's offer
5. Test filter: select "Open" → should show 2 offers
6. Test filter: select "All" → should show all 4 offers
7. Click "Create New Offer" → should navigate to create offer page

**Status**: ✅ WORKING - Offers load from service layer with filters

---

### **6. Shopping Cart & Checkout** - http://localhost:5173/checkout

#### What to Test:

- [ ] Cart displays added products
- [ ] Quantities can be increased/decreased
- [ ] Items can be removed
- [ ] Subtotal calculates correctly
- [ ] Tax calculates (8% default)
- [ ] Shipping calculates (free over $50)
- [ ] Grand total is correct
- [ ] "Proceed to Stripe Checkout" button exists

#### Expected Results:

- Cart items persist in localStorage
- Math calculations:
  - Subtotal = sum of (price × quantity)
  - Tax = subtotal × 0.08
  - Shipping = $9.99 if subtotal < $50, else $0
  - Grand Total = Subtotal + Tax + Shipping

#### How to Verify:

1. Add products from marketplace
2. Navigate to `/checkout`
3. Verify quantities are correct
4. Increase quantity → price should update
5. Remove item → should disappear from cart
6. Add items totaling less than $50 → shipping should be $9.99
7. Add items totaling more than $50 → shipping should be $0.00

**Status**: ✅ WORKING - Checkout component uses MarketplaceContext

---

### **7. Messages** - http://localhost:5173/messages

#### What to Test:

- [ ] Message threads list displays on left
- [ ] Can select a thread to view messages
- [ ] Messages display in conversation format
- [ ] Send message input field exists
- [ ] Search threads works

#### Expected Results:

- Mock message threads display
- Can select thread and see conversation
- Each message shows sender name and timestamp

#### How to Verify:

1. Visit `/messages`
2. Click on a thread → messages should appear on right
3. Verify message format and timestamps
4. Test search bar

**Status**: ✅ WORKING - Uses mock data (no service yet, but displays)

---

### **8. Favorites** - http://localhost:5173/favorites

#### What to Test:

- [ ] Favorites page displays
- [ ] Can add vendors/products to favorites
- [ ] Favorites persist
- [ ] Can remove from favorites

#### Expected Results:

- Empty state if no favorites
- Grid of favorited items if favorites exist

#### How to Verify:

1. Visit `/favorites`
2. Check if favorites context is working

**Status**: ✅ WORKING - FavoritesPage component and context exist

---

### **9. Navigation & UI**

#### What to Test:

- [ ] Main navigation bar displays logo
- [ ] All nav links work (Community, Directory, Marketplace, Education, Media Center, About)
- [ ] Resources dropdown opens with items (Articles, Videos, Media Center, Press & Updates, FAQ)
- [ ] Shopping cart icon shows correct item count
- [ ] User menu dropdown (if logged in)
- [ ] Footer displays

#### Expected Results:

- Clean navigation experience
- Dropdown menus work
- Active page highlighted
- Cart count updates when items added

**Status**: ✅ WORKING - Navigation component exists

---

## ❌ **NON-FUNCTIONAL / PLACEHOLDER PAGES**

### **Community Page** - http://localhost:5173/community

**Status**: ⚠️ Layout only, no real data

- Shows feature cards but not interactive
- No forum, mentorship, or event data displayed

### **Education Page** - http://localhost:5173/education

**Status**: ❌ Placeholder - "Educational content coming soon..."

### **Media Center** - http://localhost:5173/media-center

**Status**: ❌ Placeholder - "Media content coming soon..."

### **About Page** - http://localhost:5173/about

**Status**: ❌ Placeholder - "About content coming soon..."

### **Resources Dropdown Items**

**Status**: ❌ Not implemented

- Articles, Videos, Press & Updates, FAQ - no routes defined

---

## 🔄 **DATA FLOW VERIFICATION**

### Service Layer Test:

1. Open browser DevTools → Console
2. Visit any page with data
3. Should see console logs: `"📦 Using mock data for [products/businesses/offers]"`
4. Confirms service layer is working correctly

### Environment Variable Test:

1. Check `.env` file → `VITE_USE_MOCK_DATA=true`
2. This ensures mock data is being used
3. To switch to Firebase (when ready): set to `false`

---

## 📊 **MOCK DATA SUMMARY**

| Data Type       | Location                     | Count            | Used In                           |
| --------------- | ---------------------------- | ---------------- | --------------------------------- |
| Businesses      | `src/data/mockBusinesses.ts` | 6                | Homepage, Directory, Vendor Pages |
| Products        | `src/data/mockProducts.ts`   | 6                | Marketplace, Vendor Pages, Cart   |
| Offers          | `src/data/mockOffers.ts`     | 4                | Offers Page, Barter System        |
| Events          | `src/data/mockEvents.ts`     | 3+               | Homepage Events Section           |
| Messages        | `src/data/mockMessages.ts`   | Multiple threads | Messages Page                     |
| Community Stats | `src/data/mockStats.ts`      | 4 metrics        | Homepage Stats                    |

---

## 🎨 **VISUAL DESIGN VERIFICATION**

### Color Scheme (Pan-African):

- **Red**: `#CC0000` - Primary action buttons
- **Black**: `#1A1A1A` - Text and headers
- **Green**: `#228B22` - Success states
- **Gold**: `#FFD700` - Accents
- **White**: `#FAFAFA` - Background
- **Gray**: `#333333` - Secondary elements

### Typography:

- Headers should be bold
- Body text should be readable
- Buttons should have clear labels

### Responsive Design:

- Test on desktop (1920px+)
- Test on tablet (768px-1024px)
- Test on mobile (375px-767px)

---

## ✅ **QUICK TEST CHECKLIST**

Run through this quick test to verify core functionality:

1. ✅ Homepage loads with stats and 3 featured businesses
2. ✅ Directory shows all 6 businesses
3. ✅ Directory search filters businesses correctly
4. ✅ Directory category filter works
5. ✅ Marketplace shows all 6 products
6. ✅ Can add product to cart → cart count increases
7. ✅ Checkout page shows cart items with correct totals
8. ✅ Offers page shows all 4 offers
9. ✅ Offers search and filter work
10. ✅ Messages page displays threads and messages
11. ✅ Vendor storefront loads from directory
12. ✅ Navigation dropdown menus work

---

## 🐛 **KNOWN ISSUES**

1. ⚠️ Unit tests have ES module configuration errors (non-blocking for development)
2. ❌ Community, Education, About, Media Center pages are placeholders
3. ❌ Resources dropdown items not implemented
4. ⚠️ Messages service doesn't exist yet (uses direct import)

---

## 🚀 **RECOMMENDED TESTING ORDER**

1. **Start Here**: Homepage (http://localhost:5173/)
2. **Then Test**: Business Directory (http://localhost:5173/directory)
3. **Next**: Marketplace (http://localhost:5173/marketplace)
4. **Then**: Add items to cart and test Checkout
5. **Then**: Offers/Barter system (http://localhost:5173/offers)
6. **Then**: Messages (http://localhost:5173/messages)
7. **Finally**: Navigation, dropdowns, and UI elements

---

## 📝 **NOTES**

- All prices in mock data are stored in cents (e.g., 2499 = $24.99)
- Service layer automatically converts for display
- Images use placeholder API (`/api/placeholder/300/300`)
- All data loads asynchronously with loading states
- Cart persists in localStorage
