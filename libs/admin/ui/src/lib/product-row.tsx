import { formatCount, formatPrice, formatRating } from '@org/util-format';
import type { Product } from '@org/models';

export interface ProductRowProps {
  product: Product;
}

/**
 * Presentational table row (type:ui). No data-access dependency: it receives a
 * Product and renders it. Reuses formatPrice/formatRating/formatCount from
 * @org/util-format — the very same helpers the Angular shop uses, which is the
 * concrete demonstration of cross-framework code reuse in this monorepo.
 */
export function ProductRow({ product }: ProductRowProps) {
  return (
    <tr className={product.inStock ? '' : 'out'}>
      <td>{product.name}</td>
      <td className="muted">{product.category}</td>
      <td className="price">{formatPrice(product.price)}</td>
      <td>{formatRating(product.rating)}</td>
      <td className="muted">{formatCount(product.reviewCount)} reviews</td>
      <td>{product.inStock ? 'Yes' : 'No'}</td>
    </tr>
  );
}

export default ProductRow;
