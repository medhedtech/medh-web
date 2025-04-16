# Common FAQ Component

This document explains the new unified FAQ component design, its features, and how to migrate existing FAQ components to use this common design.

## Overview

The `CommonFaq` component is a reusable, highly customizable FAQ component that standardizes the design and functionality of FAQ sections across the Medh website. It is based on the design of the `HireFromMedhFaq` component but provides more flexibility and configuration options.

## Features

- **Consistent Design**: All FAQ sections share the same visual design and interactions
- **Customizable Themes**: Easily customize colors to match each section's design
- **API Integration**: Support for loading FAQs from API endpoints
- **Static FAQs**: Support for hardcoded FAQ data
- **Search Functionality**: Optional search capability for filtering FAQs
- **Category Filtering**: Optional category filtering for organizing FAQs
- **Animated Interactions**: Smooth animations and interactions using Framer Motion
- **Contact Section**: Optional contact information section
- **Responsive Design**: Works well on all device sizes
- **Accessibility**: Built with accessibility in mind
- **Dark Mode Support**: Works seamlessly in both light and dark mode

## Usage

### Basic Usage

```tsx
import CommonFaq from "@/components/shared/ui/CommonFaq";

const MyFaqSection = () => {
  return (
    <CommonFaq
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about our services."
      faqs={[
        {
          question: "What is your question?",
          answer: "Here is the answer to your question."
        },
        // Add more FAQs as needed
      ]}
    />
  );
};
```

### API Integration

```tsx
import CommonFaq from "@/components/shared/ui/CommonFaq";

const ApiBasedFaqSection = () => {
  return (
    <CommonFaq
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about our services."
      apiEndpoint="/api/faqs"
      categoriesEndpoint="/api/faq-categories" // Optional
      showCategories={true}
      showSearch={true}
    />
  );
};
```

### Custom Theming

```tsx
import CommonFaq from "@/components/shared/ui/CommonFaq";

const CustomThemedFaqSection = () => {
  return (
    <CommonFaq
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about our services."
      faqs={myFaqs}
      theme={{
        primaryColor: "#3b82f6", // Blue
        secondaryColor: "#8b5cf6", // Violet
        accentColor: "#f59e0b", // Amber
        showContactSection: true,
        contactEmail: "support@medh.co",
        contactText: "Have more questions? Contact our support team at"
      }}
    />
  );
};
```

### Icons and Custom Styling

```tsx
import CommonFaq, { IFAQ } from "@/components/shared/ui/CommonFaq";
import { HelpCircle, Book, Users } from "lucide-react";

const IconFaqSection = () => {
  const faqs: IFAQ[] = [
    {
      icon: <HelpCircle className="w-5 h-5" />,
      iconBg: "#3b82f6",
      iconColor: "#3b82f6",
      question: "What is your question?",
      answer: "Here is the answer to your question.",
      category: "general"
    },
    {
      icon: <Book className="w-5 h-5" />,
      iconBg: "#8b5cf6",
      iconColor: "#8b5cf6",
      question: "Another question?",
      answer: "Another detailed answer goes here.",
      category: "courses"
    },
    // Add more FAQs as needed
  ];

  return (
    <CommonFaq
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about our services."
      faqs={faqs}
      showCategories={true}
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "Frequently Asked Questions" | The main title of the FAQ section |
| `subtitle` | string | "Find answers to your most common questions" | The subtitle or description text |
| `faqs` | IFAQ[] | [] | Array of FAQ items (for static data) |
| `apiEndpoint` | string | undefined | API endpoint URL to fetch FAQs |
| `theme` | IFAQTheme | defaultTheme | Theme configuration for colors and contact info |
| `showSearch` | boolean | true | Whether to show the search input |
| `showCategories` | boolean | false | Whether to show category filters |
| `defaultCategory` | string | "all" | Initial selected category |
| `categoriesEndpoint` | string | undefined | API endpoint URL to fetch categories |
| `className` | string | "" | Additional CSS classes |

## IFAQ Interface

```tsx
interface IFAQ {
  _id?: string;
  id?: string | number;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  question: string;
  answer: string;
  category?: string;
}
```

## IFAQTheme Interface

```tsx
interface IFAQTheme {
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  contactEmail?: string;
  contactText?: string;
  showContactSection?: boolean;
}
```

## Migration Guide

To migrate existing FAQ components to use the new CommonFaq component:

1. Create a new file with the same name but with a `.tsx` extension
2. Import the CommonFaq component:
   ```tsx
   import CommonFaq, { IFAQ } from "@/components/shared/ui/CommonFaq";
   ```
3. If your component uses static FAQs:
   - Convert them to the IFAQ interface format
   - Pass them to the `faqs` prop
4. If your component fetches FAQs from an API:
   - Pass the API endpoint to the `apiEndpoint` prop
   - If it supports categories, pass the categories endpoint to the `categoriesEndpoint` prop
5. Configure the theme to match your existing design:
   ```tsx
   theme={{
     primaryColor: "#yourPrimaryColor",
     secondaryColor: "#yourSecondaryColor",
     accentColor: "#yourAccentColor",
     showContactSection: true, // or false
     contactEmail: "your@email.com", // if needed
     contactText: "Your contact text" // if needed
   }}
   ```
6. Set the appropriate values for `showSearch` and `showCategories`
7. Test your component to ensure it works as expected
8. Replace the original file with your new TypeScript component

## Migration Script

A migration script is available to help with the conversion process. Run it with:

```bash
node scripts/convert-faqs.js
```

This script will scan for all FAQ components and provide conversion examples for each one.

## Examples

For complete examples, see the following converted components:

- `src/components/sections/hire-from-medh/HireFromMedhFaq.tsx`
- `src/components/sections/faq/Faq.js`
- `src/components/sections/corporate-training/corporateFaq.tsx`

These components show different ways to use the CommonFaq component with various configurations.

## Best Practices

1. **Consistency**: Try to keep the same primary color for all FAQs in a particular section of the site
2. **Icons**: Use appropriate icons that help users understand the context of each question
3. **Categories**: If you have many FAQs, organize them into categories for better user experience
4. **Contact Info**: Include contact information for users who need more assistance
5. **Search**: Enable search for sections with more than 5-6 FAQs

## Troubleshooting

If you encounter issues with the CommonFaq component:

- Ensure you're passing the correct data format
- Check console errors for API issues
- Verify that all required properties are set
- Make sure theme colors are valid hex color codes

For additional help, refer to the implementation in `src/components/shared/ui/CommonFaq.tsx`. 