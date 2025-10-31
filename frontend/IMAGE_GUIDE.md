# Adding More Farmer/Agriculture Product Images

## Current Setup
The home page now has:
- **Static text** that stays in place
- **Rotating background images** that change every 5 seconds
- Currently alternating between 2 images: `hero-paddy-field.jpg` and `fresh-produce.jpg`

## How to Add More Unique Images

### Step 1: Add Images to Assets Folder
Place your new images in: `src/assets/`

### Recommended Images for Agricultural Theme:
1. **Paddy/Rice Fields** - Green paddy fields (already have)
2. **Fresh Vegetables** - Colorful vegetable market (already have)
3. **Fruit Harvest** - Fresh fruits like mangoes, coconuts, bananas
4. **Farmer at Work** - Farmers working in fields
5. **Spice Collection** - Traditional Sri Lankan spices
6. **Coconut Plantation** - Coconut trees
7. **Tea Plantation** - Tea gardens
8. **Market Scene** - Local vegetable/fruit market
9. **Organic Vegetables** - Close-up of organic produce
10. **Grain Storage** - Rice, wheat, grains in baskets

### Step 2: Import Images in Index.tsx

At the top of the file (around line 6-7), add:
```typescript
import fruitHarvest from '@/assets/fruit-harvest.jpg';
import farmerField from '@/assets/farmer-field.jpg';
import spices from '@/assets/spices.jpg';
// Add more imports as needed
```

### Step 3: Update the heroImages Array

In `Index.tsx` (around line 27), update the array:
```typescript
const heroImages = [
  {
    image: heroPaddyField,
    alt: 'Paddy fields',
    gradient: 'from-green-900/90 via-green-800/85 to-emerald-700/80'
  },
  {
    image: freshProduce,
    alt: 'Fresh vegetables and produce',
    gradient: 'from-green-900/90 via-green-800/85 to-emerald-700/80'
  },
  {
    image: fruitHarvest,
    alt: 'Fresh fruit harvest',
    gradient: 'from-green-900/90 via-green-800/85 to-emerald-700/80'
  },
  {
    image: farmerField,
    alt: 'Farmer working in field',
    gradient: 'from-green-900/90 via-green-800/85 to-emerald-700/80'
  },
  {
    image: spices,
    alt: 'Traditional spices',
    gradient: 'from-green-900/90 via-green-800/85 to-emerald-700/80'
  }
];
```

## Image Requirements
- **Format**: JPG, PNG, or WebP
- **Size**: 1920x1080px or higher (Full HD recommended)
- **Aspect Ratio**: 16:9 for best results
- **File Size**: Keep under 500KB for faster loading (use compression tools)
- **Quality**: High resolution, good lighting
- **Theme**: Agriculture, farming, produce, Sri Lankan context

## Free Image Resources
You can find high-quality farmer/agriculture images from:
- **Unsplash.com** - Search: "farmer", "agriculture", "vegetables", "rice field"
- **Pexels.com** - Search: "farming", "produce", "harvest"
- **Pixabay.com** - Search: "agriculture", "farm products"

## Notes
- Each image will auto-rotate every 5 seconds
- Text will remain static on top of rotating images
- All images share the same green gradient overlay for consistency
- Images have a subtle zoom animation for visual interest
