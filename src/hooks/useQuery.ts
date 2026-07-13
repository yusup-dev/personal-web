import { useState, useEffect, useCallback, useRef } from "react";

// In-memory cache store as fallback/secondary cache
const queryCache: Record<string, any> = {};

// Track which active queries are operating on fallback mock data
const activeFallbacks = new Set<string>();
const fallbackListeners = new Set<(status: boolean) => void>();

const updateFallbackStatus = () => {
  const isAnyFallback = activeFallbacks.size > 0;
  fallbackListeners.forEach((listener) => listener(isAnyFallback));
};

/**
 * Subscribes a listener function to global fallback status changes.
 * Used by UI components to display a banner if any API is failing and using mock data.
 */
export const subscribeToFallbackStatus = (listener: (status: boolean) => void) => {
  fallbackListeners.add(listener);
  // Trigger initial callback
  listener(activeFallbacks.size > 0);
  return () => {
    fallbackListeners.delete(listener);
  };
};

export interface QueryResult<T> {
  data: T;
  loading: boolean;
  error: Error | null;
  isFallback: boolean;
  refetch: () => Promise<void>;
}

// Helpers for localStorage Cache (Stale-While-Revalidate)
const getPersistentCache = (key: string): any => {
  try {
    const cached = localStorage.getItem(`swr_${key}`);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn("[Cache] Failed to parse localStorage for key:", key, e);
  }
  return queryCache[key];
};

const setPersistentCache = (key: string, value: any): void => {
  try {
    queryCache[key] = value;
    localStorage.setItem(`swr_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn("[Cache] Failed to set localStorage for key:", key, e);
  }
};

/**
 * useQuery Hook
 * Handles loading, error, caching, and resilient mock-data fallback for API calls.
 */
export function useQuery<T>(
  queryFn: () => Promise<T>,
  fallbackValue: T,
  cacheKey?: string
): QueryResult<T> {
  // Determine if we already have this query in our local persistent cache
  const cachedVal = cacheKey ? getPersistentCache(cacheKey) : undefined;
  const hasCache = cachedVal !== undefined;

  const [data, setData] = useState<T>(() => {
    if (hasCache) {
      return cachedVal;
    }
    return fallbackValue;
  });

  const [loading, setLoading] = useState<boolean>(!hasCache);
  const [error, setError] = useState<Error | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  // Keep reference of queryFn to avoid unnecessary re-triggers
  const queryFnRef = useRef(queryFn);
  queryFnRef.current = queryFn;

  const execute = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const result = await queryFnRef.current();
      setData(result);
      setError(null);
      setIsFallback(false);

      if (cacheKey) {
        setPersistentCache(cacheKey, result);
        if (activeFallbacks.has(cacheKey)) {
          activeFallbacks.delete(cacheKey);
          updateFallbackStatus();
        }
      }
    } catch (err: any) {
      console.warn(`[useQuery] Failed fetching API for key "${cacheKey || 'unknown'}":`, err);
      setError(err instanceof Error ? err : new Error(String(err)));

      // If we have cached data, use that first
      const currentCache = cacheKey ? getPersistentCache(cacheKey) : undefined;
      if (currentCache !== undefined) {
        setData(currentCache);
        setIsFallback(false);
      } else {
        setData(fallbackValue);
        setIsFallback(true);
        if (cacheKey) {
          activeFallbacks.add(cacheKey);
          updateFallbackStatus();
        }
      }
    } finally {
      setLoading(false);
    }
  }, [cacheKey, fallbackValue]);

  useEffect(() => {
    execute(!hasCache);

    return () => {
      // Clean up fallback tracking on unmount
      if (cacheKey && activeFallbacks.has(cacheKey)) {
        activeFallbacks.delete(cacheKey);
        updateFallbackStatus();
      }
    };
  }, [execute, hasCache, cacheKey]);

  return {
    data,
    loading,
    error,
    isFallback,
    refetch: () => execute(true),
  };
}

