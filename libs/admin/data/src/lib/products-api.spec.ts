import type { ApiResponse, PaginatedResponse, Product } from '@org/models';
import { productsApi } from './products-api';

const sample: Product = {
  id: '1',
  name: 'Mock',
  description: 'Mock product',
  price: 9.99,
  category: 'other',
  imageUrl: '',
  inStock: true,
  rating: 4,
  reviewCount: 10,
};

function envelope<T>(data: T): ApiResponse<T> {
  return { data, success: true };
}

describe('productsApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lists products and unwraps the ApiResponse envelope', async () => {
    const page: PaginatedResponse<Product> = {
      items: [sample],
      total: 1,
      page: 1,
      pageSize: 12,
      totalPages: 1,
    };
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify(envelope(page)), { status: 200 })
      );
    const result = await productsApi.list();
    expect(result.items).toEqual([sample]);
    expect(fetchMock).toHaveBeenCalledWith('/api/products?page=1&pageSize=12');
  });

  it('throws on a non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('nope', { status: 500 })
    );
    await expect(productsApi.list()).rejects.toThrow('Request failed: 500');
  });

  it('throws when the envelope reports failure', async () => {
    const body: ApiResponse<null> = {
      data: null,
      success: false,
      error: 'boom',
    };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(body), { status: 200 })
    );
    await expect(productsApi.getById('1')).rejects.toThrow('boom');
  });
});
