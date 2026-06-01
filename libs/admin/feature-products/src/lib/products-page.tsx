import { useProducts } from '@org/admin/data';
import { ProductRow } from '@org/admin/ui';

/**
 * Smart admin page (type:feature). Orchestrates the data-access hook and the
 * dumb ui row. This is the only React layer allowed to depend on both
 * data-access and ui — exactly mirroring the Angular shop's feature library,
 * which is the point: identical architecture, two different frameworks.
 */
export function ProductsPage() {
  const { products, total, loading, error } = useProducts(12);

  return (
    <section className="products">
      <h2>Products Admin</h2>
      <p className="muted">{total} products in catalog</p>

      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Reviews</th>
              <th>In stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default ProductsPage;
