import { render, screen } from '@testing-library/react';
import type { Product } from '@org/models';
import { ProductRow } from './product-row';

const product: Product = {
  id: '42',
  name: 'Test Widget',
  description: 'A widget',
  price: 25,
  category: 'home',
  imageUrl: '',
  inStock: false,
  rating: 4.25,
  reviewCount: 1500,
};

function wrap(ui: React.ReactElement) {
  return render(
    <table>
      <tbody>{ui}</tbody>
    </table>
  );
}

describe('ProductRow', () => {
  it('renders name and shared-formatted price/rating/count', () => {
    wrap(<ProductRow product={product} />);
    expect(screen.getByText('Test Widget')).toBeTruthy();
    expect(screen.getByText('$25.00')).toBeTruthy();
    expect(screen.getByText('4.3 ★')).toBeTruthy();
    expect(screen.getByText('1.5k reviews')).toBeTruthy();
  });
});
