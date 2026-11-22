"use client";

import { useSyncExternalStore, useCallback, useRef, type Dispatch, type SetStateAction } from "react";

// Event name for reactive storage synchronization across the same tab/window
export const STORAGE_CHANGE_EVENT = "trackmetro-storage";

export function dispatchStorageEvent(key?: string) {
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT, { detail: { key } }));
    } catch {
      // ignore
    }
  }
}

interface CacheEntry<T> {
  raw: string | null;
  value: T;
}

// Global cache mapping localStorage keys to their raw string and parsed object reference.
// This prevents infinite render loops by guaranteeing referential stability in getSnapshot.
const snapshotCache = new Map<string, CacheEntry<unknown>>();

function parseStorageValue<T>(raw: string | null, defaultValue: T): T {
  if (raw === null) return defaultValue;

  if (typeof defaultValue === "string") {
    if (raw.length >= 2 && raw.startsWith('"') && raw.endsWith('"')) {
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "string") return parsed as unknown as T;
      } catch {
        // ignore
      }
    }
    return raw as unknown as T;
  }

  if (typeof defaultValue === "number") {
    const num = Number(raw);
    return (Number.isNaN(num) ? defaultValue : num) as unknown as T;
  }

  if (typeof defaultValue === "boolean") {
    if (raw === "true") return true as unknown as T;
    if (raw === "false") return false as unknown as T;
    return defaultValue;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function serializeStorageValue<T>(value: T): string {
  if (typeof value === "string") {
    return value;
  }
  return JSON.stringify(value);
}

function getClientSnapshot<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    return defaultValue;
  }

  const cached = snapshotCache.get(key) as CacheEntry<T> | undefined;
  if (cached && cached.raw === raw) {
    return cached.value;
  }

  const parsed = parseStorageValue<T>(raw, defaultValue);
  snapshotCache.set(key, { raw, value: parsed });
  return parsed;
}

/**
 * React 19 / Next.js 16-safe persistent state hook built on useSyncExternalStore.
 *
 * Guarantees zero SSR hydration mismatches:
 * - getServerSnapshot: Returns deterministic defaultValue on server and during initial hydration.
 * - getSnapshot: Reads localStorage and caches referentially stable parsed values.
 * - subscribe: Listens to both native 'storage' events (cross-tab sync) and 'trackmetro-storage' custom events.
 */
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const initialDefaultRef = useRef(defaultValue);

  const getServerSnapshot = useCallback(() => {
    return initialDefaultRef.current;
  }, []);

  const getSnapshot = useCallback(() => {
    return getClientSnapshot<T>(key, initialDefaultRef.current);
  }, [key]);

  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const handleStorage = (e: StorageEvent) => {
        if (!e.key || e.key === key) {
          callback();
        }
      };

      const handleCustom = (e: Event) => {
        const ce = e as CustomEvent<{ key?: string }>;
        if (!ce.detail?.key || ce.detail.key === key) {
          callback();
        }
      };

      window.addEventListener("storage", handleStorage);
      window.addEventListener(STORAGE_CHANGE_EVENT, handleCustom);

      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(STORAGE_CHANGE_EVENT, handleCustom);
      };
    },
    [key]
  );

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      try {
        const current = getClientSnapshot<T>(key, initialDefaultRef.current);
        const next = typeof updater === "function" ? (updater as (prev: T) => T)(current) : updater;
        const serialized = serializeStorageValue(next);

        // Update in-memory snapshot cache before dispatching event
        snapshotCache.set(key, { raw: serialized, value: next });

        window.localStorage.setItem(key, serialized);

        // Dispatch custom event for immediate same-tab reactive synchronization
        dispatchStorageEvent(key);
      } catch (err) {
        console.warn(`[useLocalStorageState] Error writing key "${key}":`, err);
      }
    },
    [key]
  );

  return [value, setValue];
}

const emptySubscribe = () => () => {};

/**
 * Returns false during SSR pre-render and initial client hydration,
 * then returns true immediately after hydration completes.
 *
 * Use this to gate dynamic, non-deterministic client-only values (like local clock time).
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

let currentTimestampSnapshot = typeof window !== "undefined" ? Date.now() : 0;
const timestampListeners = new Set<() => void>();
let timestampTimer: ReturnType<typeof setInterval> | null = null;

function ensureTimestampTimer() {
  if (typeof window === "undefined") return;
  if (!timestampTimer) {
    timestampTimer = setInterval(() => {
      currentTimestampSnapshot = Date.now();
      timestampListeners.forEach((l) => l());
    }, 30000);
  }
}

const timerSubscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  timestampListeners.add(callback);
  ensureTimestampTimer();
  return () => {
    timestampListeners.delete(callback);
    if (timestampListeners.size === 0 && timestampTimer) {
      clearInterval(timestampTimer);
      timestampTimer = null;
    }
  };
};

/**
 * Returns 0 during SSR pre-render and initial client hydration,
 * then returns a stable epoch timestamp on the client,
 * updated on a 30-second interval.
 */
export function useCurrentTimestamp(): number {
  return useSyncExternalStore(
    timerSubscribe,
    () => currentTimestampSnapshot,
    () => 0
  );
}
