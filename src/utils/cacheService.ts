import { LRUCache } from 'lru-cache';

/**
 * Configuration options for the cache service
 */
export interface CacheServiceOptions {
  maxSize?: number;
  ttl?: number; // Time to live in milliseconds
  allowStale?: boolean;
  updateAgeOnGet?: boolean;
  updateAgeOnHas?: boolean;
}

/**
 * Cache entry with metadata
 */
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  expiry: number;
}

/**
 * Unified LRU Cache Service
 * Provides a centralized caching solution using the official lru-cache package
 * Replaces all Map-based cache implementations throughout the project
 */
export class CacheService<K = string, V = any> {
  private cache: LRUCache<K, CacheEntry<V>>;
  private defaultTTL: number;

  constructor(options: CacheServiceOptions = {}) {
    const {
      maxSize = 500,
      ttl = 5 * 60 * 1000, // 5 minutes default
      allowStale = false,
      updateAgeOnGet = true,
      updateAgeOnHas = false
    } = options;

    this.defaultTTL = ttl;
    this.cache = new LRUCache<K, CacheEntry<V>>({
      max: maxSize,
      allowStale,
      updateAgeOnGet,
      updateAgeOnHas,
      dispose: (value, key) => {
        // Optional cleanup when items are evicted
        console.debug(`Cache item evicted: ${String(key)}`);
      }
    });
  }

  /**
   * Get an item from cache
   * @param key - Cache key
   * @returns Cached value or undefined if not found/expired
   */
  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return undefined;
    }

    // Check if entry has expired
    if (entry.expiry < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * Set an item in cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in ms (optional, uses default if not provided)
   */
  set(key: K, value: V, ttl: number = this.defaultTTL): void {
    const now = Date.now();
    const entry: CacheEntry<V> = {
      value,
      timestamp: now,
      expiry: now + ttl
    };

    this.cache.set(key, entry);
  }

  /**
   * Check if an item exists in cache and is not expired
   * @param key - Cache key
   * @returns True if item exists and is not expired
   */
  has(key: K): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (entry.expiry < Date.now()) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete an item from cache
   * @param key - Cache key
   * @returns True if item was deleted
   */
  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get current cache size
   * @returns Number of items in cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   * @returns Object with cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.cache.max,
      calculatedSize: this.cache.calculatedSize,
      // Add custom stats
      defaultTTL: this.defaultTTL
    };
  }

  /**
   * Get all cache keys
   * @returns Array of cache keys
   */
  keys(): K[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get all cache values (non-expired only)
   * @returns Array of cache values
   */
  values(): V[] {
    const values: V[] = [];
    for (const key of this.cache.keys()) {
      const value = this.get(key);
      if (value !== undefined) {
        values.push(value);
      }
    }
    return values;
  }

  /**
   * Cleanup expired entries manually
   * @returns Number of entries cleaned up
   */
  cleanup(): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry < now) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  /**
   * Get or set pattern - useful for lazy loading
   * @param key - Cache key
   * @param factory - Function to generate value if not in cache
   * @param ttl - Time to live in ms (optional)
   * @returns Cached or newly generated value
   */
  async getOrSet<T extends V>(
    key: K, 
    factory: () => Promise<T> | T, 
    ttl?: number
  ): Promise<T> {
    const cached = this.get(key);
    if (cached !== undefined) {
      return cached as T;
    }

    const value = await factory();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Batch get multiple keys
   * @param keys - Array of cache keys
   * @returns Map of key-value pairs for existing, non-expired entries
   */
  mget(keys: K[]): Map<K, V> {
    const result = new Map<K, V>();
    
    for (const key of keys) {
      const value = this.get(key);
      if (value !== undefined) {
        result.set(key, value);
      }
    }

    return result;
  }

  /**
   * Batch set multiple key-value pairs
   * @param entries - Array of [key, value, ttl?] tuples
   */
  mset(entries: Array<[K, V, number?]>): void {
    for (const [key, value, ttl] of entries) {
      this.set(key, value, ttl);
    }
  }

  /**
   * Set TTL for existing cache entry
   * @param key - Cache key
   * @param ttl - New TTL in milliseconds
   * @returns True if key exists and TTL was updated
   */
  expire(key: K, ttl: number): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    entry.expiry = Date.now() + ttl;
    return true;
  }

  /**
   * Get TTL for a cache entry
   * @param key - Cache key
   * @returns Remaining TTL in milliseconds, or -1 if key doesn't exist
   */
  ttl(key: K): number {
    const entry = this.cache.get(key);
    if (!entry) {
      return -1;
    }

    const remaining = entry.expiry - Date.now();
    return remaining > 0 ? remaining : 0;
  }
}

/**
 * Pre-configured cache instances for different use cases
 */

// API Response Cache - for caching API responses
export const apiCache = new CacheService<string, any>({
  maxSize: 1000,
  ttl: 5 * 60 * 1000, // 5 minutes
  allowStale: false,
  updateAgeOnGet: true
});

// Component Cache - for caching component data
export const componentCache = new CacheService<string, any>({
  maxSize: 500,
  ttl: 10 * 60 * 1000, // 10 minutes
  allowStale: true,
  updateAgeOnGet: true
});

// Image Cache - for caching image metadata and optimization data
export const imageCache = new CacheService<string, any>({
  maxSize: 2000,
  ttl: 30 * 60 * 1000, // 30 minutes
  allowStale: true,
  updateAgeOnGet: false
});

// Session Cache - for caching user session data
export const sessionCache = new CacheService<string, any>({
  maxSize: 10000,
  ttl: 60 * 60 * 1000, // 1 hour
  allowStale: false,
  updateAgeOnGet: true
});

// Curriculum Cache - for caching curriculum and course data
export const curriculumCache = new CacheService<string, any>({
  maxSize: 200,
  ttl: 15 * 60 * 1000, // 15 minutes
  allowStale: true,
  updateAgeOnGet: true
});

// Performance Cache - for caching performance optimization data
export const performanceCache = new CacheService<string, any>({
  maxSize: 100,
  ttl: 60 * 60 * 1000, // 1 hour
  allowStale: true,
  updateAgeOnGet: false
});

// Default export for general purpose caching
export default CacheService; 