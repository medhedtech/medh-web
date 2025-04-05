# Medh Web Platform - Technical Context

## Technologies Used
1. Frontend Framework
   - Next.js 14.x
   - React 18.x
   - TypeScript 5.x
   - Tailwind CSS 3.x

2. State Management
   - React Hooks
   - Context API
   - SWR/React Query
   - Custom Hooks

3. Styling
   - Tailwind CSS
   - CSS Modules
   - PostCSS
   - Custom Design System

4. API Integration
   - RESTful APIs
   - JWT Authentication
   - Axios/Fetch
   - API Client Utilities

## Development Setup
1. Environment Requirements
   - Node.js 18.x or higher
   - npm 9.x or higher
   - Git
   - VS Code (recommended)

2. Local Development
   ```bash
   # Install dependencies
   npm install

   # Run development server
   npm run dev

   # Build for production
   npm run build

   # Start production server
   npm start
   ```

3. Environment Variables
   ```
   NEXT_PUBLIC_API_URL=
   NEXT_PUBLIC_AUTH_TOKEN=
   NEXT_PUBLIC_GA_ID=
   ```

## Technical Constraints
1. Browser Support
   - Chrome (latest 2 versions)
   - Firefox (latest 2 versions)
   - Safari (latest 2 versions)
   - Edge (latest 2 versions)

2. Performance Targets
   - First Contentful Paint < 1.5s
   - Time to Interactive < 3s
   - Lighthouse Score > 90

3. Accessibility
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader support
   - Color contrast requirements

## Dependencies
1. Core Dependencies
   ```json
   {
     "next": "^14.0.0",
     "react": "^18.2.0",
     "react-dom": "^18.2.0",
     "typescript": "^5.0.0",
     "tailwindcss": "^3.0.0"
   }
   ```

2. Development Dependencies
   ```json
   {
     "@types/node": "^20.0.0",
     "@types/react": "^18.0.0",
     "@types/react-dom": "^18.0.0",
     "eslint": "^8.0.0",
     "prettier": "^3.0.0"
   }
   ```

3. Additional Dependencies
   ```json
   {
     "axios": "^1.0.0",
     "swr": "^2.0.0",
     "react-query": "^4.0.0",
     "jwt-decode": "^3.0.0"
   }
   ```

## Build Configuration
1. Next.js Config
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
     images: {
       domains: ['medh.com'],
     },
     i18n: {
       locales: ['en'],
       defaultLocale: 'en',
     },
   }
   ```

2. TypeScript Config
   ```json
   {
     "compilerOptions": {
       "target": "es5",
       "lib": ["dom", "dom.iterable", "esnext"],
       "allowJs": true,
       "skipLibCheck": true,
       "strict": true,
       "forceConsistentCasingInFileNames": true,
       "noEmit": true,
       "esModuleInterop": true,
       "module": "esnext",
       "moduleResolution": "node",
       "resolveJsonModule": true,
       "isolatedModules": true,
       "jsx": "preserve",
       "incremental": true
     }
   }
   ```

3. Tailwind Config
   ```javascript
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       './src/**/*.{js,ts,jsx,tsx}',
     ],
     theme: {
       extend: {
         colors: {
           primary: '#3B82F6',
           secondary: '#10B981',
         },
       },
     },
     plugins: [],
   }
   ```

## Development Tools
1. Code Quality
   - ESLint
   - Prettier
   - TypeScript
   - Husky

2. Testing
   - Jest
   - React Testing Library
   - Cypress
   - Playwright

3. Monitoring
   - Google Analytics
   - Error tracking
   - Performance monitoring
   - User analytics

## Deployment
1. Production Environment
   - Vercel (primary)
   - AWS (backup)
   - CI/CD pipeline
   - Automated testing

2. Staging Environment
   - Preview deployments
   - Feature branches
   - Integration testing
   - Performance testing

3. Development Environment
   - Local development
   - Docker containers
   - Mock services
   - Hot reloading 