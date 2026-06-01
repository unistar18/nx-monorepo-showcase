import { useCallback, useEffect, useState } from 'react';
import type { Product } from '@org/models';
import { productsApi } from './products-api';

interface UseProductsResult {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/**
 * React hook wrapping the products API client with local state.
 *
 * Keeps all data-fetching concerns out of the feature/ui components: the hook
 * lives in data-access, the feature page just consumes it. Mirrors the role of
 * the Angular shop's signal-based ProductsService, but idiomatic React.
 */
export function useProducts(pageSize = 12): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await productsApi.list(1, pageSize);
      setProducts(page.items);
      setTotal(page.total);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { products, total, loading, error, reload };
}
