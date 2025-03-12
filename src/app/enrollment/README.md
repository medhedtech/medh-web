# Category-based Enrollment Pages

This directory contains the code for the enrollment system with category-specific pages.

## Implementation Details

### Current Implementation

The current implementation uses a query parameter approach for category-specific pages:

- Main enrollment page: `/enrollment`
- Category-specific page: `/enrollment?category=CATEGORY_NAME`

The categories are handled by the `category-template.js` file, which renders different content based on the `category` query parameter.

### Dynamic Routing (Future Implementation)

For a more SEO-friendly and cleaner URL structure, dynamic routing should be implemented:

```
/enrollment/[categoryname]/page.js
```

This would enable URLs like:
- `/enrollment/vedic-mathematics`
- `/enrollment/ai-and-data-science`
- `/enrollment/digital-marketing`
- `/enrollment/personality-development`

## How to Use the Category Template

The `category-template.js` file is designed to be used with query parameters:

1. From the main enrollment page, users can click on category links
2. The links navigate to `/enrollment?category=CATEGORY_NAME`
3. The template reads the category from the URL and renders appropriate content

## Available Categories

| Category Slug | Display Name | Primary Color |
|---------------|--------------|---------------|
| `vedic-mathematics` | Vedic Mathematics | Emerald |
| `ai-and-data-science` | AI & Data Science | Violet |
| `digital-marketing` | Digital Marketing | Amber |
| `personality-development` | Personality Development | Pink |

## Styling

Each category has its own color scheme and styling:

- The `styles.css` file contains category-specific CSS variables
- The page uses dynamic styling based on the selected category
- Categories have unique icons and visual treatments

## Implementing the Full Dynamic Routes

To convert to full dynamic routing:

1. Create a directory structure:
   ```
   src/app/enrollment/[categoryname]/
     - page.js        # Main category page component
     - layout.js      # Layout with metadata generation
     - categoryUtils.js  # Category-specific utilities
     - styles.css     # Category-specific styles
   ```

2. Use the templates created in this directory as a starting point

3. Implement `generateMetadata` in the `layout.js` file to generate SEO tags based on the category

4. Update category links across the application to point to these dynamic routes 