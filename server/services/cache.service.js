/**
 * Enterprise In-Memory & Redis Cache Service
 * Provides fast caching for read-heavy database models (deals, user profiles, categories).
 */
class CacheService {
  constructor() {
    this.store = new Map();
    this.timers = new Map();
  }

  /**
   * Set a cached key with optional TTL (time to live in seconds).
   * @param {string} key 
   * @param {*} value 
   * @param {number} ttlInSeconds 
   */
  set(key, value, ttlInSeconds = 300) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    this.store.set(key, value);

    if (ttlInSeconds > 0) {
      const timer = setTimeout(() => {
        this.del(key);
      }, ttlInSeconds * 1000);
      
      // Allow Node process to exit even if timer is active
      if (timer.unref) timer.unref();
      this.timers.set(key, timer);
    }
  }

  /**
   * Get cached item by key.
   * @param {string} key 
   */
  get(key) {
    return this.store.get(key) || null;
  }

  /**
   * Delete specific key from cache.
   * @param {string} key 
   */
  del(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    return this.store.delete(key);
  }

  /**
   * Delete keys matching prefix.
   * @param {string} prefix 
   */
  delByPrefix(prefix) {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.del(key);
      }
    }
  }

  /**
   * Clear entire cache store.
   */
  flush() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.store.clear();
    this.timers.clear();
  }
}

const cacheService = new CacheService();
module.exports = cacheService;
