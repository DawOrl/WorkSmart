import { useCallback, useEffect, useRef, useState } from 'react';
import { apiErrorMessage } from '@/lib/api';

/**
 * Minimal data hook: every screen gets the same loading, error and retry
 * behaviour instead of ad-hoc spinners.
 */
export function useQuery<T>(fetcher: () => Promise<T>, deps: unknown[], errorText?: string) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const run = useRef(0);

  const load = useCallback(async () => {
    const id = ++run.current;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      if (id === run.current) setData(result);
    } catch (err) {
      if (id === run.current) setError(apiErrorMessage(err, errorText));
    } finally {
      if (id === run.current) setLoading(false);
    }
  }, [errorText]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, setData, error, loading, reload: load };
}
