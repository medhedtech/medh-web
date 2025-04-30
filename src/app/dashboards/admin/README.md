# Admin Pages Structure Guidelines

This folder contains all admin dashboard pages. Each page is organized under its own folder to maintain a clean structure.

## How to Create a New Admin Page

1. Create a new folder for your page under `src/app/dashboards/admin/` (use kebab-case)
2. Create a `page.tsx` file inside that folder
3. Use the following template:

```tsx
import { Metadata } from "next";
import YourComponentMain from "@/components/path/to/your/component";

export const metadata: Metadata = {
  title: "Your Page Title | Medh",
  description: "Description of your page",
};

export default function YourAdminPage() {
  return (
    <YourComponentMain />
  );
}
```

## Benefits of This Structure

- All admin pages use the same layout with sidebar
- No need to duplicate layout code in each page
- Mobile-friendly sidebar is included automatically
- Consistent user experience across all admin pages
- Better organization of code

## Example Pages

- `/admin` - Main admin dashboard
- `/admin/course-card-editor` - Course card editor 
- Add more pages in a similar pattern

## Note

When migrating existing pages from the old structure:
1. Create a new page in the proper location following this structure
2. Convert the old page to a redirect to maintain compatibility with existing links 