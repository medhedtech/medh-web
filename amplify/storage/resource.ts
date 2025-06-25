import { defineStorage } from '@aws-amplify/backend';
import { type ClientSchema, a } from '@aws-amplify/backend';

/**
 * Medh Storage Configuration
 * Defines storage buckets and access patterns for:
 * - Course materials (PDFs, videos, etc.)
 * - User uploads (assignments, projects)
 * - Public assets (images, marketing materials)
 * - Temporary uploads (for processing)
 */
export const storage = defineStorage({
  // Course Materials Bucket
  courseMaterials: {
    // Authenticated users can read course materials
    read: ['authenticated'],
    // Only admins and instructors can upload course materials
    write: ['admin', 'instructor'],
    // Configure bucket for course content
    bucketConfiguration: {
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods: ['GET', 'PUT', 'POST'],
          allowedOrigins: ['*'],
          maxAge: 3600,
        },
      ],
      // Enable versioning for course materials
      versioned: true,
    },
    // Define access patterns for course materials
    accessPatterns: {
      'courses/*': {
        read: ['authenticated'],
        write: ['admin', 'instructor'],
      },
      'lectures/*': {
        read: ['authenticated'],
        write: ['admin', 'instructor'],
      },
    },
  },

  // User Uploads Bucket
  userUploads: {
    // Users can read their own uploads
    read: ['authenticated'],
    // Users can write to their own directory
    write: ['authenticated'],
    // Configure bucket for user content
    bucketConfiguration: {
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
          allowedOrigins: ['*'],
          maxAge: 3600,
        },
      ],
      // Enable lifecycle rules for user uploads
      lifecycle: {
        rules: [
          {
            // Move files to infrequent access after 90 days
            transition: {
              storageClass: 'STANDARD_IA',
              transitionAfterDays: 90,
            },
          },
        ],
      },
    },
    // Define access patterns for user uploads
    accessPatterns: {
      'users/${cognito:username}/*': {
        read: ['authenticated'],
        write: ['owner'],
      },
      'assignments/*': {
        read: ['authenticated'],
        write: ['owner', 'instructor'],
      },
    },
  },

  // Public Assets Bucket
  publicAssets: {
    // Anyone can read public assets
    read: ['public'],
    // Only admins can write to public assets
    write: ['admin'],
    // Configure bucket for public content
    bucketConfiguration: {
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods: ['GET'],
          allowedOrigins: ['*'],
          maxAge: 3600,
        },
      ],
      // Enable CloudFront distribution for public assets
      cloudfront: {
        enabled: true,
        // Configure caching behavior
        defaultTTL: 86400, // 24 hours
        maxTTL: 31536000, // 1 year
        minTTL: 0,
      },
    },
    // Define access patterns for public assets
    accessPatterns: {
      'images/*': {
        read: ['public'],
        write: ['admin'],
      },
      'marketing/*': {
        read: ['public'],
        write: ['admin'],
      },
    },
  },

  // Temporary Storage Bucket
  tempUploads: {
    // Authenticated users can read and write temporary files
    read: ['authenticated'],
    write: ['authenticated'],
    // Configure bucket for temporary content
    bucketConfiguration: {
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
          allowedOrigins: ['*'],
          maxAge: 3600,
        },
      ],
      // Set lifecycle rules for temporary files
      lifecycle: {
        rules: [
          {
            // Delete files after 24 hours
            expiration: {
              days: 1,
            },
          },
        ],
      },
    },
    // Define access patterns for temporary uploads
    accessPatterns: {
      'temp/${cognito:username}/*': {
        read: ['authenticated'],
        write: ['owner'],
      },
    },
  },
});

/*== Frontend Usage Examples =================================================
Example usage of storage features in your frontend code:

1. Upload Course Material:
```typescript
await Storage.put('courses/react-basics/lecture1.pdf', file, {
  bucket: 'courseMaterials',
  contentType: 'application/pdf'
});

2. Get User Assignment:
```typescript
const assignment = await Storage.get('assignments/user123/week1.pdf', {
  bucket: 'userUploads'
});

3. Get Public Asset:
```typescript
const imageUrl = await Storage.get('images/logo.png', {
  bucket: 'publicAssets'
});

4. Upload Temporary File:
```typescript
await Storage.put('temp/user123/draft.doc', file, {
  bucket: 'tempUploads'
});
```
=========================================================================*/ 