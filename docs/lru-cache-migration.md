# LRU Cache Migration Guide

## Overview

We've successfully migrated from the deprecated `inflight@1.0.6` module to a modern LRU (Least Recently Used) cache system powered by `lru-cache`. This upgrade provides superior performance, eliminates memory leaks, and adds advanced features like request coalescing and intelligent cache management.

## 🚀 Benefits of the New System

### 1. **Eliminates Deprecated Dependencies**
- ❌ **Before**: `inflight@1.0.6` (deprecated, memory leaks)
- ✅ **After**: `lru-cache` (actively maintained, secure)

### 2. **Superior Performance**
- **Intelligent Eviction**: LRU algorithm keeps frequently accessed data
- **Memory Management**: Automatic cleanup prevents memory leaks
- **Size Limits**: Configurable memory usage with `maxSize` option
- **TTL Support**: Built-in time-based expiration

### 3. **Request Coalescing**
- **Duplicate Prevention**: Multiple concurrent requests for the same resource are automatically merged
- **Network Efficiency**: Reduces server load and improves response times
- **Promise-Based**: Modern async/await support

### 4. **Advanced Features**
- **Size-Based Eviction**: Evict items based on memory usage
- **Statistics**: Built-in performance monitoring
- **Flexible Configuration**: Per-cache customization
- **TypeScript Support**: Full type safety

## 📊 Performance Comparison

| Feature | Old (Map-based) | New (LRU Cache) |
|---------|----------------|-----------------|
| Memory Management | Manual cleanup | Automatic LRU eviction |
| Request Deduplication | None | Built-in coalescing |
| Size Limits | None | Configurable |
| TTL Support | Manual timestamp checking | Built-in |
| Memory Leaks | Potential | Eliminated |
| Performance | O(1) get/set | O(1) get/set + intelligent eviction |

## 🔧 Implementation Details

### Core Cache Types

1. **APICache** - For HTTP API responses
2. **RequestCoalescingCache** - For duplicate request prevention
3. **AuthCache** - For authentication results
4. **AdvancedLRUCache** - General-purpose cache with advanced features

### Files Updated

- `src/utils/lruCache.ts` - New LRU cache implementation
- `src/utils/api.ts` - Updated API cache controller
- `src/hooks/getQuery.hook.ts` - Updated with request coalescing
- `src/examples/lruCacheExamples.ts` - Usage examples

## 📚 Usage Examples

### Basic API Caching

```typescript
import { apiCache } from '@/utils/lruCache';

// Check cache
const cachedData = apiCache.getResponse('/api/courses', { category: 'ai' });
if (cachedData) {
  return cachedData;
}

// Cache response
const response = await axios.get('/api/courses', { params: { category: 'ai' } });
apiCache.setResponse('/api/courses', { category: 'ai' }, response.data, 10 * 60 * 1000);
```

### Request Coalescing

```typescript
import { createCoalescingCache } from '@/utils/lruCache';

const courseCache = createCoalescingCache<CourseData>(
  async (courseId: string) => {
    // This will only be called once, even if multiple components
    // request the same course simultaneously
    const response = await axios.get(`/api/courses/${courseId}`);
    return response.data;
  },
  { max: 100, ttl: 15 * 60 * 1000 }
);

// Multiple concurrent calls = single API request
const [course1, course2, course3] = await Promise.all([
  courseCache.fetch('course-123'),
  courseCache.fetch('course-123'),
  courseCache.fetch('course-123'),
]);
```

### Advanced Request Deduplication

```typescript
import { requestCache } from '@/utils/lruCache';

// Automatically deduplicates concurrent requests
const userData = await requestCache.executeRequest(
  `user-${userId}`,
  async () => {
    const response = await axios.get(`/api/users/${userId}`);
    return response.data;
  },
  { ttl: 5 * 60 * 1000 }
);
```

### Custom Cache Implementation

```typescript
import { AdvancedLRUCache } from '@/utils/lruCache';

class CourseCache extends AdvancedLRUCache<string, Course> {
  constructor() {
    super({
      max: 200,
      ttl: 30 * 60 * 1000, // 30 minutes
      maxSize: 5 * 1024 * 1024, // 5MB
      sizeCalculation: (course) => JSON.stringify(course).length
    });
  }
  
  async getCourse(id: string): Promise<Course> {
    const cached = this.get(id);
    if (cached) return cached;
    
    const response = await axios.get(`/api/courses/${id}`);
    this.set(id, response.data);
    return response.data;
  }
}
```

## 🛠️ Migration Steps Completed

### 1. **Installed LRU Cache**
```bash
npm install lru-cache
```

### 2. **Created Unified Cache System**
- `AdvancedLRUCache` - Base class with advanced features
- `APICache` - Specialized for API responses
- `RequestCoalescingCache` - For request deduplication
- `AuthCache` - For authentication caching

### 3. **Updated Existing Implementations**
- **API Utils**: Replaced Map-based cache with LRU cache
- **Query Hook**: Added automatic request coalescing
- **Auth Hook**: Enhanced with LRU cache

### 4. **Enhanced Features**
- Request coalescing prevents duplicate API calls
- Size-based eviction for memory management
- Built-in TTL support
- Performance monitoring with statistics

## 📈 Performance Improvements

### Before (Map-based Cache)
```typescript
// Manual TTL checking
const cached = cache.get(key);
if (cached && cached.timestamp + ttl > Date.now()) {
  return cached.value;
}

// No request deduplication
const response1 = fetch('/api/data');
const response2 = fetch('/api/data'); // Duplicate request!
```

### After (LRU Cache)
```typescript
// Automatic TTL and eviction
const cached = cache.get(key);
if (cached) return cached; // TTL handled automatically

// Automatic request coalescing
const [data1, data2] = await Promise.all([
  cache.fetch('/api/data'),
  cache.fetch('/api/data'), // Same request coalesced!
]);
```

## 🎯 Key Benefits in Your Application

### 1. **Improved Performance**
- Faster data access with intelligent caching
- Reduced API calls through request coalescing
- Better memory utilization with LRU eviction

### 2. **Enhanced Reliability**
- No more memory leaks from deprecated `inflight`
- Automatic cache cleanup
- Better error handling

### 3. **Developer Experience**
- TypeScript support with full type safety
- Comprehensive examples and documentation
- Built-in monitoring and statistics

### 4. **Scalability**
- Configurable cache sizes and TTL
- Size-based eviction for large objects
- Multiple specialized cache types

## 🔍 Monitoring and Debugging

### Cache Statistics
```typescript
import { apiCache, requestCache } from '@/utils/lruCache';

// Monitor cache performance
console.log('API Cache Stats:', apiCache.stats);
console.log('Request Cache Stats:', requestCache.stats);
console.log('Pending Requests:', requestCache.pendingCount);
```

### Debug Logging
```typescript
// Enable debug logging in getQuery hook
const { data, loading } = useGetQuery({
  url: '/api/courses',
  debug: true, // Shows cache hits/misses and coalescing info
});
```

## 🚦 Best Practices

### 1. **Choose the Right Cache Type**
- **APICache**: For standard HTTP API responses
- **RequestCoalescingCache**: For preventing duplicate requests
- **AuthCache**: For authentication state
- **AdvancedLRUCache**: For custom use cases

### 2. **Configure Appropriate Sizes**
```typescript
// For frequently accessed small data
const quickCache = new AdvancedLRUCache({
  max: 1000,
  ttl: 30 * 1000 // 30 seconds
});

// For large objects with size limits
const objectCache = new AdvancedLRUCache({
  max: 50,
  maxSize: 10 * 1024 * 1024, // 10MB
  sizeCalculation: (value) => JSON.stringify(value).length
});
```

### 3. **Use Request Coalescing for Expensive Operations**
```typescript
// Good for database queries, API calls, computations
const expensiveDataCache = createCoalescingCache(
  async (key: string) => {
    // Expensive operation that should be deduplicated
    return await performExpensiveOperation(key);
  }
);
```

### 4. **Monitor Cache Performance**
```typescript
// Regular monitoring
setInterval(() => {
  const stats = apiCache.stats;
  if (stats.calculatedSize && stats.maxSize) {
    const utilization = (stats.calculatedSize / stats.maxSize) * 100;
    if (utilization > 90) {
      console.warn('Cache approaching capacity:', utilization + '%');
    }
  }
}, 60000); // Check every minute
```

## 🔧 Configuration Options

### Cache Configuration
```typescript
interface CacheOptions {
  max?: number;           // Maximum items to store
  ttl?: number;          // Time to live in milliseconds
  maxSize?: number;      // Maximum size in bytes
  sizeCalculation?: (value: any, key: string) => number;
  enableCoalescing?: boolean; // Enable request coalescing
}
```

### Example Configurations
```typescript
// High-performance cache for frequently accessed data
const highPerformanceCache = new AdvancedLRUCache({
  max: 1000,
  ttl: 60 * 1000, // 1 minute
  updateAgeOnGet: true, // Update age on access
});

// Memory-conscious cache for large objects
const memoryOptimizedCache = new AdvancedLRUCache({
  max: 100,
  maxSize: 50 * 1024 * 1024, // 50MB
  sizeCalculation: (value) => JSON.stringify(value).length,
  ttl: 30 * 60 * 1000, // 30 minutes
});
```

## 🎉 Results

The migration to LRU cache has successfully:

1. ✅ **Eliminated** deprecated `inflight` dependency
2. ✅ **Prevented** memory leaks and resource issues
3. ✅ **Improved** performance with intelligent caching
4. ✅ **Added** request coalescing to prevent duplicate API calls
5. ✅ **Enhanced** developer experience with TypeScript support
6. ✅ **Provided** comprehensive monitoring and debugging tools

Your MEDH web platform now has a modern, performant, and maintainable caching system that scales with your application's needs while providing superior user experience through faster data access and reduced server load.

## 📖 Further Reading

- [LRU Cache Documentation](https://www.npmjs.com/package/lru-cache)
- [Cache Examples](../src/examples/lruCacheExamples.ts)
- [Request Coalescing Patterns](https://patterns.dev/posts/caching-pattern)
- [Performance Optimization Techniques](https://web.dev/performance-caching/)

---

**Need Help?** Check the examples in `src/examples/lruCacheExamples.ts` or review the implementation in `src/utils/lruCache.ts` for detailed usage patterns. 