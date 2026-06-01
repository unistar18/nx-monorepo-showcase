import { render, screen } from '@testing-library/react';
import type { Product } from '@org/models';
import { ProductsPage } from './products-page';

// Mock the data-access hook so the feature test stays a pure UI/orchestration
// test — no network, no real fetch. This mirrors the layering: the feature
// depends on data-access, which we stub here.
const sample: Product = {
  id: '1',
  name: 'Mechanical Keyboard',
  description: 'A board',
  price: 129,
  category: 'electronics',
  imageUrl: '',
  inStock: true,
  rating: 4.5,
  reviewCount: 1200,
};

const useProductsMock = vi.fn();
vi.mock('@org/admin/data', () => ({
  useProducts: () => useProductsMock(),
}));

describe('ProductsPage', () => {
  it('renders rows for the products from the hook', () => {
    useProductsMock.mockReturnValue({
      products: [sample],
      total: 1,
      loading: false,
      error: null,
      reload: vi.fn(),
    });

    render(<ProductsPage />);

    expect(screen.getByText('Products Admin')).toBeTruthy();
    expect(screen.getByText('Mechanical Keyboard')).toBeTruthy();
    expect(screen.getByText('1 products in catalog')).toBeTruthy();
  });

  it('shows a loading state', () => {
    useProductsMock.mockReturnValue({
      products: [],
      total: 0,
      loading: true,
      error: null,
      reload: vi.fn(),
    });

    render(<ProductsPage />);
    expect(screen.getByText(/Loading/)).toBeTruthy();
  });
});
