# Pan-African Dark Theme

## Description
The Pan-African Dark Theme is the global visual design system for the [Unity Collective] platform. It replaces the default light theme with a vibrant, culturally resonant dark theme featuring deep black backgrounds, white text, and bold red, gold, and green accents. This theme is applied globally via CSS variables and locally via Tailwind utility classes.

## Files Involved
- `src/App.css` (Global CSS variables)
- `src/pages/HomePage.tsx`
- `src/components/MarketplacePage.tsx`
- `src/pages/BusinessDirectoryPage.tsx`
- `src/pages/CommunityPage.tsx`
- `src/components/MessagesPage.tsx`
- `src/components/OffersPage.tsx`
- `src/components/FavoritesPage.tsx`
- `src/pages/EducationPage.tsx`
- `src/pages/MediaCenterPage.tsx`
- `src/pages/AboutPage.tsx`

## How to Make Changes
To modify the global theme colors, update the CSS variables in `src/App.css`:
```css
:root {
  --bg-primary: #111111;
  --bg-card: #1E1E1E;
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
  --accent-red: #dc2626;
  --accent-gold: #D4AF37;
  --accent-green: #228B22;
}
```

To modify specific components, locate the Tailwind classes in the respective `.tsx` files. Common patterns include:
- Backgrounds: `bg-[#111111]` or `bg-[#1E1E1E]`
- Text: `text-white` or `text-gray-400`
- Borders: `border-white/10`

## How to Add Items to Scope
When creating new pages or components, ensure they adhere to the dark theme by default:
1. Use `bg-[#111111]` for main page wrappers.
2. Use `bg-[#1E1E1E]` for cards and containers.
3. Use `text-white` for headings and primary text.
4. Use `text-gray-400` for secondary text and descriptions.
5. Use `border-white/10` for subtle borders.
6. Use `text-red-600` or `bg-red-600` for primary actions.
