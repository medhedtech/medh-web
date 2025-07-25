import axios from 'axios';
import { 
  createCoalescingCache, 
  apiCache, 
  requestCache, 
  authCache,
  objectCache,
  quickCache,
  AdvancedLRUCache 
} from '../utils/lruCache';

/**
 * Example 1: Basic API Caching
 * Using the built-in apiCache for standard API responses
 */
export async function exampleApiCaching() {
  const url = '/api/courses';
  const params = { category: 'data-science', limit: 10 };
  
  // Check if we have cached data
  const cachedData = apiCache.getResponse(url, params);
  if (cachedData) {
    console.log('✅ Cache hit - returning cached data');
    return cachedData;
  }
  
  // Make API call and cache the result
  try {
    const response = await axios.get(url, { params });
    
    // Cache for 10 minutes
    apiCache.setResponse(url, params, response.data, 10 * 60 * 1000);
    
    console.log('📦 Data cached for future requests');
    return response.data;
  } catch (error) {
    console.error('❌ API request failed:', error);
    throw error;
  }
}

/**
 * Example 2: Request Coalescing with fetchMethod
 * Multiple simultaneous requests for the same data will be automatically deduplicated
 */
export const courseCatalogCache = createCoalescingCache<any>(
  async (courseId: string, signal?: AbortSignal) => {
    console.log(`🔄 Fetching course data for: ${courseId}`);
    
    const response = await axios.get(`/api/courses/${courseId}`, {
      signal, // Support for request cancellation
    });
    
    return response.data;
  },
  {
    max: 100,
    ttl: 15 * 60 * 1000, // 15 minutes
  }
);

// Usage: Multiple calls will be coalesced into a single request
export async function exampleRequestCoalescing() {
  const courseId = 'data-science-101';
  
  // These three calls will result in only ONE actual API request
  const [course1, course2, course3] = await Promise.all([
    courseCatalogCache.fetch(courseId),
    courseCatalogCache.fetch(courseId),
    courseCatalogCache.fetch(courseId),
  ]);
  
  console.log('🎯 All three calls returned the same data from a single request');
  return course1;
}

/**
 * Example 3: Advanced Request Deduplication
 * Using RequestCoalescingCache for complex scenarios
 */
export async function exampleAdvancedDeduplication() {
  const userId = 'user123';
  const enrollmentKey = `enrollment-${userId}`;
  
  try {
    // This will automatically deduplicate concurrent requests
    const enrollment = await requestCache.executeRequest(
      enrollmentKey,
      async () => {
        console.log(`🔄 Fetching enrollment data for user: ${userId}`);
        
        const response = await axios.get(`/api/users/${userId}/enrollment`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        return response.data;
      },
      { ttl: 5 * 60 * 1000 } // Cache for 5 minutes
    );
    
    return enrollment;
  } catch (error) {
    console.error('❌ Failed to fetch enrollment:', error);
    throw error;
  }
}

/**
 * Example 4: Authentication Caching
 * Cache authentication results to avoid repeated auth checks
 */
export async function exampleAuthCaching(userId: string, requiredRoles: string[]) {
  // Check cached auth result
  const cachedAuth = authCache.isAuthorized(userId, requiredRoles);
  if (cachedAuth !== undefined) {
    console.log(`✅ Auth cache hit: ${cachedAuth ? 'authorized' : 'not authorized'}`);
    return cachedAuth;
  }
  
  // Perform auth check
  try {
    const response = await axios.post('/api/auth/check', {
      userId,
      requiredRoles,
    });
    
    const isAuthorized = response.data.authorized;
    
    // Cache the result
    authCache.setAuthorized(isAuthorized, userId, requiredRoles);
    
    console.log(`🔐 Auth result cached: ${isAuthorized ? 'authorized' : 'not authorized'}`);
    return isAuthorized;
  } catch (error) {
    console.error('❌ Auth check failed:', error);
    return false;
  }
}

/**
 * Example 5: Large Object Caching with Size Limits
 * Cache large objects like course curricula with size-based eviction
 */
export async function exampleLargeObjectCaching(courseId: string) {
  const cacheKey = `curriculum-${courseId}`;
  
  // Check cache first
  const cachedCurriculum = objectCache.get(cacheKey);
  if (cachedCurriculum) {
    console.log('✅ Large object cache hit');
    return cachedCurriculum;
  }
  
  // Fetch large curriculum data
  try {
    const response = await axios.get(`/api/courses/${courseId}/curriculum`);
    const curriculum = response.data;
    
    // Cache with automatic size calculation
    objectCache.set(cacheKey, curriculum);
    
    console.log(`📦 Large object cached (size: ${JSON.stringify(curriculum).length} bytes)`);
    console.log(`Cache stats:`, objectCache.stats);
    
    return curriculum;
  } catch (error) {
    console.error('❌ Failed to fetch curriculum:', error);
    throw error;
  }
}

/**
 * Example 6: Quick Cache for Frequently Accessed Data
 * Short-term cache for data that changes frequently
 */
export async function exampleQuickCache() {
  const statsKey = 'user-stats';
  
  // Check quick cache
  const cachedStats = quickCache.get(statsKey);
  if (cachedStats) {
    console.log('⚡ Quick cache hit');
    return cachedStats;
  }
  
  // Fetch fresh stats
  try {
    const response = await axios.get('/api/dashboard/stats');
    const stats = response.data;
    
    // Cache for just 30 seconds
    quickCache.set(statsKey, stats);
    
    console.log('📊 Stats cached for 30 seconds');
    return stats;
  } catch (error) {
    console.error('❌ Failed to fetch stats:', error);
    throw error;
  }
}

/**
 * Example 7: Custom Cache Implementation
 * Create a specialized cache for specific use cases
 */
export class BlogPostCache extends AdvancedLRUCache<string, any> {
  constructor() {
    super({
      max: 200,
      ttl: 30 * 60 * 1000, // 30 minutes
      sizeCalculation: (post) => {
        // Calculate size based on content length
        return (post.title?.length || 0) + (post.content?.length || 0) + (post.excerpt?.length || 0);
      },
      maxSize: 1024 * 1024, // 1MB total
    });
  }
  
  async getBlogPost(slug: string): Promise<any> {
    // Check cache first
    const cached = this.get(slug);
    if (cached) {
      console.log(`✅ Blog post cache hit: ${slug}`);
      return cached;
    }
    
    // Fetch from API
    try {
      const response = await axios.get(`/api/blogs/${slug}`);
      const post = response.data;
      
      // Cache the post
      this.set(slug, post);
      
      console.log(`📝 Blog post cached: ${slug}`);
      return post;
    } catch (error) {
      console.error(`❌ Failed to fetch blog post: ${slug}`, error);
      throw error;
    }
  }
  
  prefetchRelatedPosts(tags: string[]) {
    // Prefetch related posts based on tags
    tags.forEach(async (tag) => {
      const cacheKey = `tag-${tag}`;
      if (!this.has(cacheKey)) {
        try {
          const response = await axios.get(`/api/blogs/by-tag/${tag}`);
          this.set(cacheKey, response.data);
          console.log(`🔄 Prefetched posts for tag: ${tag}`);
        } catch (error) {
          console.warn(`⚠️ Failed to prefetch tag: ${tag}`, error);
        }
      }
    });
  }
}

// Create instance of custom cache
export const blogPostCache = new BlogPostCache();

/**
 * Example 8: Cache Statistics and Monitoring
 * Monitor cache performance and hit rates
 */
export function exampleCacheMonitoring() {
  // Get statistics from different caches
  const apiStats = apiCache.stats;
  const objectStats = objectCache.stats;
  const quickStats = quickCache.stats;
  
  console.log('📊 Cache Statistics:');
  console.log('API Cache:', {
    size: apiStats.size,
    hitRate: apiStats.size > 0 ? 'N/A' : '0%', // LRU cache doesn't track hits directly
    maxSize: apiStats.max,
  });
  
  console.log('Object Cache:', {
    size: objectStats.size,
    calculatedSize: objectStats.calculatedSize,
    maxSize: objectStats.maxSize,
    utilization: objectStats.maxSize ? 
      `${((objectStats.calculatedSize || 0) / objectStats.maxSize * 100).toFixed(1)}%` : 'N/A'
  });
  
  console.log('Request Cache:', {
    size: requestCache.size,
    pendingRequests: requestCache.pendingCount,
  });
  
  // Example of cache cleanup
  if (objectStats.calculatedSize && objectStats.maxSize && 
      (objectStats.calculatedSize / objectStats.maxSize) > 0.9) {
    console.log('⚠️ Object cache is 90% full - consider increasing size or reducing TTL');
  }
}

/**
 * Example 9: Cache Invalidation Strategies
 * Handle cache invalidation for data consistency
 */
export class SmartCache extends AdvancedLRUCache<string, any> {
  private dependencyMap = new Map<string, Set<string>>();
  
  constructor() {
    super({ max: 300, ttl: 10 * 60 * 1000 });
  }
  
  // Set with dependencies
  setWithDependencies(key: string, value: any, dependencies: string[] = []) {
    this.set(key, value);
    
    // Track dependencies
    dependencies.forEach(dep => {
      if (!this.dependencyMap.has(dep)) {
        this.dependencyMap.set(dep, new Set());
      }
      this.dependencyMap.get(dep)!.add(key);
    });
  }
  
  // Invalidate by dependency
  invalidateByDependency(dependency: string) {
    const dependentKeys = this.dependencyMap.get(dependency);
    if (dependentKeys) {
      dependentKeys.forEach(key => {
        this.delete(key);
        console.log(`🗑️ Invalidated cache key: ${key} (dependency: ${dependency})`);
      });
      this.dependencyMap.delete(dependency);
    }
  }
  
  // Bulk invalidation
  invalidateByPattern(pattern: RegExp) {
    const keysToDelete: string[] = [];
    
    for (const key of this.keys()) {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => {
      this.delete(key);
      console.log(`🗑️ Pattern invalidated cache key: ${key}`);
    });
    
    return keysToDelete.length;
  }
}

// Usage examples
export async function exampleUsage() {
  console.log('🚀 Starting LRU Cache Examples...\n');
  
  // Example 1: Basic API caching
  console.log('1️⃣ Basic API Caching:');
  await exampleApiCaching();
  
  // Example 2: Request coalescing
  console.log('\n2️⃣ Request Coalescing:');
  await exampleRequestCoalescing();
  
  // Example 3: Advanced deduplication
  console.log('\n3️⃣ Advanced Deduplication:');
  await exampleAdvancedDeduplication();
  
  // Example 4: Auth caching
  console.log('\n4️⃣ Authentication Caching:');
  await exampleAuthCaching('user123', ['admin', 'instructor']);
  
  // Example 5: Large object caching
  console.log('\n5️⃣ Large Object Caching:');
  await exampleLargeObjectCaching('advanced-react');
  
  // Example 6: Quick cache
  console.log('\n6️⃣ Quick Cache:');
  await exampleQuickCache();
  
  // Example 7: Custom blog cache
  console.log('\n7️⃣ Custom Blog Cache:');
  const post = await blogPostCache.getBlogPost('getting-started-with-ai');
  blogPostCache.prefetchRelatedPosts(['ai', 'machine-learning']);
  
  // Example 8: Cache monitoring
  console.log('\n8️⃣ Cache Monitoring:');
  exampleCacheMonitoring();
  
  console.log('\n✅ All examples completed!');
}

// Export commonly used patterns
export const cachePatterns = {
  // Wrapper for API calls with automatic caching
  cachedApiCall: async <T>(url: string, params?: any, ttl?: number): Promise<T> => {
    const cachedData = apiCache.getResponse(url, params);
    if (cachedData) return cachedData;
    
    const response = await axios.get(url, { params });
    apiCache.setResponse(url, params, response.data, ttl);
    return response.data;
  },
  
  // Wrapper for request deduplication
  coalescedRequest: async <T>(key: string, requestFn: () => Promise<T>, ttl?: number): Promise<T> => {
    return requestCache.executeRequest(key, requestFn, { ttl });
  },
  
  // Cache with automatic invalidation after mutation
  cacheThenInvalidate: async <T>(cacheKey: string, mutateFn: () => Promise<T>): Promise<T> => {
    const result = await mutateFn();
    // Invalidate related cache entries
    apiCache.delete(cacheKey);
    requestCache.delete(cacheKey);
    return result;
  }
}; 