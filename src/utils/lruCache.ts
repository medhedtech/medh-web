import { LRUCache } from 'lru-cache';

/**
 * Configuration options for LRU caches
 */
export interface CacheOptions {
  /** Maximum number of items to store */
  max?: number;
  /** Time to live in milliseconds */
  ttl?: number;
  /** Maximum size in bytes */
  maxSize?: number;
  /** Function to calculate item size */
  sizeCalculation?: (value: any, key: string) => number;
  /** Enable automatic request coalescing for async operations */
  enableCoalescing?: boolean;
}

/**
 * Advanced LRU Cache with request coalescing and enhanced features
 */
export class AdvancedLRUCache<K = string, V = any> {
  private cache: LRUCache<K, V>;
  private coalescingEnabled: boolean;

  constructor(options: CacheOptions = {}) {
    const {
      max = 500,
      ttl = 5 * 60 * 1000, // 5 minutes default
      maxSize,
      sizeCalculation,
      enableCoalescing = false
    } = options;

    this.coalescingEnabled = enableCoalescing;

    const cacheConfig: any = {
      max,
      ttl,
      // Enable size-based eviction if configured
      ...(maxSize && { maxSize }),
      ...(sizeCalculation && { sizeCalculation }),
      
      // Performance optimizations
      updateAgeOnGet: true,
      updateAgeOnHas: false,
      
      // Optional request coalescing
      ...(enableCoalescing && {
        fetchMethod: async (key: K, staleValue: V | undefined, { signal }: { signal?: AbortSignal }) => {
          // This will be overridden by specific implementations
          throw new Error('fetchMethod must be implemented when coalescing is enabled');
        }
      })
    };

    this.cache = new LRUCache<K, V>(cacheConfig);
  }

  /**
   * Get an item from cache
   */
  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  /**
   * Set an item in cache
   */
  set(key: K, value: V, options?: { ttl?: number }): this {
    this.cache.set(key, value, options);
    return this;
  }

  /**
   * Check if key exists in cache
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Delete an item from cache
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
   * Get cache size
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   */
  get stats() {
    return {
      size: this.cache.size,
      calculatedSize: this.cache.calculatedSize,
      max: this.cache.max,
      maxSize: this.cache.maxSize,
      ttl: this.cache.ttl
    };
  }

  /**
   * Fetch with automatic request coalescing (when enabled)
   * Multiple concurrent calls for the same key will be coalesced into a single request
   */
  async fetch(key: K, options?: { signal?: AbortSignal }): Promise<V | undefined> {
    if (!this.coalescingEnabled) {
      throw new Error('Request coalescing is not enabled for this cache');
    }
    return this.cache.fetch(key, options);
  }

  /**
   * Get all keys in cache
   */
  keys(): IterableIterator<K> {
    return this.cache.keys();
  }

  /**
   * Get all values in cache
   */
  values(): IterableIterator<V> {
    return this.cache.values();
  }

  /**
   * Get all entries in cache
   */
  entries(): IterableIterator<[K, V]> {
    return this.cache.entries();
  }
}

/**
 * API Cache - Replacement for existing API cache with LRU
 */
export class APICache extends AdvancedLRUCache<string, any> {
  constructor(options: CacheOptions = {}) {
    super({
      max: 100,
      ttl: 5 * 60 * 1000, // 5 minutes
      enableCoalescing: true,
      ...options
    });
  }

  /**
   * Create cache key from URL and params
   */
  createKey(url: string, params?: any): string {
    return `${url}|${JSON.stringify(params || {})}`;
  }

  /**
   * Get cached API response
   */
  getResponse(url: string, params?: any): any {
    const key = this.createKey(url, params);
    return this.get(key);
  }

  /**
   * Cache API response
   */
  setResponse(url: string, params: any, response: any, ttl?: number): this {
    const key = this.createKey(url, params);
    return this.set(key, response, { ttl });
  }
}

/**
 * Request Coalescing Cache - For preventing duplicate concurrent requests
 */
export class RequestCoalescingCache<T = any> extends AdvancedLRUCache<string, T> {
  private pendingRequests = new Map<string, Promise<T>>();

  constructor(options: CacheOptions = {}) {
    super({
      max: 200,
      ttl: 60 * 1000, // 1 minute
      ...options
    });
  }

  /**
   * Execute request with automatic deduplication
   * Multiple concurrent calls for the same key will return the same promise
   */
  async executeRequest(
    key: string,
    requestFn: () => Promise<T>,
    options?: { ttl?: number; signal?: AbortSignal }
  ): Promise<T> {
    // Check cache first
    const cached = this.get(key);
    if (cached !== undefined) {
      return cached;
    }

    // Check if request is already pending
    const pendingRequest = this.pendingRequests.get(key);
    if (pendingRequest) {
      return pendingRequest;
    }

    // Execute new request
    const request = requestFn().finally(() => {
      // Clean up pending request
      this.pendingRequests.delete(key);
    });

    // Store pending request
    this.pendingRequests.set(key, request);

    try {
      const result = await request;
      // Cache successful result
      this.set(key, result, { ttl: options?.ttl });
      return result;
    } catch (error) {
      // Don't cache errors, just propagate
      throw error;
    }
  }

  /**
   * Clear pending requests (useful for cleanup)
   */
  clearPendingRequests(): void {
    this.pendingRequests.clear();
  }

  /**
   * Get number of pending requests
   */
  get pendingCount(): number {
    return this.pendingRequests.size;
  }
}

/**
 * Auth Cache - Specialized cache for authentication results
 */
export class AuthCache extends AdvancedLRUCache<string, boolean> {
  constructor() {
    super({
      max: 50,
      ttl: 10 * 1000, // 10 seconds
    });
  }

  /**
   * Create auth cache key
   */
  createAuthKey(userId?: string, roles?: string[], permissions?: string[]): string {
    return JSON.stringify({ userId, roles, permissions });
  }

  /**
   * Check cached auth result
   */
  isAuthorized(userId?: string, roles?: string[], permissions?: string[]): boolean | undefined {
    const key = this.createAuthKey(userId, roles, permissions);
    return this.get(key);
  }

  /**
   * Cache auth result
   */
  setAuthorized(authorized: boolean, userId?: string, roles?: string[], permissions?: string[]): this {
    const key = this.createAuthKey(userId, roles, permissions);
    return this.set(key, authorized);
  }
}

/**
 * Create preconfigured cache instances
 */
export const createCacheInstances = () => ({
  /** General purpose API cache */
  apiCache: new APICache(),
  
  /** Request deduplication cache */
  requestCache: new RequestCoalescingCache(),
  
  /** Authentication results cache */
  authCache: new AuthCache(),
  
  /** Large object cache with size limits */
  objectCache: new AdvancedLRUCache({
    max: 50,
    maxSize: 10 * 1024 * 1024, // 10MB
    sizeCalculation: (value) => JSON.stringify(value).length,
    ttl: 10 * 60 * 1000 // 10 minutes
  }),
  
  /** Short-term cache for frequently accessed data */
  quickCache: new AdvancedLRUCache({
    max: 1000,
    ttl: 30 * 1000 // 30 seconds
  })
});

// Default cache instances
export const {
  apiCache,
  requestCache, 
  authCache,
  objectCache,
  quickCache
} = createCacheInstances();

/**
 * Utility function to create a cache with request coalescing
 */
export function createCoalescingCache<T>(
  fetcher: (key: string, signal?: AbortSignal) => Promise<T>,
  options: CacheOptions = {}
): AdvancedLRUCache<string, T> {
  const cache = new LRUCache<string, T>({
    max: 100,
    ttl: 5 * 60 * 1000,
    ...options,
    fetchMethod: async (key: string, staleValue: T | undefined, { signal }) => {
      return fetcher(key, signal);
    }
  });

  return {
    async fetch(key: string, options?: { signal?: AbortSignal }): Promise<T | undefined> {
      return cache.fetch(key, options);
    },
    get(key: string): T | undefined {
      return cache.get(key);
    },
    set(key: string, value: T, options?: { ttl?: number }): any {
      cache.set(key, value, options);
      return this;
    },
    has(key: string): boolean {
      return cache.has(key);
    },
    delete(key: string): boolean {
      return cache.delete(key);
    },
    clear(): void {
      cache.clear();
    },
    get size(): number {
      return cache.size;
    },
    keys(): IterableIterator<string> {
      return cache.keys();
    },
    values(): IterableIterator<T> {
      return cache.values();
    },
    entries(): IterableIterator<[string, T]> {
      return cache.entries();
    }
  } as AdvancedLRUCache<string, T>;
} 