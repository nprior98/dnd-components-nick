import { useState, useEffect } from "react";

type RetrieveMethod = (params: {
  path: { key: string };
}) => Promise<{ data: unknown }>;

const detailCache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

function cacheKey(method: RetrieveMethod, id: string) {
  return `${method.name}:${id}`;
}

export function useHandbookData<T>(
  id: string | undefined,
  retrieveMethod: RetrieveMethod,
  typeGuard: (data: unknown) => data is T
): { data: T | null; loading: boolean } {
  const key = id ? cacheKey(retrieveMethod, id) : null;

  const [data, setData] = useState<T | null>(() => {
    if (!key) return null;
    const cached = detailCache.get(key);
    return cached && typeGuard(cached) ? cached : null;
  });
  const [loading, setLoading] = useState<boolean>(() => {
    if (!key) return false;
    return !detailCache.has(key);
  });

  useEffect(() => {
    if (!id || !key) {
      setLoading(false);
      return;
    }

    const cached = detailCache.get(key);
    if (cached && typeGuard(cached)) {
      setData(cached);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    let promise = inflight.get(key);
    if (!promise) {
      promise = retrieveMethod({ path: { key: id } }).then((res) => {
        if (res && typeGuard(res.data)) {
          detailCache.set(key, res.data);
        }
        inflight.delete(key);
        return res?.data;
      });
      inflight.set(key, promise);
    }

    promise
      .then((value) => {
        if (cancelled) return;
        if (typeGuard(value)) setData(value);
      })
      .catch((err) => {
        if (!cancelled) console.error("Failed to load data:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, key, retrieveMethod, typeGuard]);

  return { data, loading };
}
