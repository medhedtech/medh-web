This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Medh Web

The Medh Web platform is a modern EdTech solution built with Next.js, React, Tailwind CSS, and a comprehensive tech stack.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## API Configuration

The project uses a standardized approach to manage API endpoints across different environments.

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# API Configuration
# Base URLs for different environments
NEXT_PUBLIC_API_URL_DEV=http://localhost:8080/api/v1
NEXT_PUBLIC_API_URL_STAGING=https://api2.medh.co/api/v1
NEXT_PUBLIC_API_URL_PROD=https://api.medh.co/api/v1

# Main API URL - Set this to override environment-specific defaults
NEXT_PUBLIC_API_URL=

# Auth settings
NEXT_PUBLIC_BYPASS_AUTH=false
```

### How it works

The API configuration system works as follows:

1. If `NEXT_PUBLIC_API_URL` is set, it is used regardless of the environment.
2. Otherwise, the environment-specific URL is used based on `NODE_ENV`:
   - `NEXT_PUBLIC_API_URL_PROD` for production
   - `NEXT_PUBLIC_API_URL_TEST` for test environment
   - `NEXT_PUBLIC_API_URL_DEV` for development (default)
3. If no environment variables are set, sensible defaults are used.

The configuration is centralized in `src/apis/config.ts` and all API-related code uses this configuration.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Course Details Integration

The platform now features an integrated course details component (`CourseDetailsPage`) that provides:

- Unified display of course information including about, curriculum, reviews, FAQs, and certificates
- Dynamic tab-based navigation that changes content without requiring page scrolling
- Consistent styling across different sections and course types
- Responsive design with animations and interactive elements

### Implementation Details

The `CourseDetailsPage` component has been integrated into the enrollment flow and uses:

- Tab-based navigation with `CourseNavigation` component
- Dynamic content rendering based on the active tab
- Framer Motion animations for smooth transitions
- Consistent API data handling with appropriate fallbacks

### Usage Examples

To use the integrated course details component:

```jsx
<CourseDetailsPage 
  courseId={selectedCourse?._id} 
  initialActiveSection="about"
/>
```

The component accepts:
- `courseId`: The ID of the course to display
- `initialActiveSection`: The tab to display by default (options: about, curriculum, reviews, faq, certificate)

## Development Guidelines

Please refer to the project documentation for development guidelines, coding standards, and contribution requirements.

## Admin Currency Management

The platform includes a robust currency management system that allows administrators to:

- View and manage supported currencies
- Update exchange rates manually or via API
- Set the default currency for new users
- Enable/disable automatic currency detection
- Add new currencies or remove existing ones

### How it works

The currency management system is built on a flexible context-based architecture:

1. **CurrencyContext**: Provides currency data and conversion functions to all components
2. **AdminCurrency Component**: Admin interface for managing currencies
3. **Local Storage**: Persists currency settings between sessions

### Admin Features

- **View all currencies**: See a complete table of supported currencies with their codes, symbols, and exchange rates
- **Edit exchange rates**: Update rates manually to reflect current market values
- **Add new currencies**: Add support for additional currencies with custom symbols and rates
- **Remove currencies**: Remove currencies that are no longer needed (except USD, which is the base currency)
- **Set default currency**: Choose which currency should be used by default for new users
- **Toggle auto-detection**: Enable or disable automatic currency detection based on user's location

### Technical Implementation

The currency system uses:
- React Context API for global state management
- Local Storage for persisting settings
- Browser geolocation API for automatic currency detection
- Admin UI built with React and styled with Tailwind CSS

### Currency Conversion

All prices in the system are stored in USD and converted on-the-fly using current exchange rates. The conversion happens in the client, ensuring users always see prices in their preferred currency.
