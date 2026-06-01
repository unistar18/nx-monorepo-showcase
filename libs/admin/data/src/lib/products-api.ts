import type { ApiResponse, PaginatedResponse, Product } from '@org/models';

/**
 * Framework-agnostic REST client for the products API.
 *
 * No React in here — this is pure data-access so it stays testable and could be
 * reused by any consumer. It speaks the exact same `ApiResponse<T>` envelope and
 * `Product` shape the Express API returns and the Angular shop consumes, all
 * imported from @org/models. A relative `/api` base means the same bundle works
 * behind the nginx reverse proxy in Docker (and the Vite dev proxy locally).
 */
const BASE_URL = '/api';

async function unwrap<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  const body = (await res.json()) as ApiResponse<T>;
  if (!body.success) {
    throw new Error(body.error ?? 'Request was not successful');
  }
  return body.data;
}

export const productsApi = {
  list: (page = 1, pageSize = 12): Promise<PaginatedResponse<Product>> =>
    fetch(`${BASE_URL}/products?page=${page}&pageSize=${pageSize}`).then((r) =>
      unwrap<PaginatedResponse<Product>>(r)
    ),

  getById: (id: string): Promise<Product> =>
    fetch(`${BASE_URL}/products/${id}`).then((r) => unwrap<Product>(r)),

  categories: (): Promise<string[]> =>
    fetch(`${BASE_URL}/products-metadata/categories`).then((r) =>
      unwrap<string[]>(r)
    ),
};
